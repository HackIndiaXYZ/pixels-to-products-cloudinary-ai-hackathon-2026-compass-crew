"""
Unit tests for Brand DNA parsing and directive compilation.
"""
from ai_engine.models import BrandDNA, BrandInstructions
from ai_engine.brand.brand_dna import BrandDNAManager, build_brand_instructions


def test_brand_dna_harmonization():
    """Verify harmonization between accent_color and secondary_color."""
    dna1 = BrandDNA(brand_name="TestBrand", secondary_color="#FF0000")
    assert dna1.accent_color == "#FF0000"
    assert dna1.secondary_color == "#FF0000"

    dna2 = BrandDNA(brand_name="TestBrand", accent_color="#00FF00")
    assert dna2.accent_color == "#00FF00"
    assert dna2.secondary_color == "#00FF00"


def test_build_brand_instructions(sample_brand_dna):
    """Test generating structured brand instructions."""
    instructions = build_brand_instructions(sample_brand_dna)
    assert isinstance(instructions, BrandInstructions)
    assert instructions.brand_name == "LUXORA"
    assert "Minimalist Luxury" in instructions.summary
    assert "#0B1F3A" in instructions.color_palette_directive
    assert "Soft Studio" in instructions.lighting_directive
    assert "Never use harsh primary backdrops" in instructions.prompt_snippet


def test_build_brand_instructions_from_dict():
    """Test passing raw dictionary matching backend schema."""
    raw_dict = {
        "brand_name": "NORDIC",
        "aesthetic": "Scandinavian Minimalist",
        "primary_color": "#FFFFFF",
        "lighting": "Natural Soft Daylight",
        "background_style": "Pale Birch Wood",
        "mood": "Calm"
    }
    instructions = build_brand_instructions(raw_dict)
    assert instructions.brand_name == "NORDIC"
    assert "Scandinavian Minimalist" in instructions.prompt_snippet
    assert "Pale Birch Wood" in instructions.background_directive
