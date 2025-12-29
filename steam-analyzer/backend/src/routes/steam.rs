use crate::{db::AppState, steam_api};
use axum::{
    extract::{Path, State},
    routing::get,
    Json, Router,
};
use serde_json::{json, Value};
use sqlx::Row;
use std::env;
 // For simple time checking

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/user/:id", get(get_user_steam_data))
        .route(
            "/user/:id/achievements/:appid",
            get(get_player_achievements),
        )
}

async fn get_player_achievements(
    State(state): State<AppState>,
    Path((steam_id, app_id)): Path<(String, String)>,
) -> Json<Value> {
    // Check for cached achievements
    // Ideally we cache these too, but for now let's just fetch to get it working first
    // Then we can add caching logic similar to summary/games

    // Try cache first
    let cached_achievements = sqlx::query(
        "SELECT json_data FROM snapshots 
         WHERE steam_id = ? AND data_type = ? 
         ORDER BY created_at DESC LIMIT 1",
    )
    .bind(&steam_id)
    .bind(format!("achievements_{}", app_id))
    .fetch_optional(&state.db)
    .await
    .unwrap_or(None);

    if let Some(row) = cached_achievements {
        let json_str: String = row.get("json_data");
        if let Ok(val) = serde_json::from_str::<Value>(&json_str) {
            return Json(val);
        }
    }

    let api_key = env::var("STEAM_API_KEY").unwrap_or_default();
    match steam_api::fetch_player_achievements(&state.client, &api_key, &steam_id, &app_id).await {
        Ok(data) => {
            // Cache it
            let json_str = serde_json::to_string(&data).unwrap_or_default();
            let _ = sqlx::query(
                "INSERT INTO snapshots (steam_id, data_type, json_data) VALUES (?, ?, ?)",
            )
            .bind(&steam_id)
            .bind(format!("achievements_{}", app_id))
            .bind(json_str)
            .execute(&state.db)
            .await;

            Json(data)
        }
        Err(e) => {
            eprintln!("Failed to fetch achievements: {}", e);
            Json(json!({"error": "Failed to fetch achievements"}))
        }
    }
}

async fn get_user_steam_data(
    State(state): State<AppState>,
    Path(steam_id): Path<String>,
) -> Json<Value> {
    // Check for cached summary
    let cached_summary = sqlx::query(
        "SELECT json_data, created_at FROM snapshots 
         WHERE steam_id = ? AND data_type = 'player_summary' 
         ORDER BY created_at DESC LIMIT 1",
    )
    .bind(&steam_id)
    .fetch_optional(&state.db)
    .await
    .unwrap_or(None);

    let mut summary_data = None;
    let mut use_cache = false;

    if let Some(row) = cached_summary {
        // Simple check: if exists, we can use it.
        // TODO: Add robust 24h check with chrono.
        // For now, assuming if it's there it's good enough for MVP, or we can just always refresh if user asks.
        // Let's implement a basic "if older than 24h" logic later.
        let json_str: String = row.get("json_data");
        if let Ok(val) = serde_json::from_str::<Value>(&json_str) {
            summary_data = Some(val);
            use_cache = true;
        }
    }

    if !use_cache {
        // Fetch from Steam
        let api_key = env::var("STEAM_API_KEY").unwrap_or_default();
        match steam_api::fetch_player_summary(&state.client, &api_key, &steam_id).await {
            Ok(data) => {
                summary_data = Some(data.clone());
                // Save to DB
                let json_str = serde_json::to_string(&data).unwrap_or_default();
                let _ = sqlx::query(
                    "INSERT INTO snapshots (steam_id, data_type, json_data) VALUES (?, 'player_summary', ?)"
                )
                .bind(&steam_id)
                .bind(json_str)
                .execute(&state.db)
                .await;

                // Also upsert user table
                let players = data["response"]["players"].as_array();
                if let Some(players_arr) = players {
                    if let Some(p) = players_arr.first() {
                        let name = p["personaname"].as_str().unwrap_or("Unknown");
                        let avatar = p["avatarfull"].as_str().unwrap_or("");
                        let _ = sqlx::query(
                             "INSERT INTO users (steam_id, username, avatar_url) VALUES (?, ?, ?)
                              ON CONFLICT(steam_id) DO UPDATE SET username = ?, avatar_url = ?, last_updated = CURRENT_TIMESTAMP"
                         )
                         .bind(&steam_id)
                         .bind(name)
                         .bind(avatar)
                         .bind(name)
                         .bind(avatar)
                         .execute(&state.db)
                         .await;
                    }
                }
            }
            Err(e) => {
                eprintln!("Failed to fetch summary: {}", e);
            }
        }
    }

    // Fetch games (similar logic, kept simple here to do parallel fetch or sequential)
    // For MVP, just fetching summary and returning it combined with games if possible.

    // Let's fetch games too
    let cached_games = sqlx::query(
        "SELECT json_data FROM snapshots WHERE steam_id = ? AND data_type = 'owned_games' ORDER BY created_at DESC LIMIT 1"
    )
    .bind(&steam_id)
    .fetch_optional(&state.db)
    .await
    .unwrap_or(None);

    let mut games_data = None;
    if let Some(row) = cached_games {
        let json_str: String = row.get("json_data");
        if let Ok(val) = serde_json::from_str::<Value>(&json_str) {
            games_data = Some(val);
        }
    }

    if games_data.is_none() {
        let api_key = env::var("STEAM_API_KEY").unwrap_or_default();
        if let Ok(data) = steam_api::fetch_owned_games(&state.client, &api_key, &steam_id).await {
            games_data = Some(data.clone());
            let json_str = serde_json::to_string(&data).unwrap_or_default();
            let _ = sqlx::query(
                    "INSERT INTO snapshots (steam_id, data_type, json_data) VALUES (?, 'owned_games', ?)"
                )
                .bind(&steam_id)
                .bind(json_str)
                .execute(&state.db)
                .await;
        }
    }

    Json(json!({
        "player_summary": summary_data,
        "owned_games": games_data
    }))
}
