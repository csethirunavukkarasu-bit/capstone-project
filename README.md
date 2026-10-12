# Reelix - AI-Powered Short Video Content Sharing Platform

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Capstone Project**  
> Developed by **Thiru** ([@csethirunavukkarasu-bit](https://github.com/csethirunavukkarasu-bit))  
> Repository: [capstone-project](https://github.com/csethirunavukkarasu-bit/capstone-project.git)

---

## ðŸŒŸ Executive Summary

**Reelix** is a high-performance, full-stack short video sharing platform engineered with **Java 21 (Spring Boot 3)**, **Supabase Cloud Storage**, **FFmpeg Media Pipeline**, and a responsive **React 18** client featuring modern glassmorphism aesthetics, in-browser video studio filters, real-time stories, and an AI recommendation engine.

---

## ðŸ—ï¸ System Architecture

`mermaid
graph TD
    Client[React 18 / Vite Frontend] -->|REST / JWT| Gateway[Spring Security / Rate Limiter]
    Gateway --> Auth[Auth & User Service]
    Gateway --> Video[Video Streaming & Upload]
    Gateway --> Social[Feed, Likes & Comments]
    Gateway --> AI[AI Recommendation Engine]
    Video --> FFmpeg[FFmpeg Transcoding & Thumbnails]
    Video --> Supabase[(Supabase Storage Bucket)]
    Auth --> DB[(Relational DB / MySQL / H2)]
    Social --> DB
    AI --> Analytics[Predictive Engagement Engine]
`

### Key Modules:
1. **Spring Boot 3 Backend (ackend/)**:
   - **Authentication**: Stateless JWT token authentication with bcrypt password hashing and token-bucket rate limiting.
   - **Video Ingestion Pipeline**: Multipart file upload, automated FFmpeg resolution transcoding, aspect ratio detection, and thumbnail extraction.
   - **Distributed Cloud Storage**: Direct integration with Supabase Storage buckets for reliable media asset streaming.
   - **AI Recommendation Engine**: Hybrid algorithm combining user interaction vectors, tag affinity, and predictive engagement metrics.
   - **Social Graph & Feeds**: Chronological, trending, and personalized algorithmic feed generation with pagination.
   - **Production Readiness**: Actuator health telemetry, structured logging, and centralized global exception handling.

2. **Modern React Frontend (rontend/)**:
   - **3-Column Dashboard**: TikTok & Instagram Reels-inspired responsive layout with quick navigation, creator tools, and live widgets.
   - **Interactive Stories Carousel**: Real-time stories bar with full-screen auto-advancing story modal.
   - **Reelix Video Studio**: In-browser video trimmer, custom canvas filters, and thumbnail selector.
   - **Fluid Design System**: Curated HSL dark/light modes, glassmorphism panels, vibrant gradients, and WebAudio introductory chime.

3. **TypeScript Web Client (ackend/frontend/)**:
   - Fully typed TypeScript client with strict compile-time safety and standalone modular components.

---

## ðŸš€ Getting Started

### Prerequisites
- **Java Development Kit (JDK 21+)**
- **Maven 3.9+**
- **Node.js (v18+) & npm**
- **FFmpeg** (installed and added to system PATH)

### 1. Backend Setup (Spring Boot)

`ash
cd backend

# Configure environment variables (or copy example)
cp .env.example .env

# Build and run with Maven
./mvnw clean spring-boot:run
`
The backend API will start on http://localhost:8080.

### 2. Frontend Setup (React + Vite)

`ash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
`
The frontend UI will start on http://localhost:5173.

---

## ðŸ“¡ Core API Endpoints

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | POST | /api/auth/register | Register new user account |
| **Auth** | POST | /api/auth/login | Authenticate user & return JWT |
| **Videos** | POST | /api/videos/upload | Upload video with metadata |
| **Videos** | GET | /api/videos/{id} | Get video details & stream URL |
| **Feed** | GET | /api/feed?page=0&size=10 | Get personalized/trending video feed |
| **Social** | POST | /api/social/videos/{id}/like | Like or unlike video |
| **Social** | POST | /api/social/videos/{id}/comments| Post comment on video |
| **AI** | GET | /api/recommendations | Get user interest-based recommendations |
| **System**| GET | /api/health | Service health and telemetry status |

---

## ðŸ§ª Testing & Verification

- Backend unit & baseline test scripts:
  - ackend/run_java21_tests.bat
  - ackend/test_java21.bat
  - ackend/verify_cve_fix.bat
- Frontend linting & validation:
  `ash
  cd frontend
  npm run build
  `

---

## ðŸ“„ License

This capstone project is released under the **MIT License**.
