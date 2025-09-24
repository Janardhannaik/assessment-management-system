const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const ejs = require("ejs");
const jp = require("jsonpath"); // JSONPath evaluation
const data = require("../data");
const CONFIG = require("../assessments-config.json");

const REPORT_DIR = path.join(__dirname, "../reports");
if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR);

// Helper to safely get JSONPath
function getValue(obj, jsonPath) {
  try {
    const result = jp.query(obj, jsonPath);
    if (result.length > 0) return result[0];
    return null;
  } catch (err) {
    return null;
  }
}

// Return all session IDs
router.get("/sessions", (req, res) => {
  const sessionIds = data.map((s) => ({ session_id: s.session_id }));
  res.json(sessionIds);
});

// Return single session
router.get("/session/:id", (req, res) => {
  const session = data.find((s) => s.session_id === req.params.id);
  if (!session) return res.status(404).json({ error: "Session not found" });
  res.json(session);
});

// Generate PDF report
router.post("/generate-report", async (req, res) => {
  const { session_id } = req.body;
  const session = data.find((s) => s.session_id === session_id);

  if (!session) return res.status(404).json({ error: "Session ID not found" });

  const assessmentConfig = CONFIG.assessments[session.assessment_id];
  if (!assessmentConfig)
    return res.status(400).json({ error: "Assessment config not found" });

  // Map sections and resolve field values
  const sections = assessmentConfig.sections.map((sec) => {
    const fields = sec.fields.map((f) => {
      const val = getValue(session, f.path);
      let classification = null;

      // BMI classification example
      if (
        f.label &&
        assessmentConfig.classifications &&
        assessmentConfig.classifications.BMI &&
        f.label.toLowerCase().includes("bmi")
      ) {
        const numVal = Number(val);
        if (!isNaN(numVal)) {
          const cls = assessmentConfig.classifications.BMI.find(
            (r) => numVal >= r.min && numVal < r.max
          );
          classification = cls ? cls.label : null;
        }
      }

      return {
        label: f.label,
        value: val !== null && val !== undefined ? val : null,
        classification,
      };
    });
    return { title: sec.title, fields };
  });

  try {
    const templatePath = path.join(
      __dirname,
      "../templates",
      CONFIG.defaultTemplate
    );

    const html = await ejs.renderFile(templatePath, {
      session,
      assessmentTitle: assessmentConfig.title,
      generatedAt: new Date().toLocaleString(),
      sections,
    });

    const pdfPath = path.join(REPORT_DIR, `${session_id}.pdf`);
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
    });
    await browser.close();

    res.json({ url: `http://localhost:5000/reports/${session_id}.pdf` });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to generate report", details: err.message });
  }
});

module.exports = router;
