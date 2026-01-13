#!/usr/bin/env python3
"""
Preload the rembg model during container startup to avoid timeout on first request.
"""
from rembg import new_session
import os

def preload_models():
    """Download and cache the rembg models."""
    print("Preloading rembg models...")
    
    # Preload only the default u2net model to save memory on free tier
    try:
        session = new_session("u2net")
        print("✓ u2net model loaded successfully")
    except Exception as e:
        print(f"✗ Failed to load u2net model: {e}")
    
    print("Model preloading complete!")


if __name__ == "__main__":
    preload_models()
