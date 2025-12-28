use axum::Router;
use crate::db::AppState;

pub mod steam;
// pub mod users; // later

pub fn api_router() -> Router<AppState> {
    Router::new()
        .nest("/steam", steam::router())
}
