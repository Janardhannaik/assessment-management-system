//
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const puppeteer = require("puppeteer");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const { get } = require("./utils/jsonPath");
const authMiddleware = require("./utils/authMiddleware");

const DATA = require("./data");
const CONFIG = require("./assessments-config.json");

const USERS_FILE = path.join(__dirname, "users.json");
const REPORT_DIR = path.resolve(
  process.env.REPORT_DIR || path.join(__dirname, "reports")
);
if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/reports", express.static(REPORT_DIR));

// Ensure users.json exists
if (!fs.existsSync(USERS_FILE))
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE));
}
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

/* ---------------------- SIGNUP ---------------------- */
app.post("/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email & password required" });

  const users = readUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase()))
    return res.status(400).json({ error: "email already exists" });

  const hash = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    name: name || "",
    email,
    passwordHash: hash,
    createdAt: Date.now(),
  };
  users.push(newUser);
  writeUsers(users);

  return res.json({ ok: true, id: newUser.id });
});

/* ---------------------- LOGIN ---------------------- */
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(401).json({ error: "invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: "invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "8h",
  });
  return res.json({ token });
});

/* ---------------------- Persistent Puppeteer Browser ---------------------- */
let browserInstance;
async function getBrowser() {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new",
    });
  }
  return browserInstance;
}

/* ---------------------- GENERATE REPORT ---------------------- */
app.post("/generate-report", authMiddleware, async (req, res) => {
  try {
    const sessionId = req.body.session_id || req.query.session_id;
    if (!sessionId)
      return res.status(400).json({ error: "session_id required" });

    const session = DATA.find((s) => s.session_id === sessionId);
    if (!session) return res.status(404).json({ error: "session not found" });

    const assessmentId = session.assessment_id;
    const assessmentConfig = CONFIG.assessments[assessmentId];
    if (!assessmentConfig)
      return res
        .status(400)
        .json({ error: `no config for assessment_id ${assessmentId}` });

    const renderedSections = assessmentConfig.sections.map((sec) => {
      const fields = sec.fields.map((f) => {
        let val = get(session, f.path);

        // Handle array filtered paths like exercises[?(@.id==235)]
        if (
          (val === undefined || val === null) &&
          f.path.includes("exercises[?(@.id==")
        ) {
          const match = f.path.match(/exercises\[.*@\.id==(\d+).*\]/);
          if (match) {
            const exId = parseInt(match[1]);
            const ex = session.exercises.find((e) => e.id === exId);
            val = ex?.setList?.[0]?.time ?? "—";
          }
        }

        if (typeof val === "object" && val !== null) val = JSON.stringify(val);

        // Handle BMI classification
        let classification = null;
        if (
          assessmentConfig.classifications &&
          assessmentConfig.classifications.BMI &&
          f.label &&
          f.label.toLowerCase().includes("bmi")
        ) {
          const numeric = Number(val);
          if (!isNaN(numeric)) {
            const cls = assessmentConfig.classifications.BMI.find(
              (r) => numeric >= r.min && numeric < r.max
            );
            classification = cls ? cls.label : null;
          }
        }

        return {
          label: f.label,
          value: val,
          note: f.note || null,
          classification,
        };
      });
      return { title: sec.title, fields };
    });

    const templatePath = path.join(
      __dirname,
      "templates",
      CONFIG.defaultTemplate || "report.ejs"
    );
    const html = await ejs.renderFile(templatePath, {
      session,
      sections: renderedSections,
      assessmentTitle: assessmentConfig.title,
      generatedAt: new Date().toISOString(),
    });

    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    const outputFile = path.join(REPORT_DIR, `${sessionId}.pdf`);
    await page.pdf({
      path: outputFile,
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
    });
    await page.close();

    return res.json({
      ok: true,
      url: `/reports/${sessionId}.pdf`,
      savedTo: outputFile,
    });
  } catch (err) {
    console.error("generate-report error", err);
    return res
      .status(500)
      .json({ error: "internal error", details: err.message });
  }
});

/* ---------------------- GET SESSION ---------------------- */
app.get("/session/:id", authMiddleware, (req, res) => {
  const sessionId = req.params.id;
  const session = DATA.find((s) => s.session_id === sessionId);
  if (!session) return res.status(404).json({ error: "not found" });
  return res.json(session);
});

/* ---------------------- HEALTH CHECK ---------------------- */
app.get("/", (req, res) => res.send("AMS Backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
