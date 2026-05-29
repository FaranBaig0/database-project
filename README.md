# VERVAX

A modern, responsive full-stack social media application built for seamless community interactions, content creation, and media streams. Component-driven React architecture optimized for performance across mobile and desktop.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Code Quality](#code-quality)
- [GitHub Topics](#github-topics)

---

## 🛠️ Tech Stack

| Technology | Role |
|---|---|
| [React.js](https://react.dev/) | Component-driven SPA framework |
| [Vite](https://vitejs.dev/) | Build tool with HMR and optimized bundling |
| [react-icons](https://react-icons.github.io/react-icons/) | Icon library (Sl, Tb, Tfi, Ti sets) |
| CSS Modules | Scoped component-level styling |
| [ESLint](https://eslint.org/) | Static analysis and code quality enforcement |

---

## ✨ Key Features

- **Social Feed** — Dynamic rendering of posts, interactions, and rich-media content blocks.
- **Polished UI Components** — Consistent typography, spacing, and SVG icon integration across all views.
- **Optimized Bundle Size** — Vite code-splitting keeps load times fast on both mobile and desktop.
- **Code Quality Enforcement** — ESLint configuration (`eslint.config.js`) maintains clean, reliable syntax throughout the codebase.

---

## 📁 Repository Structure

```
VERVAX/
├── src/                    # Components, hooks, and views
├── eslint.config.js        # Linting rules and configuration
├── vite.config.js          # Build and dev server configuration
├── .gitignore              # Untracked paths (node_modules, dist, etc.)
└── package.json            # Scripts and dependency manifest
```

> `node_modules/` is excluded from version control via `.gitignore`.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.x or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```bash
# Navigate to the project root
cd VERVAX

# Install dependencies
npm install
```
```bash
# Navigate to the server root
cd VERVAX/server

# Install dependencies
npm run dev
```
### Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

---

## 🔧 Code Quality

Run the linter before committing to catch errors and enforce consistent syntax:

```bash
npm run lint
```

---

## 🏷️ GitHub Topics

Suggested repository topics for discoverability:

`react` `vite` `javascript` `social-media` `frontend` `web-development` `react-icons` `eslint`
