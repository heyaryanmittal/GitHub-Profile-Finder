# GitHub Profile Finder

A sleek, modern web app to explore any GitHub user's profile and browse all their repositories instantly.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)

## ✨ Features

- **Auto-Search** — Just type a GitHub username and results appear instantly (debounced, no button click needed)
- **Profile Card** — Displays avatar, name, bio, location, company, blog, join date, followers, following, and public repo count
- **Repository Grid** — All repos displayed in a responsive 3-column grid, each card clickable to open the repo on GitHub
- **Pagination** — Fetches all repositories, even for users with 100+ repos
- **Beautiful UI** — Dark theme with glassmorphism, purple accents, smooth animations, and stylish Playfair Display serif heading
- **No Rate Limits** — Uses GitHub Personal Access Token for 5,000 requests/hour

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)

### Installation

```bash
git clone https://github.com/heyaryanmittal/GitHub-Profile-Finder.git
cd GitHub-Profile-Finder
npm install
```

### Setup GitHub Token (Required)

1. Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Generate a new **classic token** (no scopes needed)
3. Create a `.env` file in the project root:

```env
VITE_GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE
```

### Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠️ Tech Stack

- **React 19** — UI library
- **Vite 7** — Build tool & dev server
- **Tailwind CSS 3** — Utility-first CSS
- **GitHub REST API** — Data source

## 📁 Project Structure

```
├── index.html           # Entry HTML with Google Fonts
├── .env                 # GitHub token (gitignored)
├── src/
│   ├── App.jsx          # Main application component
│   ├── index.css        # Design system & animations
│   └── main.jsx         # React entry point
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
