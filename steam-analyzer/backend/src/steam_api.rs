use serde::Deserialize;
use serde_json::Value; // Added import for Value since it is used in fetch_steam_api

#[derive(Deserialize, Debug)]
pub struct SteamResponse<T> {
    pub response: T,
}

pub async fn fetch_player_summary(
    client: &reqwest::Client,
    api_key: &str,
    steam_id: &str,
) -> Result<Value, reqwest::Error> {
    let url = format!(
        "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={}&steamids={}",
        api_key, steam_id
    );
    let res = client.get(&url).send().await?.json::<Value>().await?;
    Ok(res)
}

pub async fn fetch_owned_games(
    client: &reqwest::Client,
    api_key: &str,
    steam_id: &str,
) -> Result<Value, reqwest::Error> {
    let url = format!(
        "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key={}&steamid={}&include_appinfo=1&include_played_free_games=1",
        api_key, steam_id
    );
    let res = client.get(&url).send().await?.json::<Value>().await?;
    Ok(res)
}

pub async fn fetch_player_achievements(
    client: &reqwest::Client,
    api_key: &str,
    steam_id: &str,
    app_id: &str,
) -> Result<Value, reqwest::Error> {
    let url = format!(
        "http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid={}&key={}&steamid={}",
        app_id, api_key, steam_id
    );
    let res = client.get(&url).send().await?.json::<Value>().await?;
    Ok(res)
}
