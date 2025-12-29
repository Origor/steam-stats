use governor::{
    clock::DefaultClock,
    middleware::NoOpMiddleware,
    state::{keyed::DefaultKeyedStateStore, InMemoryState},
    Quota, RateLimiter,
};
use nonzero_ext::nonzero;
use sqlx::{sqlite::SqlitePoolOptions, Pool, Sqlite};
use std::env;
use std::net::IpAddr;
use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {
    pub db: Pool<Sqlite>,
    pub client: reqwest::Client,
    pub steam_global_limiter:
        Arc<RateLimiter<governor::state::NotKeyed, InMemoryState, DefaultClock, NoOpMiddleware>>,
    pub user_limiter:
        Arc<RateLimiter<IpAddr, DefaultKeyedStateStore<IpAddr>, DefaultClock, NoOpMiddleware>>,
}

pub async fn init_db() -> Result<Pool<Sqlite>, sqlx::Error> {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    // Run migrations
    sqlx::migrate!("./migrations").run(&pool).await?;

    println!("✅ Database migration success");

    Ok(pool)
}
