"""
End-to-End Integration and Facade Tests for OmniStage AI Engine.
Validates the complete workflow:
IMAGE -> ANALYSIS -> BRAND DNA -> GENERATION -> CONSISTENCY VALIDATION
"""
from ai_engine.engine import AIEngine
from ai_engine.models import (
    ProductAnalysisResult,
    BrandDNA,
    BrandInstructions,
    GenerationResult,
    ConsistencyValidationResult
)


def test_complete_omnistage_workflow(ai_engine_instance, sample_pil_image):
    """
    Validates the end-to-end product variant creation pipeline:
    1. Upload / load image
    2. Vision analysis
    3. Brand DNA instructions compilation
    4. Colorway variant generation
    5. Scene staging generation
    6. Consistency fidelity verification
    """
    engine = ai_engine_instance

    # 1 & 2. Product Image Analysis
    analysis = engine.analyze_product(sample_pil_image)
    assert isinstance(analysis, ProductAnalysisResult)
    assert analysis.category == "Sneaker"
    assert len(analysis.components) > 0

    # 3. Brand DNA Compilation
    brand_dna = BrandDNA(
        brand_name="LUXORA",
        aesthetic="Minimalist Luxury",
        primary_color="#0B1F3A",
        accent_color="#C9A227",
        lighting="Soft Studio",
        background_style="Premium Neutral",
        mood="Elegant"
    )
    brand_rules = engine.build_brand_instructions(brand_dna)
    assert isinstance(brand_rules, BrandInstructions)
    assert brand_rules.brand_name == "LUXORA"

    # 4. Colorway Variant Synthesis
    colorway_res = engine.generate_colorway(
        image=sample_pil_image,
        target_color="Crimson Red",
        product_context=analysis,
        brand_dna=brand_dna,
        target_format="1:1"
    )
    assert isinstance(colorway_res, GenerationResult)
    assert colorway_res.image_bytes is not None
    assert colorway_res.metadata["target_color"] == "Crimson Red"

    # 5. Scene Staging Synthesis
    scene_res = engine.generate_scene(
        image=sample_pil_image,
        scene_type="Luxury",
        product_context=analysis,
        brand_dna=brand_dna,
        target_format="16:9"
    )
    assert isinstance(scene_res, GenerationResult)
    assert scene_res.metadata["scene_type"] == "Luxury"

    # 6. Consistency Validation
    verdict = engine.check_product_consistency(
        original_image=sample_pil_image,
        generated_image=colorway_res.image_bytes,
        product_context=analysis
    )
    assert isinstance(verdict, ConsistencyValidationResult)
    assert verdict.is_consistent is True
    assert verdict.score >= 0.85
