"""
Unit tests for deterministic prompt builder.
"""
from ai_engine.brand.prompt_builder import OmniStagePromptBuilder
from ai_engine.generation.formats import get_format_config


def test_colorway_prompt_composition(sample_product_analysis, sample_brand_dna):
    """Test full assembly of colorway prompt with all context layers."""
    format_spec = get_format_config("1:1")
    prompts = OmniStagePromptBuilder.build_colorway_prompt(
        target_color="Crimson Red",
        product_context=sample_product_analysis,
        brand_dna=sample_brand_dna,
        format_spec=format_spec,
        additional_instructions="Keep sole bright white"
    )

    assert "system_prompt" in prompts
    assert "prompt" in prompts
    assert "negative_prompt" in prompts

    prompt_text = prompts["prompt"]
    # Check that Product Context is present
    assert "AUTHENTIC PRODUCT SPECIFICATIONS" in prompt_text
    assert "Sneaker" in prompt_text
    assert "Navy" in prompt_text

    # Check that Brand DNA is present
    assert "LUXORA" in prompt_text
    assert "Minimalist Luxury" in prompt_text

    # Check target color request
    assert "Crimson Red" in prompt_text
    assert "Keep sole bright white" in prompt_text

    # Check format requirements
    assert "1:1" in prompt_text

    # Check fidelity constraints
    assert "PRODUCT FIDELITY MANDATE" in prompt_text
    assert "SILHOUETTE & GEOMETRY" in prompt_text


def test_scene_prompt_composition(sample_product_analysis, sample_brand_dna):
    """Test scene staging prompt assembly."""
    format_spec = get_format_config("16:9")
    prompts = OmniStagePromptBuilder.build_scene_prompt(
        scene_type="Luxury",
        product_context=sample_product_analysis,
        brand_dna=sample_brand_dna,
        format_spec=format_spec,
        environment_description="Overlooking penthouse terrace"
    )

    prompt_text = prompts["prompt"]
    assert "COMMERCIAL SCENE STAGING: [LUXURY]" in prompt_text
    assert "Overlooking penthouse terrace" in prompt_text
    assert "16:9" in prompt_text
    assert "PRODUCT FIDELITY MANDATE" in prompt_text
    assert "negative_prompt" in prompts
