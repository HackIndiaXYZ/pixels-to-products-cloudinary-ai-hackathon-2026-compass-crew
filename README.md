# OmniStage AI 🚀

> **One Product Photo. Every Color. Every Format. Every Channel.**

OmniStage AI is an AI-powered e-commerce product media generation platform that turns a single product image into a consistent, multi-channel content set.

Instead of manually recreating product visuals for every color variant, platform ratio, and campaign style, OmniStage analyzes the product, applies reusable **Brand DNA**, generates high-fidelity variants, and delivers optimized assets through **Cloudinary**.

---

## ✨ What OmniStage AI Does

### 🎨 Instant Colorway Generation
Generate new product color variants while preserving the product's visual identity, including:
- Shape and geometry
- Logos and branding
- Stitching and fine details
- Materials and textures
- Product-specific characteristics

### 📐 Multi-Channel Format Generation
Create channel-ready assets across four target formats:

| Format | Typical Use |
|---|---|
| **1:1** | Marketplace / square product cards |
| **4:5** | Social feeds / portrait commerce |
| **9:16** | Stories / Reels / Shorts |
| **16:9** | Web banners / landscape placements |

The AI engine supports the four formats at the application level. For image-generation providers with native-ratio constraints, the implementation maps unsupported ratios such as **4:5** to the closest supported generation ratio and preserves the requested application format in metadata.

### 🧬 Brand DNA Engine
Save a brand's visual rules once and reuse them across generations:
- Color palette
- Aesthetic / visual style
- Lighting direction
- Background mood
- Scene preferences
- Product-preservation instructions

### 🎬 Scene Generation
Stage the same authentic product in commercial environments such as:
- Premium Studio
- Minimal
- Lifestyle
- Urban
- Luxury

### 🛡️ Detail Preservation
OmniStage's prompting layer explicitly protects important product attributes so generated assets remain commercially faithful to the source.

### ☁️ Cloudinary Media Pipeline
Cloudinary is used as the media layer for:
- Product image uploads
- Asset storage and delivery
- Transformations
- Optimization
- CDN URLs

The backend exposes Cloudinary upload-signature, upload, transformation, and optimization workflows.

### 🖼️ Asset Gallery
Generated assets can be:
- Previewed
- Filtered by aspect ratio
- Downloaded
- Copied as CDN URLs
- Reused from the generation history

---

## 🏗️ Architecture

```text
┌───────────────────────┐
│      Seller / User    │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│   Next.js Frontend    │
│ React + TypeScript    │
└───────────┬───────────┘
            │ REST API
            ▼
┌───────────────────────┐
│      FastAPI API      │
│ Auth • Products       │
│ Brands • Generation   │
│ Assets • Cloudinary   │
└───────┬───────┬───────┘
        │       │
        │       ▼
        │  ┌────────────────────┐
        │  │  SQLite / SQLAlchemy│
        │  │ users • brands      │
        │  │ products • jobs     │
        │  │ assets              │
        │  └────────────────────┘
        │
        ▼
┌───────────────────────┐
│       AI Engine       │
│ Vision Analysis       │
│ Brand Prompt Builder  │
│ Colorway Generation   │
│ Scene Generation      │
│ Fidelity Validation   │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│      Cloudinary       │
│ Upload • Transform    │
│ Optimize • CDN        │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│    Asset Gallery      │
└───────────────────────┘
```

---

## 🧠 AI Workflow

```text
Upload Product
      ↓
AI Product Analysis
      ↓
Extract category / color / material / components
      ↓
Apply Brand DNA
      ↓
Apply Preservation Locks
      ↓
Generate Colorways / Scenes
      ↓
Generate Target Formats
      ↓
Store & Transform with Cloudinary
      ↓
Track Job Status
      ↓
Deliver Assets in Gallery
```

---

## 🛠️ Tech Stack

### Frontend
- Next.js **16**
- React **19**
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Three.js / React Three Fiber for product-focused 3D visuals
- Lucide icons

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT-based application sessions
- Firebase Admin SDK

### AI
- Google GenAI / Gemini integration
- Multimodal product image analysis
- Generative image workflow
- Prompt-engineered product fidelity controls
- Mock provider fallback for development resilience

### Media
- Cloudinary
- Upload APIs
- Signed upload parameters
- Asset transformations
- Automatic format/quality optimization
- CDN delivery

### Database
- SQLite for the local/hackathon-ready setup
- SQLAlchemy ORM
- PostgreSQL/Supabase-compatible configuration is retained in environment templates for future deployment

---

## 🔐 Authentication & Security

OmniStage supports:
- Email/password authentication
- Google authentication through Firebase
- Firebase ID-token verification on the backend
- Application JWT sessions
- Authenticated access to user products, brands, generation jobs, and assets

### Secrets

Actual credentials are intentionally **not committed** to this repository.

Use local environment files for:
- Firebase configuration
- Cloudinary API credentials
- Gemini API keys
- JWT secret
- Database connection settings

The repository contains only example templates such as:

```text
.env.example
backend/.env.example
```

Never commit real API keys, Cloudinary secrets, Firebase service-account credentials, or production database passwords.

---

## 📁 Project Structure

```text
omnistage-ai/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   └── hooks/
│   └── package.json
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

### 1. Clone the repository

```bash
git clone https://github.com/HackIndiaXYZ/pixels-to-products-cloudinary-ai-hackathon-2026-compass-crew.git
cd pixels-to-products-cloudinary-ai-hackathon-2026-compass-crew
```

### 2. Backend setup

Python **3.12+** is recommended.

```bash
cd backend

python -m venv .venv
```

Activate the environment:

**Windows PowerShell**
```powershell
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux**
```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create your environment file:

```text
backend/.env
```

Start the API:

```bash
python -m uvicorn backend.app.main:app --reload --port 8000
```

Backend endpoints:

```text
http://localhost:8000/
http://localhost:8000/api/health
http://localhost:8000/docs
```

### 3. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔑 Environment Configuration

Use the example files as the starting point for local configuration.

### Backend

Required integrations can include:

```env
ENVIRONMENT=development
DEBUG=True
PORT=8000

DATABASE_URL=sqlite:///./omnistage.db

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=omnistage_products

GEMINI_API_KEY=your_gemini_api_key

SECRET_KEY=your_secure_secret
```

### Frontend

For Firebase, configure the public Firebase web-app variables in:

```text
frontend/.env.local
```

Never place Firebase Admin service-account credentials in frontend environment variables.

---

## 🔌 Core API Areas

The FastAPI backend currently exposes API groups for:

| Area | Purpose |
|---|---|
| `/auth` | Signup, login, Firebase authentication |
| `/products` | Product creation, listing, retrieval, AI analysis |
| `/brands` | Brand DNA CRUD |
| `/cloudinary` | Upload, signatures, transformations, optimization |
| `/generation` | Generation jobs and status tracking |
| `/assets` | Generated asset retrieval and job-linked assets |

Interactive API documentation is available at:

```text
http://localhost:8000/docs
```

---

## 🧪 Testing & Verification

The project includes backend tests under `tests/`.

Useful checks:

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

### Manual end-to-end flow

1. Sign in with Firebase
2. Upload a product image
3. Create/open the product
4. Run AI product analysis
5. Select or create Brand DNA
6. Choose colorways
7. Choose target formats
8. Generate assets
9. Track the job in Pipeline
10. Open the Asset Gallery
11. Preview / copy CDN URL / download generated assets

---

## 🎯 Hackathon Scope

This project was built for the **Build with AI: Code for Communities / Cloudinary AI Hackathon** context.

The implementation focuses on a practical e-commerce workflow:

> **one source product image → AI understanding → brand-aware generation → multi-format assets → Cloudinary delivery**

The current repository is optimized for a hackathon demonstration and local development. Production deployment would require hardened infrastructure, managed database configuration, production observability, rate limiting, background job infrastructure, billing, and enterprise-grade authorization/operations.

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

## 🌟 Why OmniStage AI?

Traditional product-media workflows force sellers to manually recreate the same product for:
- Different colors
- Different channels
- Different aspect ratios
- Different campaign scenes
- Different brand contexts

OmniStage AI turns that repetitive production workflow into a single reusable pipeline.

### From:

```text
One photo
   ↓
Manual editing
   ↓
Multiple Photoshop files
   ↓
Manual resizing
   ↓
Manual CDN upload
```

### To:

```text
One product photo
   ↓
OmniStage AI
   ├── Product understanding
   ├── Brand DNA
   ├── Colorways
   ├── Scenes
   ├── 1:1
   ├── 4:5
   ├── 9:16
   └── 16:9
           ↓
      Cloudinary
           ↓
     Ready-to-use assets
```

---

## 📸 Product Experience

The landing experience communicates the actual OmniStage workflow through product-specific visuals, including:
- Product analysis
- Brand DNA
- Colorway transformation
- Scene generation
- Multi-format adaptation
- Cloudinary media delivery
- Detail preservation

The dashboard then turns that concept into an interactive workflow for creating and managing assets.

---

## 🤝 Contributing

This repository was built as a collaborative hackathon project.

For meaningful changes:
1. Create a feature branch
2. Make the change
3. Run lint/build/tests relevant to the area
4. Open a pull request with a clear description

Please never commit secrets or generated local environment/database files.

---

## 📄 License

Add the license required by the hackathon or your intended distribution model before public production use.

---

<p align="center">
  <strong>OmniStage AI</strong><br/>
  One Product Photo. Every Color. Every Format. Every Channel.
</p>
