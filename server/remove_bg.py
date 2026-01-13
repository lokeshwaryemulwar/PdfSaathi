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

        # Open the image file
        with open(input_path, 'rb') as i:
            input_data = i.read()
            
        print(f"Processing image with model: {model_name}...")
        
        # Initialize session with specific model
        session = new_session(model_name)
        
        # Remove background with alpha matting for better edge detection
        output_data = remove(
            input_data,
            session=session,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=10
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
