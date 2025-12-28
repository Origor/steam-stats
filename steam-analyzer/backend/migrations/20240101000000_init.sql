-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    steam_id TEXT PRIMARY KEY,
    username TEXT,
    avatar_url TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Snapshots table for caching API responses
CREATE TABLE IF NOT EXISTS snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    steam_id TEXT NOT NULL,
    data_type TEXT NOT NULL, -- 'library', 'achievements'
    json_data TEXT NOT NULL, -- Stored as JSON string
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(steam_id) REFERENCES users(steam_id)
);

-- Create Insights table for AI generated content
CREATE TABLE IF NOT EXISTS insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    steam_id TEXT NOT NULL,
    content_type TEXT NOT NULL, -- 'stats', 'guide'
    markdown_content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(steam_id) REFERENCES users(steam_id)
);
