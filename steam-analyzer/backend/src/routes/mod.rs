use crate::db::AppState;
use axum::Router;

pub mod gemini;
pub mod images;
pub mod steam;
// pub mod users; // later

pub fn api_router() -> Router<AppState> {
    Router::new()
        .nest("/steam", steam::router())
        .nest("/images", images::router())
        .nest("/ai", gemini::router())
}
