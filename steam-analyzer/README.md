# Steam Analyzer 🎮

**Steam Analyzer** (also known as *Steam Insight*) is a modern, data-driven dashboard that analyzes your Steam profile to provide deep insights into your gaming habits. It combines real-time data from the Steam API with AI-powered analysis to give you a fresh perspective on your library.

## ✨ Features

- **Profile Statistics**:
  - **Pile of Shame**: Calculate the percentage of unplayed games in your library.
  - **Playtime Analysis**: Total hours played, average session length, and library value.
  - **Visual Charts**: Interactive bar charts for top games and donut charts for library distribution.

- **🤖 AI-Powered Insights (Gemini)**:
  - **Gamer Profiler**: Analyzes your playstyle to generate a unique "Gamer Personality".
  - **Account Appraiser**: Estimates the "emotional and effort value" of your account.
  - **Backlog Recommender**: Smart suggestions on what to play next based on your history.

- **Detailed Game Views**:
  - **Activity Heatmap**: Visualize your achievement unlock history.
  - **Achievement Vault**: Browse detailed lists of unlocked trophies.
  - **Deep Links**: Quick access to SteamDB and the Steam Store for every game.

- **Tech**:
  - **Demo Mode**: Explore the app features with sample data without logging in.
  - **CORS Proxy Support**: Option to use a proxy for client-side API calls.
  - **Responsive Design**: Built with a mobile-first approach using Tailwind CSS.

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: Custom SVG implementations

### Backend
- **Language**: [Rust](https://www.rust-lang.org/)
- **Web Framework**: [Axum](https://github.com/tokio-rs/axum)
- **Database**: [SQLite](https://sqlite.org/) (via [SQLx](https://github.com/launchbadge/sqlx))
- **Runtime**: [Tokio](https://tokio.rs/)

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+
- **Rust**: Latest stable toolchain (`rustup`)
- **API Keys**:
  - [Steam Web API Key](https://steamcommunity.com/dev/apikey)
  - [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/steam-analyzer.git
   cd steam-analyzer
   ```

2. **Setup Frontend**
   ```bash
   npm install
   ```

3. **Setup Backend**
   ```bash
   cd backend
   # Create a .env file for the backend
   echo "DATABASE_URL=sqlite:steam_stats.db" > .env
   echo "STEAM_API_KEY=your_steam_api_key_here" >> .env
   
   # Initialize the database (if using sqlx-cli, or let the app handle it)
   # cargo sqlx database create
   cd ..
   ```

### Configuration

Create a `.env` file in the **backend** directory:
```env
DATABASE_URL=sqlite:steam_stats.db
STEAM_API_KEY=your_steam_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
HOST=127.0.0.1
PORT=3000
```

## 🚢 Deployment

For detailed deployment instructions, including how to set up Nginx and Systemd services, please refer to [DEPLOYING.md](DEPLOYING.md).

## 🏃‍♂️ Usage

### Running the Project

You can run both the frontend and backend concurrently for the full experience.

**Terminal 1: Frontend**
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

**Terminal 2: Backend**
```bash
cd backend
cargo run
```
The server will start on `http://localhost:3000`.
