import sys
from xhtml2pdf import pisa

def convert_html_to_pdf(source_html_path, output_filename):
    try:
        # Open source file
        with open(source_html_path, "r", encoding='utf-8') as source_file:
            source_html = source_file.read()

        # Open output file
        with open(output_filename, "wb") as output_file:
            # Convert
            pisa_status = pisa.CreatePDF(
                source_html,
                dest=output_file
            )

        # Check for errors
        if pisa_status.err:
            print("Error during HTML conversion", file=sys.stderr)
            sys.exit(1)
            
        print("Conversion Successful")
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert_html.py <input_html> <output_pdf>")
        sys.exit(1)
    
    source = sys.argv[1]
    dest = sys.argv[2]
    
    convert_html_to_pdf(source, dest)
