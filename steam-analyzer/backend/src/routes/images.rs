use axum::{
    extract::{Path, State},
    response::IntoResponse,
    routing::get,
    Router,
};
use axum::http::{StatusCode, header};
use axum::body::Body;
use crate::db::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/banner/:appid", get(get_banner_image))
        .route("/icon/:appid/:hash", get(get_icon_image))
}

async fn get_banner_image(
    State(state): State<AppState>,
    Path(appid): Path<String>,
) -> impl IntoResponse {
    // Try hero first
    let hero_url = format!("https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{}/library_hero.jpg", appid);
    
    if let Ok(resp) = state.client.get(&hero_url).send().await {
        if resp.status().is_success() {
             let stream = Body::from_stream(resp.bytes_stream());
             return (StatusCode::OK, [(header::CONTENT_TYPE, "image/jpeg")], stream).into_response();
        }
    }

    // Try header second
    let header_url = format!("https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{}/header.jpg", appid);
    if let Ok(resp) = state.client.get(&header_url).send().await {
         if resp.status().is_success() {
             let stream = Body::from_stream(resp.bytes_stream());
             return (StatusCode::OK, [(header::CONTENT_TYPE, "image/jpeg")], stream).into_response();
        }
    }

    // Fallback: Return empty 200 OK with no content type or a specific placeholder
    // For now, let's return a 200 OK text indicating no image, which the frontend won't render but won't 404.
    // Better yet, return a 1x1 transparent GIF to be valid image data.
    // 1x1 transparent gif bytes
    let transparent_gif = vec![
        0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xFF, 0xFF, 0xFF,
        0x00, 0x00, 0x00, 0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2C, 0x00, 0x00, 0x00, 0x00,
        0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3B
    ];

    (StatusCode::OK, [(header::CONTENT_TYPE, "image/gif")], Body::from(transparent_gif)).into_response()
}

async fn get_icon_image(
    State(state): State<AppState>,
    Path((appid, hash)): Path<(String, String)>,
) -> impl IntoResponse {
    let icon_url = format!("https://media.steampowered.com/steamcommunity/public/images/apps/{}/{}.jpg", appid, hash);

    if let Ok(resp) = state.client.get(&icon_url).send().await {
        if resp.status().is_success() {
             let stream = Body::from_stream(resp.bytes_stream());
             return (StatusCode::OK, [(header::CONTENT_TYPE, "image/jpeg")], stream).into_response();
        }
    }

    // Fallback 1x1 transparent gif
    let transparent_gif = vec![
        0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xFF, 0xFF, 0xFF,
        0x00, 0x00, 0x00, 0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2C, 0x00, 0x00, 0x00, 0x00,
        0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3B
    ];

    (StatusCode::OK, [(header::CONTENT_TYPE, "image/gif")], Body::from(transparent_gif)).into_response()
}
