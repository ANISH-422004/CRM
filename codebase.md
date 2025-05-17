# 📦 Codebase Snapshot

_This markdown file includes non-sensitive project source code._

## `generate-docs.js`

```js
const fs = require("fs");
const path = require("path");

const OUTPUT_FILE = "codebase.md";
const TARGET_EXTENSIONS = [".js", ".ts", ".tsx", ".json", ".prisma"];
const IGNORE_DIRS = ["node_modules", ".git", ".vscode", "migrations"];
const IGNORE_FILES = [".env", "package-lock.json"];
const SENSITIVE_KEYWORDS = ["secret", "key", "token"];

function shouldIgnore(filePath) {
  const lowerPath = filePath.toLowerCase();
  return (
    IGNORE_FILES.includes(path.basename(filePath)) ||
    SENSITIVE_KEYWORDS.some((k) => lowerPath.includes(k))
  );
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(f)) walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

function generateMarkdown() {
  let md = `# 📦 Codebase Snapshot\n\n_This markdown file includes non-sensitive project source code._\n\n`;

  walkDir(".", (filePath) => {
    const ext = path.extname(filePath);
    if (
      TARGET_EXTENSIONS.includes(ext) &&
      !shouldIgnore(filePath)
    ) {
      const code = fs.readFileSync(filePath, "utf-8");
      md += `## \`${filePath}\`\n\n`;
      md += "```" + ext.slice(1) + "\n";
      md += code.trim() + "\n";
      md += "```\n\n";
    }
  });

  fs.writeFileSync(OUTPUT_FILE, md);
  console.log(`✅ Markdown file generated: ${OUTPUT_FILE}`);
}

generateMarkdown();
```

## `index.js`

```js
const app = require('./src/app');



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
```

## `package.json`

```json
{
  "name": "crm-backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "@google/genai": "^0.14.1",
    "@google/generative-ai": "^0.24.1",
    "@prisma/client": "^6.8.2",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^5.1.0",
    "express-validator": "^7.2.1",
    "prisma": "^6.8.2",
    "prisma-client": "^0.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
```

## `prisma\schema.prisma`

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Lead {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  company   String
  status    Status   @default(NEW)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Status {
  NEW
  CONTACTED
  CONVERTED
}
```

## `src\app.js`

```js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const leadRoutes = require('./routes/lead.routes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/leads', leadRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong!' });
});




module.exports = app;
```

## `src\controller\lead.controller.js`

```js
const prisma = require('../db/db');
const { getLeadScore } = require('../services/leadScoringService');

// Create Lead
exports.createLead = async (req, res) => {
  try {
    const { name, email, company, status } = req.body;

    const lead = await prisma.lead.create({
      data: { name, email, company, status }
    });

    res.status(201).json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create lead' });
  }
};

// Get All Leads
exports.getLeads = async (req, res) => {
  const leads = await prisma.lead.findMany();
  res.json(leads);
};

// Get Lead by ID
exports.getLeadById = async (req, res) => {
  const lead = await prisma.lead.findUnique({
    where: { id: req.params.id }
  });

  if (!lead) return res.status(404).json({ message: 'Lead not found' });
  res.json(lead);
};

// Update Lead
exports.updateLead = async (req, res) => {
  try {
    const { name, email, company, status } = req.body;

    const updated = await prisma.lead.update({
      where: { id: req.params.id },
      data: { name, email, company, status }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update lead' });
  }
};

// Delete Lead
exports.deleteLead = async (req, res) => {
  try {
    await prisma.lead.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete lead' });
  }
};

// Mock AI Lead Scoring
exports.scoreLead = async (req, res) => {
  const lead = await prisma.lead.findUnique({
    where: { id: req.params.id }
  });
  

  if (!lead) return res.status(404).json({ message: "Lead not found" });

  try {
    const score = await getLeadScore(lead); // await here too

    // console.log(score)
    res.json({ lead_id: lead.id, score });
  } catch (error) {
    res.status(500).json({ error: "Failed to score lead" });
  }
};
```

## `src\db\db.js`

```js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;
```

## `src\routes\lead.routes.js`

```js
const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  scoreLead
} = require('../controller/lead.controller');
const { validateLead, validateUUID } = require('../validators/leadValidator');

// CRUD
router.post('/', validateLead, createLead);
router.get('/', getLeads);
router.get('/:id', validateUUID, getLeadById);
router.put('/:id', validateUUID, validateLead, updateLead);
router.delete('/:id', validateUUID, deleteLead);

// AI Lead Scoring
router.post('/:id/score', validateUUID, scoreLead);

module.exports = router;
```

## `src\services\gemini.servise.js`

```js
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports.getScore = async (leadData) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_SECRET_KEY);

    const systemInstruction = `
      You are a lead scoring assistant for a CRM application.

      Your job is to assign a score between 1 and 100 to a sales lead, based on the following input fields:

      - Name
      - Email
      - Company
      - Status (one of: NEW, CONTACTED, CONVERTED)
      - CreatedAt (date)
      - UpdatedAt (date)

      Scoring Rules:

      1. Base Score by Status:
        - CONVERTED → base score: 90
        - CONTACTED → base score: 60
        - NEW       → base score: 30

      2. Adjust score using rules:
        - If the email domain is from a well-known company (like "@google.com", "@microsoft.com", "@amazon.com"), add +5.
        - If "createdAt" is older than 30 days and status is still NEW, subtract -10.
        - If the name or company includes "CEO", "Founder", or "Director", add +5.
        - Final score must be between 1 and 100.

    outPut : 

     10 or 20 0r 90

    `;
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemInstruction,
    });


    const userPrompt = `
      Lead Information:
      Name: ${leadData.name}
      Email: ${leadData.email}
      Company: ${leadData.company}
      Status: ${leadData.status}
      CreatedAt: ${leadData.createdAt}
      UpdatedAt: ${leadData.updatedAt}

      Please provide the lead score based on the rules.
    `;

    const response = await model.generateContent(userPrompt);

   return response.response.text()
  } catch (error) {
    console.error("Error in getScore:", error);
    throw error;
  }
};
```

## `src\services\leadScoringService.js`

```js
const { getScore } = require("./gemini.servise");

exports.getLeadScore = async (lead) => {

  const score = await getScore(lead);  // await here!
  
  
  return score;
};
```

## `src\validators\leadValidator.js`

```js
const { body, param, validationResult } = require('express-validator');

exports.validateLead = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('company').notEmpty().withMessage('Company is required'),
  body('status')
    .isIn(['NEW', 'CONTACTED', 'CONVERTED'])
    .withMessage('Status must be NEW, CONTACTED, or CONVERTED'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  }
];

exports.validateUUID = [
  param('id').isUUID().withMessage('Invalid UUID'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  }
];
```

