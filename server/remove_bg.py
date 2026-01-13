import sys
import os
from rembg import remove, new_session
from PIL import Image
import io

def remove_background(input_path, output_path, model_name="u2net"):
    try:
        # Check if input file exists
        if not os.path.exists(input_path):
            print(f"Error: Input file not found at {input_path}")
            sys.exit(1)

        # Open and resize image if too large (memory optimization for free tier)
        with Image.open(input_path) as img:
            # Get original size
            original_size = img.size
            max_dimension = 1500  # Limit to 1500px on longest side
            
            # Resize if needed
            if max(img.size) > max_dimension:
                ratio = max_dimension / max(img.size)
                new_size = tuple(int(dim * ratio) for dim in img.size)
                img = img.resize(new_size, Image.Resampling.LANCZOS)
                print(f"Resized image from {original_size} to {new_size} for memory optimization")
            
            # Convert to RGB if needed (some formats like RGBA can cause issues)
            if img.mode not in ('RGB', 'RGBA'):
                img = img.convert('RGB')
            
            # Save to bytes
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format='PNG')
            input_data = img_byte_arr.getvalue()
            
        print(f"Processing image with model: {model_name}...")
        
        # Initialize session with specific model
        session = new_session(model_name)
        
        # Remove background WITHOUT alpha matting to save memory
        # Alpha matting is memory-intensive and not critical for free tier
        output_data = remove(
            input_data,
            session=session,
            alpha_matting=False  # Disabled for memory optimization
        )
        
        # Save the result
        with open(output_path, 'wb') as o:
            o.write(output_data)
            
        print(f"Successfully saved to {output_path}")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python remove_bg.py <input_path> <output_path> [model_name]")
        sys.exit(1)
        
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    model_name = sys.argv[3] if len(sys.argv) > 3 else "u2net"
    
    remove_background(input_file, output_file, model_name)
