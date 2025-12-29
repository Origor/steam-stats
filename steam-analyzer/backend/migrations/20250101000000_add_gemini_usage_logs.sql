CREATE TABLE gemini_usage_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    tokens_estimated INTEGER DEFAULT 0
);

CREATE INDEX idx_gemini_usage_timestamp ON gemini_usage_logs(timestamp);
