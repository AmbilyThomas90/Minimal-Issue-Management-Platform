# **Issue Management Platform**

A full-stack Issue Management Platform with AI-powered issue analysis using Google Gemini.

## **Tech Stack**

### **Frontend**

* Next.js 14  
* TypeScript  
* Tailwind CSS  
* React Query

### **Backend**

* NestJS  
* TypeScript  
* Drizzle ORM

### **Database**

* PostgreSQL (Neon)

### **AI Integration**

* Google Gemini 1.5 Flash

---

## **Features**

* Create, update, delete, and manage issues  
* Filter issues by status and priority  
* Add comments to issues  
* AI-powered issue analysis using Google Gemini  
* Responsive user interface  
* REST API architecture

---

## **Prerequisites**

* Node.js 18+  
* PostgreSQL 15+  
* Google Gemini API Key

Get a free Gemini API key from:  
[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

---

## **Installation**

### **1\. Clone the Repository**

git clone \<repository-url\>  
cd issue-management-platform

### **2\. Install Dependencies**

#### **Backend**

cd backend  
npm install

#### **Frontend**

cd frontend  
npm install

---

## **Environment Variables**

### **Backend (.env)**

Create a `.env` file inside the `backend` folder:

DATABASE\_URL=your\_postgresql\_connection\_string  
GEMINI\_API\_KEY=your\_gemini\_api\_key  
PORT=3001

| Variable | Description |
| ----- | ----- |
| DATABASE\_URL | PostgreSQL connection string |
| GEMINI\_API\_KEY | Google Gemini API Key |
| PORT | Backend server port |

---

### **Frontend (.env.local)**

Create a `.env.local` file inside the `frontend` folder:

NEXT\_PUBLIC\_API\_URL=https://minimal-issue-management-platform-2.onrender.com/api

| Variable | Description |
| ----- | ----- |
| NEXT\_PUBLIC\_API\_URL | Backend API URL |

---

## **Database Setup**

Create a PostgreSQL database:

psql \-U postgres \-c "CREATE DATABASE issue\_management;"

Run Drizzle migrations:

cd backend  
npx drizzle-kit push

---

## **Running the Application**

### **Start Backend**

cd backend  
npm run start:dev

Backend runs on:

http://localhost:3001

### **Start Frontend**

cd frontend  
npm run dev

Frontend runs on:

http://localhost:3000

---

## **API Endpoints**

### **Issues**

| Method | Endpoint |
| ----- | ----- |
| GET | /api/issues |
| GET | /api/issues/:id |
| POST | /api/issues |
| PUT | /api/issues/:id |
| DELETE | /api/issues/:id |

### **Comments**

| Method | Endpoint |
| ----- | ----- |
| GET | /api/issues/:id/comments |
| POST | /api/issues/:id/comments |

### **Analysis**

| Method | Endpoint |
| ----- | ----- |
| GET | /api/issues/:id/analysis |
| POST | /api/issues/:id/analysis |

---

## **Live Demo**

### **Frontend**

[https://minimal-issue-management-platform.vercel.app](https://minimal-issue-management-platform.vercel.app/)

### **Backend API**

[https://minimal-issue-management-platform-2.onrender.com/api](https://minimal-issue-management-platform-2.onrender.com/api)

---

## **Author**

Developed using Next.js, NestJS, PostgreSQL, Drizzle ORM, and Google Gemini AI.

