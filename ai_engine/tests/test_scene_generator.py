"""
Unit tests for Scene Generation pipeline.
"""
from ai_engine.generation.scene import SceneGenerator, generate_scene
from ai_engine.models import GenerationResult


def test_scene_generation_all_archetypes(mock_provider, sample_pil_image):
    """Test generating scenes for each supported archetype."""
    archetypes = ["Premium Studio", "Minimal", "Lifestyle", "Urban", "Luxury"]
    generator = SceneGenerator(provider=mock_provider)

    for arch in archetypes:
        result = generator.generate(
            image=sample_pil_image,
            scene_type=arch,
            target_format="1:1"
        )
        assert isinstance(result, GenerationResult)
        assert result.metadata["scene_type"] == arch
        assert arch.upper() in result.prompt_used


def test_scene_generation_functional_api(mock_provider, sample_image_bytes, sample_brand_dna):
    """Test standalone generate_scene functional interface."""
    result = generate_scene(
        image=sample_image_bytes,
        scene_type="Urban",
        brand_dna=sample_brand_dna,
        target_format="9:16",
        provider=mock_provider
    )
    assert isinstance(result, GenerationResult)
    assert result.metadata["scene_type"] == "Urban"
    assert result.metadata["aspect_ratio"] == "9:16"
