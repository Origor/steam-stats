# Build Stage
FROM rust:1.83-slim-bookworm as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

# Copy manifests first to cache dependencies
COPY Cargo.toml Cargo.lock ./

# Create a dummy main.rs to build dependencies
# This is a common pattern to cache compiled dependencies
RUN mkdir src && \
    echo "fn main() {println!(\"if you see this, the build broke\")}" > src/main.rs && \
    cargo build --release && \
    rm -rf src target/release/deps/backend*

# Copy the actual source code
COPY . .

# We need the database to compile with sqlx verification
# We'll create a temporary database for the build process
ENV DATABASE_URL=sqlite:///app/build_temp.db
RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*
RUN sqlite3 build_temp.db "VACUUM;"
# We need to run migrations to make sure the schema matches
# But we can't easily run the app's migration logic without building it first which is circular if we need it for build
# So we rely on sqlx-cli or just disabling offline mode if possible, but sqlx requires a DB at build time.
# Alternative: Install sqlx-cli to setup the DB
RUN cargo install sqlx-cli --no-default-features --features rustls,sqlite
RUN sqlx database create
RUN sqlx migrate run

# Build the application
RUN cargo build --release

# Runtime Stage
FROM debian:bookworm-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Copy the binary from the builder
COPY --from=builder /app/target/release/backend /app/start_backend

# Expose the application port
EXPOSE 3000

# Set environment variables (can be overridden)
ENV HOST=0.0.0.0
ENV PORT=3000

# Run the application
CMD ["/app/start_backend"]
