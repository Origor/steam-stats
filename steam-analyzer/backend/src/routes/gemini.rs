use crate::db::AppState;
use axum::{extract::State, routing::post, Json, Router};
use serde::Deserialize;
use serde_json::{json, Value};
use std::env;

#[derive(Deserialize)]
struct GenerateRequest {
    prompt: String,
}

pub fn router() -> Router<AppState> {
    Router::new().route("/generate", post(generate_content))
}

async fn generate_content(
    State(state): State<AppState>,
    Json(payload): Json<GenerateRequest>,
) -> Json<Value> {
    let api_key = env::var("GEMINI_API_KEY").unwrap_or_default();

    if api_key.is_empty() {
        return Json(json!({"error": "Server configuration error: Missing Google API Key"}));
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
