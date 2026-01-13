#!/usr/bin/env python3
"""
Preload the rembg model during container startup to avoid timeout on first request.
"""
from rembg import new_session
import os

def preload_models():
    """Download and cache the rembg models."""
    print("Preloading rembg models...")
    
    # Preload the default u2net model
    try:
        session = new_session("u2net")
        print("✓ u2net model loaded successfully")
    except Exception as e:
        print(f"✗ Failed to load u2net model: {e}")
    
    # Preload the u2net_human_seg model (used for better human segmentation)
    try:
        session = new_session("u2net_human_seg")
        print("✓ u2net_human_seg model loaded successfully")
    except Exception as e:
        print(f"✗ Failed to load u2net_human_seg model: {e}")
    
    print("Model preloading complete!")

if __name__ == "__main__":
    preload_models()
