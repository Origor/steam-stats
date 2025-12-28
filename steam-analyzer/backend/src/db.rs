use sqlx::{sqlite::SqlitePoolOptions, Pool, Sqlite};
use std::env;

#[derive(Clone)]
pub struct AppState {
    pub db: Pool<Sqlite>,
    pub client: reqwest::Client,
}

pub async fn init_db() -> Result<Pool<Sqlite>, sqlx::Error> {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    // Run migrations
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await?;

    println!("✅ Database migration success");

    Ok(pool)
}
