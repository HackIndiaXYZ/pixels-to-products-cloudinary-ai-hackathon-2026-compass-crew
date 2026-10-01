"""
Alias and export forwarding for product_analyzer.
Ensures compatibility with both ai_engine/vision/analyzer.py and ai_engine/vision/product_analyzer.py.
"""
from ai_engine.vision.analyzer import ProductAnalyzer, analyze_product

__all__ = ["ProductAnalyzer", "analyze_product"]
