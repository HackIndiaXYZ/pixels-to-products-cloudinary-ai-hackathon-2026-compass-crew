"""
Product Consistency Validation Layer for OmniStage AI.
Compares original reference image and generated variant to verify product identity preservation.
"""
from __future__ import annotations

from typing import Optional, Union, Dict, Any

from ai_engine.exceptions import ConsistencyValidationError, ModelResponseError, AIEngineError
from ai_engine.models import (
    ProductAnalysisResult,
    ConsistencyValidationResult
)
from ai_engine.prompts.consistency_prompts import (
    CONSISTENCY_SYSTEM_PROMPT,
    CONSISTENCY_USER_PROMPT
)
from ai_engine.providers.base import AIProvider
from ai_engine.providers.factory import get_ai_provider
from ai_engine.utils.image_utils import load_image, ImageInputType
from ai_engine.utils.logger import get_logger

logger = get_logger("ai_engine.consistency.validator")


class ConsistencyValidator:
    """
    Rigorously verifies visual consistency between original and generated product images.
    """

    def __init__(self, provider: Optional[AIProvider] = None):
        self.provider = provider or get_ai_provider()

    def validate(
        self,
        original_image: ImageInputType,
        generated_image: ImageInputType,
        product_context: Optional[Union[ProductAnalysisResult, Dict[str, Any]]] = None
    ) -> ConsistencyValidationResult:
        """
        Runs comparative visual verification.

        Args:
            original_image: Canonical reference product image.
            generated_image: Generated variant or staged scene.
            product_context: Optional pre-analyzed product context.

        Returns:
            ConsistencyValidationResult: is_consistent boolean, score (0-1), issues list,
                                         and changed_attributes list.
        """
        logger.info(f"ConsistencyValidator: Validating fidelity via provider '{self.provider.provider_name}'")
        _, orig_bytes, _ = load_image(original_image)
        _, gen_bytes, _ = load_image(generated_image)

        # Context-enriched user prompt if available
        user_prompt = CONSISTENCY_USER_PROMPT
        if product_context:
            if isinstance(product_context, dict):
                product_context = ProductAnalysisResult.model_validate(product_context)
            user_prompt += (
                f"\nReference Product Details to verify:\n"
                f"- Expected Category: {product_context.category}\n"
                f"- Locked Landmarks: {', '.join(product_context.important_details) if product_context.important_details else 'all branding'}\n"
                f"- Verified Components: {', '.join(product_context.components)}\n"
            )

        try:
            raw_evaluation = self.provider.compare_images(
                original_bytes=orig_bytes,
                generated_bytes=gen_bytes,
                system_prompt=CONSISTENCY_SYSTEM_PROMPT,
                user_prompt=user_prompt
            )

            result = ConsistencyValidationResult.model_validate(raw_evaluation)
            logger.info(
                f"ConsistencyValidator: Check completed. is_consistent={result.is_consistent}, "
                f"score={result.score:.2f}, issues={len(result.issues)}"
            )
            return result

        except Exception as exc:
            if isinstance(exc, AIEngineError):
                raise
            logger.error(f"ConsistencyValidator failed: {str(exc)}")
            raise ConsistencyValidationError(f"Consistency validation failed: {str(exc)}") from exc


def check_product_consistency(
    original_image: ImageInputType,
    generated_image: ImageInputType,
    product_context: Optional[Union[ProductAnalysisResult, Dict[str, Any]]] = None,
    provider: Optional[AIProvider] = None
) -> ConsistencyValidationResult:
    """
    Standard interface for backend engineers to validate product fidelity.

    Example:
        verdict = check_product_consistency(
            original_image="https://res.cloudinary.com/.../shoe_navy.jpg",
            generated_image=result.image_bytes,
            product_context=analysis
        )
        if not verdict.is_consistent:
            print("Warning: Generated variant violated fidelity:", verdict.issues)
    """
    validator = ConsistencyValidator(provider=provider)
    return validator.validate(
        original_image=original_image,
        generated_image=generated_image,
        product_context=product_context
    )
