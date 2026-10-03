# OmniStage AI 🚀

> **One Product Photo. Every Color. Every Format. Every Channel.**

**OmniStage AI** is an AI-powered e-commerce product media generation platform that turns one source product image into a consistent, brand-aware set of product assets.

Built for **Pixels to Products — Cloudinary AI Hackathon 2026** under **PS-03 — Your Media-Savvy Startup**.

🌐 **Live Demo:** https://omnistage-ai.netlify.app/

💻 **Backend API:** https://pixels-to-products-cloudinary-ai-wja3.onrender.com/

📦 **Repository:** https://github.com/HackIndiaXYZ/pixels-to-products-cloudinary-ai-hackathon-2026-compass-crew

---

## 🎯 The Problem

E-commerce teams often start with a small number of product photos but need many variations for marketplaces, websites, social media, campaigns, and product catalogs.

Creating those variations manually means repeatedly:

- Recoloring products
- Resizing for different channels
- Rebuilding scenes
- Applying brand guidelines
- Uploading and organizing final media
- Checking that product details were not unintentionally changed

Generic image-generation workflows can also drift from the original product's shape, materials, branding, or other defining details.

---

## 💡 The Solution

OmniStage AI turns that fragmented workflow into one reusable product-media pipeline:

```text
One Product Image
       ↓
AI Product Understanding
       ↓
Brand DNA
       ↓
Detail Preservation
       ↓
Colorway / Scene Generation
       ↓
Multi-Format Generation
       ↓
Cloudinary Media Pipeline
       ↓
Asset Gallery
```

The result is a production-oriented workflow where the seller starts with a single source image and ends with a managed set of ready-to-use assets.

---

## ✨ Core Features

### 🧠 AI Product Understanding

Analyzes the source product and extracts useful context such as:

- Product category
- Base color
- Material
- Visible components
- Important visual characteristics
- Suggested lighting / environments
- Detail locks

This context is reused during generation instead of treating every request as a generic image prompt.

### 🧬 Brand DNA Engine

Store and reuse visual brand rules such as:

- Primary and secondary colors
- Aesthetic
- Lighting
- Background style
- Scene preferences
- Product-preservation instructions

### 🎨 Instant Colorway Generation

Create product color variants while keeping the underlying product identity consistent.

The generation workflow is designed to protect:

- Product shape and geometry
- Logos and branding
- Stitching and fine details
- Materials and textures
- Other defining product characteristics

### 🎬 Scene Generation

Create commercial product presentations using scene directions such as:

- Premium Studio
- Minimal
- Lifestyle
- Urban
- Luxury

### 📐 Multi-Channel Formats

OmniStage supports four target application formats:

| Format | Example Use |
|---|---|
| **1:1** | Marketplace / square product cards |
| **4:5** | Social feeds / portrait commerce |
| **9:16** | Stories / Reels / Shorts |
| **16:9** | Web banners / landscape placements |

Where a generation provider has native aspect-ratio constraints, the application maps the requested format to a compatible generation ratio and preserves the requested output format in the workflow metadata.

### 🛡️ Detail Preservation

Generation prompts explicitly preserve important product attributes so creative variation does not unnecessarily change the source product identity.

### ☁️ Cloudinary Media Pipeline

Cloudinary is a core media layer in OmniStage AI.

We use it for:

- Source product image uploads
- Generated asset storage
- Media transformations
- Automatic optimization
- CDN delivery
- Production-ready asset URLs

The final assets can be consumed directly from Cloudinary CDN URLs.

### 🖼️ Asset Gallery

Generated assets can be:

- Previewed
- Filtered by format
- Filtered by color
- Downloaded
- Copied as CDN URLs
- Viewed by generation job

### ⚙️ Generation Pipeline

Generation jobs move through trackable processing states such as:

```text
QUEUED
  ↓
ANALYZING
  ↓
GENERATING
  ↓
TRANSFORMING
  ↓
OPTIMIZING
  ↓
COMPLETED
```

---

## 🏗️ Architecture

```text
┌───────────────────────────────┐
│           Seller              │
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│       Next.js Frontend        │
│   React • TypeScript • UI     │
│      Netlify Deployment       │
└──────────────┬────────────────┘
               │ HTTPS REST API
               ▼
┌───────────────────────────────┐
│          FastAPI API          │
│ Auth • Products • Brands      │
│ Generation • Assets           │
│ Cloudinary integration        │
│      Render Deployment        │
└───────┬───────────┬───────────┘
        │           │
        │           ├─────────────────┐
        ▼           ▼                 ▼
┌──────────────┐ ┌──────────────┐ ┌────────────────┐
│   Firebase   │ │  AI Engine   │ │  SQLAlchemy    │
│ Authentication│ │ Gemini/GenAI │ │ SQLite         │
└──────────────┘ └──────┬───────┘ └────────────────┘
                        │
                        ▼
               ┌────────────────┐
               │   Cloudinary   │
               │ Upload         │
               │ Transform      │
               │ Optimize       │
               │ CDN Delivery   │
               └───────┬────────┘
                       │
                       ▼
               ┌────────────────┐
               │ Asset Gallery  │
               └────────────────┘
```

---

## 🧠 End-to-End AI Workflow

```text
1. Upload Product
        ↓
2. Product Record Created
        ↓
3. AI Product Analysis
        ↓
4. Apply Brand DNA
        ↓
5. Apply Detail Preservation Locks
        ↓
6. Select Colorways / Scenes
        ↓
7. Select Target Formats
        ↓
8. Create Generation Job
        ↓
9. AI Generation
        ↓
10. Cloudinary Storage / Transformation
        ↓
11. Track Job Completion
        ↓
12. Explore Assets in Gallery
```

---

## 🧪 Verified Example

One tested workflow produces:

```text
2 Colorways × 4 Formats = 8 Assets
```

Target formats:

```text
1:1
4:5
9:16
16:9
```

The workflow is designed to take one source product image through analysis, brand-aware generation, media processing, and final Cloudinary delivery.

---

## 🛠️ Technology Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Firebase Authentication
- React Three Fiber / Three.js for product-focused 3D visuals
- Lucide icons
- Netlify

### Backend

- Python 3.12+
- FastAPI
- SQLAlchemy
- Pydantic
- JWT application sessions
- Firebase Admin SDK
- Render

### AI

- Google GenAI / Gemini integration
- Multimodal product image analysis
- Generative image workflows
- Product-fidelity prompt controls
- Development fallback provider for transient AI availability issues

### Media

- Cloudinary
- Upload API
- Asset storage
- Transformations
- Automatic format / quality optimization
- CDN delivery

### Database

- SQLite for the current hackathon deployment
- SQLAlchemy ORM

---

## 🔐 Authentication & Security

OmniStage AI supports:

- Email/password authentication
- Google authentication through Firebase
- Firebase ID-token verification on the backend
- Application JWT sessions
- User-scoped product, brand, generation-job, and asset access

Backend ownership checks are applied to protected resources so one user cannot access another user's product, brand, job, or asset records.

### Secrets

Actual credentials are **not committed** to this repository.

Environment files include only templates:

```text
.env.example
backend/.env.example
frontend/.env.example
```

Never commit:

```text
GEMINI_API_KEY
CLOUDINARY_API_SECRET
JWT / SECRET_KEY
Firebase Admin service-account credentials
Production database passwords
```

---

## 📁 Project Structure

```text
pixels-to-products-cloudinary-ai-hackathon-2026-compass-crew/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── lib/
│   │       ├── api.ts
│   │       └── firebase.ts
│   ├── netlify.toml
│   ├── package.json
│   └── package-lock.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── main.py
│   └── requirements.txt
│
├── ai_engine/
│   ├── vision/
│   ├── generation/
│   ├── brand/
│   ├── providers/
│   └── README.md
│
├── cloudinary/
├── database/
├── docs/
├── tests/
├── .env.example
├── backend/.env.example
├── .gitignore
└── README.md
```

---

## 🚀 Local Setup

### Clone

```bash
git clone https://github.com/HackIndiaXYZ/pixels-to-products-cloudinary-ai-hackathon-2026-compass-crew.git
cd pixels-to-products-cloudinary-ai-hackathon-2026-compass-crew
```

### Backend

Python **3.12+** recommended.

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

Backend:

```text
http://localhost:8000
http://localhost:8000/api/health
http://localhost:8000/docs
```

### Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

### Environment

Copy the appropriate example files and add your own local credentials.

Frontend:

```text
frontend/.env.local
```

Backend:

```text
backend/.env
```

Do not copy production secrets into the repository.

---

## 🔌 Core API Areas

| Area | Purpose |
|---|---|
| `/api/auth` | Signup, login and Firebase token exchange |
| `/api/products` | Product creation, listing, retrieval and AI analysis |
| `/api/brands` | Brand DNA CRUD |
| `/api/cloudinary` | Product upload and Cloudinary operations |
| `/api/generations` | Generation job creation and status |
| `/api/assets` | Generated asset retrieval and deletion |

Interactive API documentation:

```text
http://localhost:8000/docs
```

---

## 🌐 Deployment

### Frontend — Netlify

Production frontend:

```text
https://omnistage-ai.netlify.app/
```

The frontend is deployed from the `frontend/` directory using Next.js.

### Backend — Render

Production backend:

```text
https://pixels-to-products-cloudinary-ai-wja3.onrender.com/
```

Health endpoint:

```text
https://pixels-to-products-cloudinary-ai-wja3.onrender.com/api/health
```

### Production flow

```text
Netlify
  ↓
Next.js Frontend
  ↓
Render
  ↓
FastAPI Backend
  ├── Firebase
  ├── Gemini / GenAI
  ├── SQLite
  └── Cloudinary
```

---

## 🧪 Testing & Quality

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

### Backend

```bash
pytest
```

### Manual E2E

1. Sign in with Firebase.
2. Upload a product image.
3. Confirm the Cloudinary upload.
4. Run AI product analysis.
5. Select or create Brand DNA.
6. Choose colorways and formats.
7. Start generation.
8. Track the job in Pipeline.
9. Open Asset Gallery.
10. Preview, copy the CDN URL, or download assets.

---

## 🏆 Hackathon Context

**Hackathon:** Pixels to Products — Cloudinary AI Hackathon 2026

**Track / Problem Statement:** PS-03 — Your Media-Savvy Startup

**Team:** Compass Crew

The product was designed around a media-first startup workflow where AI generation, media management, transformation, optimization, and delivery are core parts of the user experience.

---

## 👥 Team — Compass Crew

| Member | Role |
|---|---|
| **Kamal Solanki** | Team Lead · Product & Integration Lead |
| **Krrish Yaduka** | Backend + Cloudinary Engineer |
| **Krishna Barman** | AI / Generative AI Engineer |
| **Ayush Pratap Singh** | Frontend Engineer |
| **Rupali Nanda** | UI/UX + Product Design Lead |

---

## 🌟 From Manual Production to One Pipeline

### Before

```text
One Product Photo
       ↓
Manual Recoloring
       ↓
Manual Resizing
       ↓
Manual Scene Creation
       ↓
Manual Upload / Organization
```

### With OmniStage AI

```text
One Product Photo
       ↓
AI Understanding
       ↓
Brand DNA
       ↓
Detail Preservation
       ↓
Colorways / Scenes
       ↓
1:1 • 4:5 • 9:16 • 16:9
       ↓
Cloudinary
       ↓
Production-Ready Assets
```

---

## 🤝 Contributing

This repository was built as a collaborative hackathon project.

For changes:

1. Create a feature branch.
2. Make the change.
3. Run relevant lint, build, and tests.
4. Open a pull request with a clear description.

Never commit secrets or generated local environment/database files.

---

## 📄 License

Add the license required by the hackathon or intended distribution model before production distribution.

---

<p align="center">
  <strong>OmniStage AI</strong><br/>
  One Product Photo. Every Color. Every Format. Every Channel.
</p>
