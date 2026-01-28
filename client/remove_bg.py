from PIL import Image
import sys

def remove_white_bg(input_path, output_path):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Check for white pixels (with some tolerance)
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                newData.append((255, 255, 255, 0)) # Make Transparent
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Successfully processed {input_path} to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    input_file = r"C:/Users/lucky/.gemini/antigravity/brain/4d5bccb7-613e-43f8-b5fb-b181902aebcc/uploaded_image_1765894906664.png"
    output_logo = r"d:/PDFSaathi/client/public/logo.png"
    output_favicon = r"d:/PDFSaathi/client/public/favicon.png"
    
    remove_white_bg(input_file, output_logo)
    remove_white_bg(input_file, output_favicon)
