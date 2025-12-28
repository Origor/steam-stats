use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, sqlx::FromRow, Debug, Clone)]
pub struct User {
    pub steam_id: String,
    pub username: Option<String>,
    pub avatar_url: Option<String>,
    pub last_updated: Option<String>, // simplified for now
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SteamSnapshot {
    pub steam_id: String,
    pub data_type: String,
    pub json_data: serde_json::Value,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Insight {
    pub steam_id: String,
    pub content_type: String,
    pub markdown_content: String,
}
