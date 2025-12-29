use axum::{routing::get, Router};
use dotenvy::dotenv;
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};

mod db;
mod models;
mod routes;
mod steam_api;

use governor::{Quota, RateLimiter};
use std::num::NonZeroU32;
use std::sync::Arc;
use std::time::Duration;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let pool = db::init_db().await.expect("Failed to initialize database");

    // Create a reqwest client to reuse
    let client = reqwest::Client::new();

    // Global Steam Rate Limiter: ~200 requests per 5 minutes
    // We'll set it to 190 to be safe
    let steam_quota = Quota::with_period(Duration::from_secs(300))
        .unwrap()
        .allow_burst(NonZeroU32::new(190).unwrap());
    let steam_global_limiter = Arc::new(RateLimiter::direct(steam_quota));

    let app_state = db::AppState {
        db: pool,
        client,
        steam_global_limiter,
    };

    let app = Router::new()
        .route("/", get(|| async { "Steam Analyzer Backend Running" }))
        .nest("/api", routes::api_router())
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        )
        .with_state(app_state);

    let host = std::env::var("HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let port = std::env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let addr: SocketAddr = format!("{}:{}", host, port)
        .parse()
        .expect("Invalid address");

    println!("listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
