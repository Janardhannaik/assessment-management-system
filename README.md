# Assessment Management System (AMS)

## Project Overview

A full-stack Assessment Management System (AMS) built with **MERN stack** and Puppeteer for PDF report generation. The system allows adding assessments, managing sessions, generating PDF reports dynamically based on configuration, and viewing session data.

### Features

* User Authentication (Signup/Login) with JWT.
* Add and view multiple assessment sessions.
* Dynamic PDF report generation using **EJS templates** and **Puppeteer**.
* Config-driven system: Add new assessment types without code changes.
* Frontend built with **React + TailwindCSS + React Router**.
* Backend built with **Node.js + Express**.

## File Structure

```
AMS/
├─ backend/
│  ├─ data.js                 # Assessment session data
│  ├─ assessments-config.json  # Assessment configuration
│  ├─ server.js                # Main backend server
│  ├─ users.json               # User data (auto-created)
│  ├─ templates/               # EJS templates for reports
│  │   └─ report.ejs
│  └─ utils/
│      ├─ authMiddleware.js    # JWT authentication middleware
│      └─ jsonPath.js          # Helper to get nested values via path
├─ frontend/
│  ├─ src/
│  │   ├─ components/          # React components
│  │   ├─ pages/               # Pages: Login, Dashboard, Report
│  │   ├─ App.jsx
│  │   └─ main.jsx
│  ├─ .env                     # Frontend environment variables
│  └─ package.json
├─ .env                        # Backend environment variables
└─ README.md
```

## Backend Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Create `.env` file in backend folder

```env
PORT=5000
JWT_SECRET=your_jwt_secret
REPORT_DIR=./reports
```

### 3. Run backend server

```bash
npm run dev
```

* Backend runs on `http://localhost:5000`
* `reports/` folder will store generated PDFs

## Frontend Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Create `.env` file in frontend folder

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Run frontend server

```bash
npm run dev
```

* Frontend runs on `http://localhost:5173` (Vite default)

### Frontend Packages

```json
"dependencies": {
  "axios": "^1.12.2",
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.9.1"
},
"devDependencies": {
  "@eslint/js": "^9.36.0",
  "@tailwindcss/postcss7-compat": "^2.2.17",
  "@types/react": "^19.1.13",
  "@types/react-dom": "^19.1.9",
  "@vitejs/plugin-react": "^5.0.3",
  "autoprefixer": "^10.4.21",
  "eslint": "^9.36.0",
  "eslint-plugin-react-hooks": "^5.2.0",
  "eslint-plugin-react-refresh": "^0.4.20",
  "globals": "^16.4.0",
  "postcss": "^8.5.6",
  "tailwindcss": "3.4",
  "vite": "^7.1.7"
}
```

### Backend Packages

```json
"dependencies": {
  "bcrypt": "^6.0.0",
  "bcryptjs": "^3.0.2",
  "body-parser": "^2.2.0",
  "cors": "^2.8.5",
  "dotenv": "^17.2.2",
  "ejs": "^3.1.10",
  "express": "^5.1.0",
  "jsonwebtoken": "^9.0.2",
  "puppeteer": "^24.22.0",
  "uuid": "^13.0.0"
}
```

## Adding a New Assessment

1. **Add to `assessments-config.json`**

```json
"as_new_01": {
  "title": "New Assessment",
  "sections": [ ... ],
  "classifications": { ... }
}
```

2. **Add session data to `data.js`**

```js
{
  session_id: "session_004",
  assessment_id: "as_new_01",
  ...otherFields
}
```

3. **Restart backend** to load new assessment config

## Running Locally

1. Clone the repo
2. Install backend dependencies and create `.env`
3. Install frontend dependencies and create `.env`
4. Run backend: `npm run dev`
5. Run frontend: `npm run dev`
6. Open browser at `http://localhost:5173`

## Notes

* All new assessments must have both **config in `assessments-config.json`** and **session data in `data.js`**
* Generated PDF reports are saved in `backend/reports/`
* Authentication is JWT-based, tokens expire in 8 hours
* Dynamic report fields use **JSON path** from config

##Sample Images
#Sample Video Link :- https://drive.google.com/file/d/1qMVlZbDBTOqygZ1ywHRly2uAfZMS7c25/view?usp=drivesdk

#Dashboard
<img width="1303" height="577" alt="Dashboard2" src="https://github.com/user-attachments/assets/bbec4c74-e92d-401e-97f2-434767bf6b4f" />

#Login/Signup
<img width="1310" height="561" alt="Login" src="https://github.com/user-attachments/assets/b94cb08a-0217-4d40-a8c7-67c8359ba2cf" />

#PDF Generate
<img width="1337" height="577" alt="PDF" src="https://github.com/user-attachments/assets/58991c76-db4b-433e-8c86-5acd49f13091" />




---

**Project by Janardhan Naik**
