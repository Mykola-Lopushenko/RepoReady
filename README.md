# 🚀 RepoReady

Analyze a GitHub repository and see how portfolio-ready it is.

RepoReady evaluates project quality across documentation, structure, and engineering practices, and provides AI-powered feedback on README files.

---

## 🌐 Live Demo

* 🖥 Frontend: https://repo-ready-theta.vercel.app/
* ⚙️ Backend API: https://repoready.onrender.com/api/analyze

---

## ✨ Features

* 📊 Portfolio readiness scoring (0–10)
* 📂 Analysis of project structure (src, tests, Docker, etc.)
* 📄 README quality evaluation
* 🤖 AI-powered README feedback
* 💡 Actionable recommendations to improve your repo

---

## 🧠 How It Works

RepoReady checks your repository in 3 key areas:

### 📘 Documentation

* README presence
* Installation instructions
* Usage examples
* Demo or live link

### 🏗 Structure

* Organized project structure (src folder)
* Environment configuration (.env.example)
* GitHub workflows

### ⚙️ Engineering

* Tests presence
* Docker support
* Production readiness

---

## 🤖 AI Analysis

RepoReady uses AI to analyze your README and provide:

* What is good
* What is missing
* How to improve

---

## 📡 API Usage

Endpoint:
POST /api/analyze

Request example:
{
"repoUrl": "https://github.com/user/repo"
}

---

## 🛠 Tech Stack

Frontend:

* React (Vite)
* Axios
* Framer Motion

Backend:

* Node.js
* Express

AI:

* OpenAI API

---

## ⚠️ Notes

* Backend is hosted on Render (free tier), so it may take a few seconds to wake up.
* AI analysis depends on OpenAI API usage.

---

## 🔧 Local Setup

### 1. Clone the repo

git clone https://github.com/Mykola-Lopushenko/RepoReady.git
cd RepoReady

---

### 2. Install dependencies

Backend:
- cd server
- npm install

Frontend:
- cd ../client
- npm install

---

### 3. Environment variables

Create a `.env` file in `/server`:

OPENAI_API_KEY=your_key_here
GITHUB_TOKEN=your_token_here
PORT=5000

---

### 4. Run the project

Backend:
- cd server
- npm run dev

Frontend:
- cd client
- npm run dev

---

## 📈 Future Improvements

* Add GitHub authentication
* Analyze commits and activity
* Support private repositories
* Improve AI feedback depth
* Add project comparison feature

---

## 👤 Author

Mykola Lopushenko
https://github.com/Mykola-Lopushenko

---

## ⭐ If you like this project

Give it a star ⭐
