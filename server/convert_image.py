import sys
import os
from PIL import Image

def convert_image(input_path, output_path, output_format):
    try:
        with Image.open(input_path) as img:
            # Convert mode for formats that don't support RGBA (like JPEG)
            if output_format.upper() in ['JPEG', 'JPG', 'BMP', 'EPS'] and img.mode == 'RGBA':
                img = img.convert('RGB')
            
            # Save
            img.save(output_path, format=output_format)
            print("Conversion Successful")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python convert_image.py <input> <output> <format>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    fmt = sys.argv[3]
    
    # Map friendly names to PIL format names
    fmt_map = {
        'jpg': 'JPEG',
        'jpeg': 'JPEG',
        'png': 'PNG',
        'webp': 'WEBP',
        'gif': 'GIF',
        'bmp': 'BMP',
        'tiff': 'TIFF',
        'ico': 'ICO',
        'eps': 'EPS',
        'tga': 'TGA'
    }
    
    pil_format = fmt_map.get(fmt.lower(), fmt.upper())
    
    convert_image(input_path, output_path, pil_format)
