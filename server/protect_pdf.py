import sys
from pypdf import PdfReader, PdfWriter

def protect_pdf(input_path, output_path, password):
    try:
        reader = PdfReader(input_path)
        writer = PdfWriter()
        
        # Check if encrypted but accessible (e.g. empty password or owner only)
        if reader.is_encrypted:
            try:
                reader.decrypt("")
            except:
                pass # Try proceeding, might fail if user password is set
        
        # Copy all pages
        writer.append_pages_from_reader(reader)
        
        # Encrypt with new password
        writer.encrypt(user_password=password, owner_password=password)
        
        with open(output_path, "wb") as f:
            writer.write(f)
            
        print("Protection Successful")
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python protect_pdf.py <input_path> <output_path> <password>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    password = sys.argv[3]
    
    protect_pdf(input_path, output_path, password)
