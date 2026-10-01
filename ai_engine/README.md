# OmniStage AI — AI / Generative AI Engine

> **"One Product Photo. Every Color. Every Format. Every Channel."**
> 
> OmniStage AI is not a generic text-to-image generator. It is an e-commerce product media workspace designed specifically to maintain **100% product geometric fidelity**, protect branding/logos, extract deep visual attributes, integrate Brand DNA, synthesize accurate colorways, stage products into commercial scenes, and validate consistency between variants and reference images.

---

## 1. Architecture Overview

The `ai_engine/` module is completely decoupled from the FastAPI transport layer, database schema, and frontend UI. It provides typed interfaces that any backend worker or service can call synchronously or inside background task queues (e.g. Celery / FastAPI `BackgroundTasks`).

```
ai_engine/
│
├── vision/                         # Module A: Multimodal Product Understanding
│   ├── analyzer.py                 # ProductAnalyzer & analyze_product entry point
│   ├── attribute_extractor.py      # Material & component breakdown helpers
│   ├── fidelity_checker.py         # Visual landmark verification
│   ├── product_analyzer.py         # Backward-compatible alias
│   ├── prompts.py                  # Vision prompts alias
│   └── schemas.py                  # Vision data structures
│
├── brand/                          # Module B: Brand DNA Interpretation
│   ├── brand_dna.py                # BrandDNAManager & build_brand_instructions
│   ├── brand_prompts.py            # Brand prompt templates
│   └── prompt_builder.py           # Centralized OmniStagePromptBuilder compiler
│
├── prompts/                        # Module C: Centralized Prompt Engineering
│   ├── analysis_prompts.py         # Vision reverse-engineering prompts
│   ├── brand_prompts.py            # Brand DNA templates
│   ├── colorway_prompts.py         # Colorway synthesis prompts + invariants
│   ├── scene_prompts.py            # Commercial scene staging archetypes
│   └── consistency_prompts.py      # Dual-image fidelity inspection prompts
│
├── generation/                     # Module D & E: Variant & Scene Synthesis
│   ├── colorway.py                 # ColorwayGenerator & generate_colorway
│   ├── colorway_generator.py       # Backward-compatible alias
│   ├── scene.py                    # SceneGenerator & generate_scene
│   ├── scene_generator.py          # Backward-compatible alias
│   ├── formats.py                  # 1:1, 4:5, 9:16, 16:9 format specs
│   ├── generator.py                # Core image generator orchestrator
│   └── image_generator.py          # Backward-compatible alias
│
├── consistency/                    # Module F: Fidelity & Consistency Quality Assurance
│   ├── validator.py                # ConsistencyValidator & check_product_consistency
│   └── prompts.py                  # Consistency prompts alias
│
├── providers/                      # Module G: Model / Provider Abstraction
│   ├── base.py                     # AIProvider Abstract Base Class (ABC)
│   ├── factory.py                  # Dynamic provider factory with auto-selection
│   ├── gemini_provider.py          # Google GenAI (Gemini 2.5 Flash + Imagen 3)
│   ├── openai_provider.py          # OpenAI Provider (GPT-4o + DALL-E 3)
│   └── mock_provider.py            # Deterministic Mock Provider for offline dev & CI
│
├── tests/                          # Automated Pytest Suite (28+ tests)
│   ├── conftest.py                 # Test fixtures & image helpers
│   ├── test_backend_integration_contract.py
│   ├── test_brand_dna.py
│   ├── test_colorway_generator.py
│   ├── test_consistency_validator.py
│   ├── test_error_handling.py
│   ├── test_facade_and_integration.py
│   ├── test_formats.py
│   ├── test_prompt_builder.py
│   ├── test_providers.py
│   ├── test_scene_generator.py
│   └── test_vision_analyzer.py
│
├── config.py                       # Pydantic BaseSettings environment reader
├── engine.py                       # AIEngine Unified Facade
├── models.py                       # Pydantic schemas (ProductAnalysisResult, BrandDNA, etc.)
├── exceptions.py                   # Strict hierarchy of custom domain exceptions
├── requirements.txt                # Python package dependencies
└── README.md                       # Comprehensive engine documentation
```

---

## 2. Core Capabilities

| Capability | Module / Entry Point | Description |
| :--- | :--- | :--- |
| **Product Analysis** | `analyze_product(image)` | Reverse-engineers category, materials, components, orientation, and invariant details into structured JSON. |
| **Brand DNA** | `build_brand_instructions(dna)` | Converts brand aesthetic, signature lighting, background style, and palette into prompt instructions. |
| **Colorway Generation** | `generate_colorway(...)` | Re-colors the product while locking shape, logo, silhouette, stitching, and material texture. |
| **Scene Staging** | `generate_scene(...)` | Stages the unaltered product into commercial environments (Studio, Minimal, Lifestyle, Urban, Luxury). |
| **Format Specifications** | `get_format_config(aspect_ratio)` | Provides composition safe zones, padding, and framing guides for `1:1`, `4:5`, `9:16`, `16:9`. |
| **Consistency Validation** | `check_product_consistency(...)` | Performs dual-image comparative inspection to ensure product identity was preserved. |

---

## 3. Environment Variables Configuration

Set these variables in your `.env` file (or system environment):

```bash
# Provider Selection ('auto', 'gemini', 'openai', 'mock')
AI_PROVIDER=auto

# Upstream API Keys
GEMINI_API_KEY=AIzaSy...
OPENAI_API_KEY=sk-...

# Models
GEMINI_VISION_MODEL=gemini-2.5-flash
GEMINI_IMAGE_MODEL=imagen-3.0-generate-002
OPENAI_VISION_MODEL=gpt-4o
OPENAI_IMAGE_MODEL=dall-e-3

# Engine Settings
ENABLE_MOCK_FALLBACK=True      # If True, automatically falls back to MockAIProvider if keys are missing
TIMEOUT_SECONDS=60
LOG_LEVEL=INFO
```

---

## 4. Backend Integration Guide

Backend engineers can interact with the engine either through simple standalone functions or the unified `AIEngine` facade.

### A. Supported Image Inputs

All functions accept images in any of the following formats:
- **Cloudinary / Web URL**: `"https://res.cloudinary.com/.../shoe.jpg"`
- **Local File Path**: `"./uploads/sample_shoe.png"` or `Path("...")`
- **Data URI Base64**: `"data:image/png;base64,iVBORw0KGgo..."`
- **Raw Base64 string**: `"iVBORw0KGgo..."`
- **Raw bytes**: `b"\x89PNG..."`
- **PIL Image**: `PIL.Image.Image`

---

### B. Quickstart Example (Standalone Functions)

```python
from ai_engine import (
    analyze_product,
    build_brand_instructions,
    generate_colorway,
    generate_scene,
    check_product_consistency,
    get_format_config
)

# 1. Analyze an uploaded product image
analysis = analyze_product("https://res.cloudinary.com/demo/image/upload/sample_sneaker.jpg")
print(f"Detected Category: {analysis.category}")
print(f"Components: {analysis.components}")
print(f"Locked Landmarks: {analysis.important_details}")

# 2. Compile Brand DNA
brand_rules = build_brand_instructions({
    "brand_name": "LUXORA",
    "aesthetic": "Minimalist Luxury",
    "primary_color": "#0B1F3A",
    "accent_color": "#C9A227",
    "lighting": "Soft Studio",
    "background_style": "Premium Neutral",
    "mood": "Elegant"
})

# 3. Generate a Colorway Variant
colorway_result = generate_colorway(
    image="https://res.cloudinary.com/demo/image/upload/sample_sneaker.jpg",
    target_color="Crimson Red",
    product_context=analysis,       # Pass cached analysis to skip re-running vision
    brand_dna=brand_rules,
    target_format="1:1"
)
# colorway_result.image_bytes is ready to be uploaded to Cloudinary
# colorway_result.image_base64 is ready for immediate frontend preview

# 4. Stage Product in a Commercial Scene
scene_result = generate_scene(
    image="https://res.cloudinary.com/demo/image/upload/sample_sneaker.jpg",
    scene_type="Luxury",            # 'Premium Studio', 'Minimal', 'Lifestyle', 'Urban', 'Luxury'
    product_context=analysis,
    target_format="16:9"
)

# 5. Verify Fidelity & Consistency
verdict = check_product_consistency(
    original_image="https://res.cloudinary.com/demo/image/upload/sample_sneaker.jpg",
    generated_image=colorway_result.image_bytes,
    product_context=analysis
)
print(f"Is consistent: {verdict.is_consistent} (Score: {verdict.score})")
if not verdict.is_consistent:
    print(f"Fidelity Issues: {verdict.issues}")
```

---

### C. Using the Unified `AIEngine` Facade

```python
from ai_engine import AIEngine

engine = AIEngine()

# All operations through one object
analysis = engine.analyze_product(image_url)
colorway = engine.generate_colorway(image_url, "Triple Black", product_context=analysis)
verdict = engine.check_product_consistency(image_url, colorway.image_bytes)
```

---

## 5. Input and Output Schemas

### `ProductAnalysisResult`
```json
{
  "category": "Sneaker",
  "subcategory": "Lifestyle Running Sneaker",
  "primary_color": "Navy Blue",
  "secondary_colors": ["White", "Silver"],
  "material": "Engineered Breathable Mesh with Synthetic Leather Overlays",
  "components": ["laces", "eyelets", "tongue", "midsole", "outsole", "heel counter", "side logo badge", "stitching"],
  "orientation": "three-quarter",
  "background": "plain seamless studio white",
  "product_position": "center",
  "important_details": [
    "side emblem logo geometry",
    "segmented honeycomb midsole structure",
    "double-stitch line along the toe box",
    "perforated upper ventilation texture"
  ],
  "visual_attributes": {
    "finish": "matte with subtle gloss accents",
    "texture": "perforated woven mesh",
    "reflectivity": "low"
  },
  "confidence": {
    "category": 0.98,
    "primary_color": 0.96,
    "material": 0.94,
    "overall": 0.96
  }
}
```

### `BrandDNA`
```json
{
  "brand_name": "LUXORA",
  "aesthetic": "Minimalist Luxury",
  "primary_color": "#0B1F3A",
  "accent_color": "#C9A227",
  "lighting": "Soft Studio",
  "background_style": "Premium Neutral",
  "mood": "Elegant",
  "custom_guidelines": ["Never use harsh primary backdrops"]
}
```

### `GenerationResult`
```python
GenerationResult(
    image_bytes=b"...",                  # Raw bytes of generated PNG
    image_base64="data:image/png;base64,...",  # Data URI string
    image_url=None,                      # Or remote hosted URL
    prompt_used="...",                   # Deterministic compiled prompt
    negative_prompt_used="...",
    provider="gemini",                   # 'gemini' | 'openai' | 'mock'
    model="imagen-3.0-generate-002",
    metadata={"variant_type": "colorway", "target_color": "Crimson Red", "aspect_ratio": "1:1"}
)
```

### `ConsistencyValidationResult`
```json
{
  "is_consistent": true,
  "score": 0.94,
  "issues": [],
  "changed_attributes": ["primary_color"],
  "passed_checks": [
    "shape_and_silhouette",
    "branding_and_logo",
    "component_integrity",
    "stitching_quality",
    "material_authenticity"
  ],
  "details": {
    "silhouette_score": 0.97,
    "branding_score": 0.95,
    "component_score": 0.93,
    "material_score": 0.92
  }
}
```

---

## 6. Prompt Engineering Strategy

Prompts are assembled deterministically using `OmniStagePromptBuilder` according to the 7-layer architecture:

1. **System Instructions**: Declares model identity, strict invariance rules, and commercial e-commerce standards.
2. **Product Context**: Ground truth specifications from initial analysis (category, original material, verified physical components).
3. **Brand DNA**: Signature lighting, mood, backdrop atmosphere, and color accent guidelines.
4. **Target User Request**: Precise transformation instruction (e.g. re-color primary material to "Crimson Red" while respecting material physics).
5. **Format & Composition Rules**: Aspect ratio, center-alignment, safe padding margins, and focal anchoring.
6. **Preservation Invariants**: Strict non-negotiable negative boundary (do not alter silhouette, geometry, logos, stitching, or sole treads).
7. **Negative Constraints**: Standardized negative prompt filtering distortion, mutations, blur, and artifacts.

---

## 7. Supported Aspect Ratios & Formats

| Aspect Ratio | Standard Dimensions | Channel Use Case | Safe Margin Padding |
| :--- | :--- | :--- | :--- |
| **`1:1`** | 1080 x 1080 | Marketplace / Amazon / Instagram Square | 10% |
| **`4:5`** | 1080 x 1350 | Instagram Mobile Portrait Feed | 12% |
| **`9:16`** | 1080 x 1920 | TikTok / Instagram Reels / Stories | 20% (Central focal lock) |
| **`16:9`** | 1920 x 1080 | Website Hero Banner / Desktop Landscape | 15% |

> **Note on Cloudinary Responsibilities**: The AI Engine supplies composition requirements during generation. Final image delivery, dynamic resizing, CDN caching, and generative fill padding remain managed by Cloudinary.

---

## 8. Provider Abstraction & Fallback

OmniStage AI does not lock you into a single proprietary model. The `get_ai_provider()` factory automatically resolves the appropriate provider:

1. **Explicit Selection**: Pass `AI_PROVIDER=gemini`, `AI_PROVIDER=openai`, or `AI_PROVIDER=mock`.
2. **Auto Detection (`AI_PROVIDER=auto`)**:
   - If `GEMINI_API_KEY` is present $\rightarrow$ Uses `GeminiProvider` (Gemini 2.5 Flash + Imagen 3).
   - If `OPENAI_API_KEY` is present $\rightarrow$ Uses `OpenAIProvider` (GPT-4o + DALL-E 3).
   - If neither key is present $\rightarrow$ Automatically falls back to `MockAIProvider` if `ENABLE_MOCK_FALLBACK=True`, enabling local testing and continuous integration without live API keys.

---

## 9. Error Handling & Custom Exceptions

All errors raised by the AI Engine subclass `AIEngineError`:

- `MissingAPIKeyError`: Raised when provider requires an unconfigured API key.
- `ImageInputError` / `UnsupportedImageFormatError`: Raised when input image is corrupted, unreachable, or unsupported.
- `ModelResponseError`: Raised when upstream vision model returns unparseable JSON or violates schema.
- `GenerationError`: Raised if the generative image model fails to produce output.
- `ConsistencyValidationError`: Raised when comparative quality assurance cannot be executed.
- `RateLimitError`: Raised on upstream provider HTTP 429 / resource exhaustion.
- `TimeoutError`: Raised if network requests exceed `TIMEOUT_SECONDS`.

---

## 10. Running Tests

The test suite covers schema validation, prompt compilation, colorway and scene generation, format constraints, provider resolution, error handling, and end-to-end integration:

```bash
# Run the complete test suite
pytest ai_engine/tests/ -v
```
