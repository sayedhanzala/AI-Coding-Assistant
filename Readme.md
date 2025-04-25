# 🧠 AI Code Iterator Tool

A lightweight, AI-powered assistant that helps developers iterate on code by suggesting intelligent improvements based on selected code and developer prompts. Inspired by tools like Cursor, this proof of concept is built to integrate with Aicade’s code editor or function as a standalone productivity booster.

---

## 🚀 Features

- 🖊️ Select code from editor and describe desired changes
- 🤖 Get modified code suggestions powered by **Gemini AI**
- 📄 Clear explanation of changes
- 🔁 "Integrate Code" button replaces selected code with AI-suggested version
- 🧠 Built for game dev workflows and extensible for larger systems

---

## 🛠️ Tech Stack

- **Frontend:** React + Monaco Editor
- **Backend:** FastAPI
- **AI Model:** Google Gemini (used via API)
- **Language Support:** Python (can be extended)

---

## 🧑‍💻 How It Works

1. **User selects code** from the editor.
2. **Inputs a prompt** describing the change (e.g., _“optimize this loop”_).
3. **Hits “Suggest Change”**, which sends code + prompt to the FastAPI backend.
4. **Gemini model** generates a code improvement suggestion and explanation.
5. **User reviews and integrates** the change using the “Integrate Code” button.

---

## 📦 Installation

### 🔌 Frontend (React)

```bash
cd frontend
npm install
npm run dev
```
### 🔌 Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## 🧪 Example Prompts
- Convert this function to an arrow function”

- “Add error handling to this block”

- “Refactor this to use async/await”