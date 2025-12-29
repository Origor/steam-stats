use governor::{
    clock::DefaultClock, middleware::NoOpMiddleware, state::InMemoryState, RateLimiter,
};
use serde::Deserialize;
use serde_json::Value;
use std::time::Duration;
use tokio::time::sleep;

#[derive(Deserialize, Debug)]
pub struct SteamResponse<T> {
    pub response: T,
}

// Helper to handle rate limiting and 429 backoff
async fn execute_with_retry<F>(
    limiter: &RateLimiter<governor::state::NotKeyed, InMemoryState, DefaultClock, NoOpMiddleware>,
    request_maker: F,
) -> Result<Value, reqwest::Error>
where
    F: Fn() -> reqwest::RequestBuilder,
{
    limiter.until_ready().await;

    let mut retries = 0;
    let max_retries = 3;
    let mut backoff = Duration::from_secs(1);

    loop {
        let request = request_maker();
        match request.send().await {
            Ok(res) => {
                if res.status() == reqwest::StatusCode::TOO_MANY_REQUESTS {
                    if retries >= max_retries {
                        // Return the 429 response as an error or handle it.
                        // reqwest::Response::error_for_status might be useful but we have the response.
                        // We can try to get the text to see if there is extra info.
                        return res.error_for_status().map(|_| Value::Null); // Should error
                    }
                    eprintln!("Rate limited by Steam (429). Retrying in {:?}...", backoff);
                    sleep(backoff).await;
                    retries += 1;
                    backoff *= 2;
                    continue;
                }
                return res.json::<Value>().await;
            }
            Err(e) => return Err(e),
        }
    }
}

pub async fn fetch_player_summary(
    client: &reqwest::Client,
    api_key: &str,
    steam_id: &str,
    limiter: &RateLimiter<governor::state::NotKeyed, InMemoryState, DefaultClock, NoOpMiddleware>,
) -> Result<Value, reqwest::Error> {
    let url = format!(
        "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={}&steamids={}",
        api_key, steam_id
    );
    execute_with_retry(limiter, || client.get(&url)).await
}

pub async fn fetch_owned_games(
    client: &reqwest::Client,
    api_key: &str,
    steam_id: &str,
    limiter: &RateLimiter<governor::state::NotKeyed, InMemoryState, DefaultClock, NoOpMiddleware>,
) -> Result<Value, reqwest::Error> {
    let url = format!(
        "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key={}&steamid={}&include_appinfo=1&include_played_free_games=1",
        api_key, steam_id
    );
    execute_with_retry(limiter, || client.get(&url)).await
}

pub async fn fetch_player_achievements(
    client: &reqwest::Client,
    api_key: &str,
    steam_id: &str,
    app_id: &str,
    limiter: &RateLimiter<governor::state::NotKeyed, InMemoryState, DefaultClock, NoOpMiddleware>,
) -> Result<Value, reqwest::Error> {
    let url = format!(
        "http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid={}&key={}&steamid={}",
        app_id, api_key, steam_id
    );
    execute_with_retry(limiter, || client.get(&url)).await
}
