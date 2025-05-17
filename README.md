# CRM Backend API

This is a CRM backend built with Node.js, Express, Prisma, and integrated with Google's Gemini AI for lead scoring.

## Features

- CRUD operations for sales leads
- AI-powered lead scoring using Gemini API
- Input validation with express-validator
- PostgreSQL database with Prisma ORM
- CORS enabled for frontend integration

## Requirements

- Node.js v18+
- PostgreSQL database
- Google Gemini API key

## Installation

```bash
git clone https://github.com/your-username/crm-backend.git
cd crm-backend

Install dependencies:
npm install

.env (Create a .env file in the root directory with my own environment variables) :
DATABASE_URL="postgresql://test_owner:npg_Ff7l8OZvDJrK@ep-winter-cell-a1fpi6wc-pooler.ap-southeast-1.aws.neon.tech/test?sslmode=require"
PORT=5000
GEMINI_SECRET_KEY=AIzaSyBHVl-qzvapyb7ExSFvKANRSaOoVs3q8_4

Run database migrations to set up Prisma schema:
# Run database migrations to update DB schema
npx prisma migrate deploy
# Generate Prisma client
npx prisma generate

Start the server:
{For development with auto-reload on changes}
npx nodemon index.js

Backend API will now be running at http://localhost:5000 (or the port you specified).

You can test API endpoints with tools like Postman or curl.

API Endpoints
Method	Endpoint	Description
POST	/api/leads	Create a new lead
GET	/api/leads	Get all leads
GET	/api/leads/:id	Get lead by ID
PUT	/api/leads/:id	Update lead by ID
DELETE	/api/leads/:id	Delete lead by ID
POST	/api/leads/:id/score	Get AI lead score

Environment Variables
DATABASE_URL — PostgreSQL connection string (Used neon db)
PORT — Server port (default: 5000)
GEMINI_SECRET_KEY — API key for Google Gemini AI

```
