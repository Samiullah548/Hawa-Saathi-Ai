# 🌿 HawaSaathi AI – Your Personal Urban Air Quality Assistant

> **PromptWars Virtual Main Challenge 06: Urban Air Quality Assistant**  
> *A production-grade, AI-powered environmental health dashboard solving the urban winter smog crisis in Indian cities.*

[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.3-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Google-Gemini_2.5_Flash-8E75B2?logo=google)](https://aistudio.google.com/)
[![Open-Meteo](https://img.shields.io/badge/Data-Open--Meteo_&_ECMWF_CAMS-green)](https://open-meteo.com/)
[![Tests](https://img.shields.io/badge/Tests-Vitest_11_Passing-success)](#testing)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel_Ready-black?logo=vercel)](#vercel-deployment)

---

## 📌 Problem & Solution Overview

### The Real-World Urban Crisis
Every winter, northern and central Indian cities (Delhi NCR, Meerut, Lucknow, Kanpur, Noida, Ghaziabad, Patna, and beyond) suffer from **severe particulate smog episodes** where PM2.5 concentrations exceed World Health Organization (WHO) safety limits by **15x to 30x**. 

Cold ground temperatures trigger **nocturnal radiation cooling and thermal inversion layers**—a meteorological phenomenon where a blanket of warm air traps vehicular exhaust, road dust, and biomass smoke directly at human breathing height.

Traditional air quality apps merely display a raw AQI number (e.g. *"AQI 384 — Severe"*), leaving citizens paralyzed with fear without actionable answers:
- *"Is it safe for my asthmatic mother to take a walk at 2:00 PM?"*
- *"Does my 7-year-old child need an N95 mask for school assembly?"*
- *"When is the exact 2-hour window today when windows can be safely opened?"*
- *"Do indoor plants replace an H13 HEPA air purifier?"*
- *"How much PM2.5 and CO₂ do I eliminate if I carpool or take the Delhi Metro?"*

### The HawaSaathi AI Solution
**HawaSaathi AI** bridges the gap between atmospheric sensor data and daily human survival. It combines real-time data from **Open-Meteo & the European Copernicus Atmosphere Monitoring Service (ECMWF CAMS)** with **Google Gemini AI** and deterministic **CPCB / WHO expert health algorithms** to deliver personalized, actionable, profile-tailored protection routines.

---

## 🚀 Key Features & Differentiating Innovations

### 1. 🏆 6 Differentiating Innovation Features
1. **Smog Survival Score (0–100):**  
   A transparent personal resilience index that calculates environmental hazard against active household protection measures (HEPA air purification, airtight N95 masks, peak-hour window sealing, kitchen exhaust use, and hydration). Shows citizens exactly how personal actions mitigate ambient risks.
2. **Pollution Impact Explainer:**  
   Translates complex atmospheric chemistry (PM2.5 alveolar penetration, PM10 bronchial irritation, NO₂ combustion, and ground-level O₃ oxidation) into plain English with interactive biological mechanism cards.
3. **Best Time to Go Outside:**  
   An automated algorithm that scans the next 24 hours of hourly atmospheric forecast data to locate the **cleanest 2-to-3 hour outdoor window** (when solar radiation lifts the boundary layer) versus peak morning/evening smog danger periods.
4. **Family Safety Checklist:**  
   A persistent, interactive checklist tracking daily protective actions for children, elderly individuals, and asthmatic family members, saved securely in `LocalStorage`.
5. **Green Commute Comparison Tool & Impact Tracker:**  
   A calculator estimating comparative tailpipe CO₂ emissions between private petrol/diesel cars, two-wheelers, electric vehicles, city buses, and metro trains. Computes annual carbon saved and mature tree equivalents using Indian ARAI/TERI emission factors.
6. **Community Awareness Shareable Card:**  
   Generates a social awareness card featuring live AQI, primary pollutant, health risk advisory, timestamp, and source attribution with one-click copy and native sharing.

---

## 🖥️ 10 Dedicated Application Pages

| # | Page | Key Capability |
|---|---|---|
| 1 | **Dashboard** | Comprehensive command center with animated SVG radial AQI gauge, key pollutant metrics, Smog Survival Score, Best Time to Go Outside, and 24h preview chart. |
| 2 | **Live Air Quality** | Diagnostic deep dive into all 6 criteria pollutants (PM2.5, PM10, CO, NO₂, O₃, SO₂) with WHO vs Indian CPCB NAAQS standards and physiological organ impact. |
| 3 | **AI Safety Assistant** | Gemini-powered personalized health engine evaluating activity, profile, and time of day with scientific explanations and medical disclaimers. |
| 4 | **Family Protection** | Profile-tailored 4-phase routines (Morning, Afternoon, Evening, Night) for Children, Elderly, Sensitive Individuals, Outdoor Workers, and Adults. |
| 5 | **Daily Routine Planner** | 24-hour time-blocked schedule generator coordinating outdoor tasks with hourly atmospheric dispersion patterns. Print & export ready. |
| 6 | **Indoor Air Care** | Smart window ventilation advisor, CADR/HEPA purifier sizing formulas, cooking smoke & tadka warnings, damp mopping vs dry sweeping, and the honest science of indoor plants. |
| 7 | **Green Choices** | Commute carbon calculator, carpool savings, transparent emission factor references, and anti-idling pledges. |
| 8 | **Forecast & Trends** | Interactive Recharts visualizations for 24h/48h hourly trends and 7-day daily peak smog projections. |
| 9 | **AI Chatbot** | Conversational assistant with live city context (aware of current AQI and weather), suggested prompts, markdown rendering, and chat history. |
| 10 | **Settings** | Onboarding preferences, default city selector, metric/imperial unit toggle, Web Push notification permissions, custom Gemini key input, and local data reset. |

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript (Strict Mode), Vite 8
- **Styling:** Tailwind CSS (Custom environmental palette: emerald, teal, navy, slate, AQI color scales)
- **Icons:** Lucide React
- **Data Visualizations:** Recharts (Responsive Area Charts, Bar Charts, Radial Gauges)
- **AI Intelligence:** Google Gemini API (`@google/genai`, model: `gemini-2.5-flash`)
- **Deterministic Expert Engine:** Rule-based fallback system based on Indian CPCB NAAQS & WHO Air Quality Guidelines
- **Atmospheric Data:** Open-Meteo Air Quality API (European CAMS / ECMWF Models) & Open-Meteo Weather API
- **Geocoding:** Open-Meteo Geocoding API + Browser Geolocation (GPS)
- **Backend & Proxy:** Express.js (Local development) + Vercel Serverless Functions (`/api/*`)
- **Testing:** Vitest + React Testing Library + JSDOM

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18.0.0 or higher, tested on v24.12.0)
- npm (v9.0.0 or higher)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/hawa-sathi-ai.git
cd hawa-sathi-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```

Open `.env` and add your Google Gemini API key:
```env
# Google Gemini API Key (Get free key from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Backend Server Port (Default: 3001)
PORT=3001
```

> **Note:** If no Gemini API key is provided, HawaSaathi AI seamlessly activates its built-in **CPCB/WHO Deterministic Expert Engine**. The entire application, including AI recommendations, routines, and chatbot, remains 100% operational with scientific answers!

---

## 🏃 Running the Application

### Development Mode (Frontend + Backend Concurrently)
Runs the Vite client on `http://localhost:5173` and Express API server on `http://localhost:3001`:
```bash
npm run dev
```

### Run Frontend Only
```bash
npm run dev:frontend
```

### Run Backend Server Only
```bash
npm run dev:backend
```

### Production Build
Verifies TypeScript compilation and creates an optimized production bundle:
```bash
npm run build
```

---

## 🧪 Testing

HawaSaathi AI includes automated unit tests verifying core algorithms:
- AQI category thresholds & color mapping
- Commute CO₂ emissions & carpool calculations
- Smog Survival Score resilience logic
- Deterministic AI safety engine responses

Run all tests:
```bash
npm run test
```

Expected output:
```
 ✓ src/test/emissionsCalculator.test.ts (2 tests)
 ✓ src/test/smogScore.test.ts (3 tests)
 ✓ src/test/aqiUtils.test.ts (3 tests)
 ✓ src/test/fallbackEngine.test.ts (3 tests)

 Test Files  4 passed (4)
      Tests  11 passed (11)
```

---

## 📡 Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns backend health status and Gemini configuration status. |
| `POST` | `/api/ai/recommendations` | Evaluates AQI, weather, activity, and profile; returns structured safety verdict, mask advice, and ventilation windows. |
| `POST` | `/api/ai/routine` | Generates a 4-block time-of-day protective schedule based on city conditions. |
| `POST` | `/api/ai/chat` | Context-aware chatbot processing questions with active city AQI context. |

---

## ☁️ Vercel Deployment

HawaSaathi AI is architected with native **Vercel Serverless Functions** (`/api/*`).

### Deploy in 3 Steps:
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete HawaSaathi AI submission"
   git push origin main
   ```
2. Import the repository into [Vercel](https://vercel.com).
3. Under **Project Settings > Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google Gemini API Key
4. Click **Deploy**. Vercel will automatically build the React Vite frontend and deploy the serverless functions in `/api/`.

---

## 🛡️ Medical & Scientific Disclaimer
HawaSaathi AI provides atmospheric analysis and environmental exposure reduction advice based on published benchmarks by the Central Pollution Control Board (CPCB) and World Health Organization (WHO). It is not a licensed medical diagnostic tool. Individuals experiencing acute respiratory distress, severe coughing, or cardiovascular symptoms should seek immediate medical care from a qualified healthcare practitioner.

---

## 👨‍💻 Submission Attribution
Created for **PromptWars Virtual Main Challenge 06: Urban Air Quality Assistant**.  
Designed with care for clean air and healthy urban communities across India.
