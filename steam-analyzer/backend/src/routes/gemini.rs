use crate::db::AppState;
use axum::{
    extract::{ConnectInfo, State},
    routing::post,
    Json, Router,
};
use serde::Deserialize;
use serde_json::{json, Value};
use std::env;
use std::net::SocketAddr;

#[derive(Deserialize)]
struct GenerateRequest {
    prompt: String,
}

pub fn router() -> Router<AppState> {
    Router::new().route("/generate", post(generate_content))
}

async fn generate_content(
    State(state): State<AppState>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    Json(payload): Json<GenerateRequest>,
) -> Json<Value> {
    let api_key = env::var("GEMINI_API_KEY").unwrap_or_default();

    if api_key.is_empty() {
        return Json(json!({"error": "Server configuration error: Missing Google API Key"}));
    }

    // 0. Check User Rate Limit (IP based spam protection)
    if let Err(_) = state.user_limiter.check_key(&addr.ip()) {
        return Json(json!({
            "error": "Too many requests. Please try again later."
        }));
    }

    // 1. Check Rate Limits (RPM: 5, RPD: 20)
    let pool = &state.db;

    // Check records in the last minute (RPM)
    let rpm_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM gemini_usage_logs WHERE timestamp > datetime('now', '-1 minute')",
    )
    .fetch_one(pool)
    .await
    .unwrap_or(0);

    if rpm_count >= 5 {
        return Json(json!({
            "error": "Rate limit exceeded (5 requests/minute). Please try again in a moment."
        }));
    }

    // Check records in the last 24 hours (RPD)
    let rpd_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM gemini_usage_logs WHERE timestamp > datetime('now', '-1 day')",
    )
    .fetch_one(pool)
    .await
    .unwrap_or(0);

    if rpd_count >= 20 {
        return Json(json!({
            "error": "Daily rate limit exceeded (20 requests/day). Resets rolling 24h."
        }));
    }

    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key={}",
        api_key
    );

    let client = &state.client;
    let request_body = json!({
        "contents": [{
            "parts": [{ "text": payload.prompt }]
        }]
    });

    let res = client.post(&url).json(&request_body).send().await;

    match res {
        Ok(response) => {
            if response.status().is_success() {
                // Log usage on success
                // We're just firing and forgetting the log insertion for simplicity, or we wait for it.
                // Better to await to ensure consistency for strict rate limits.
                let _ = sqlx::query("INSERT INTO gemini_usage_logs (tokens_estimated) VALUES (0)")
                    .execute(pool)
                    .await;

                match response.json::<Value>().await {
                    Ok(data) => {
                        // Extract text to match frontend expectation or return full object
                        // The frontend hook expects just the text, but let's return the full response struct
                        // and let frontend parse it, OR we can normalize it here.
                        // Let's normalize it to return { "text": "..." } or similar,
                        // but to keep it versatile let's return the full Gemni response structure for now
                        // and let the frontend helper parse it.
                        Json(data)
                    }
                    Err(_) => Json(json!({"error": "Failed to parse AI response"})),
                }
            } else {
                Json(json!({"error": format!("AI Provider Error: {}", response.status())}))
            }
        }
        Err(e) => Json(json!({"error": format!("Failed to reach AI provider: {}", e)})),
    }
}
