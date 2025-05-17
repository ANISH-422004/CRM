# API Documentation

This document outlines the available API endpoints, their functionalities, request/response formats, and authentication mechanisms.

PostMan Collection : https://elements.getpostman.com/redirect?entityId=40947700-d44b0787-59cb-4c13-966d-f0de9b668bac&entityType=collection
---

# CRM Backend API Documentation

**Base URL:** `/api/leads`

---

## Authentication

- **Note:** No authentication is currently implemented in this version.

---

## Lead Routes

### Create a New Lead

- **Method:** `POST`  
- **Endpoint:** `/api/leads`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Doe Inc.",
  "status": "NEW"
}
```

**Responses:**

- `201 Created`: Returns the created lead object  
- `400 Bad Request`: Validation errors  
- `500 Internal Server Error`: Creation failed  

---

### Get All Leads

- **Method:** `GET`  
- **Endpoint:** `/api/leads`

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Doe Inc.",
    "status": "NEW",
    "createdAt": "2024-05-01T12:00:00.000Z",
    "updatedAt": "2024-05-01T12:00:00.000Z"
  }
]
```

- `200 OK`: Returns an array of lead objects  

---

### Get Lead by ID

- **Method:** `GET`  
- **Endpoint:** `/api/leads/:id`

**URL Parameters:**

- `id` (UUID) — Lead ID

**Responses:**

- `200 OK`: Lead found  
- `404 Not Found`: Lead not found  
- `400 Bad Request`: Invalid UUID  

---

### Update Lead

- **Method:** `PUT`  
- **Endpoint:** `/api/leads/:id`

**URL Parameters:**

- `id` (UUID) — Lead ID

**Request Body:**  
(Same format as in "Create a New Lead")

**Responses:**

- `200 OK`: Updated lead  
- `400 Bad Request`: Validation or invalid UUID  
- `500 Internal Server Error`: Update failed  

---

### Delete Lead

- **Method:** `DELETE`  
- **Endpoint:** `/api/leads/:id`

**URL Parameters:**

- `id` (UUID)

**Responses:**

- `200 OK`: Lead deleted  
- `404 Not Found`: Lead not found  
- `500 Internal Server Error`: Delete failed  

---

## AI Scoring Endpoint

### Score a Lead Using Gemini AI

- **Method:** `POST`  
- **Endpoint:** `/api/leads/:id/score`

**URL Parameters:**

- `id` (UUID) — Lead ID

**Response:**

```json
{
  "lead_id": "uuid",
  "score": "75"
}
```

**Responses:**

- `200 OK`: Scoring successful  
- `404 Not Found`: Lead not found  
- `500 Internal Server Error`: Scoring failed  

---

## Validation Rules

### validateLead

- `name` — Required  
- `email` — Valid email required  
- `company` — Required  
- `status` — Must be one of `NEW`, `CONTACTED`, `CONVERTED`  

### validateUUID

- Valid UUID required in `:id` URL parameter

---

## Technologies Used

| Technology         | Description                      |
|--------------------|----------------------------------|
| Node.js + Express  | REST API Server                  |
| PostgreSQL + Prisma| Database and ORM                 |
| Gemini API         | AI-based Lead Scoring            |
| express-validator  | Input validation middleware      |