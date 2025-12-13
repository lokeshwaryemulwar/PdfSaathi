import sys
import os
from docx2pdf import convert
import pythoncom

def word_to_pdf(input_docx, output_pdf):
    try:
        # docx2pdf on Windows uses COM, which requires absolute paths
        input_abs = os.path.abspath(input_docx)
        output_abs = os.path.abspath(output_pdf)
        
        # Initialize COM for this thread
        pythoncom.CoInitialize()
        
        convert(input_abs, output_abs)
        print("Conversion Successful")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        try:
             pythoncom.CoUninitialize()
        except:
             pass

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert_pdf.py <input_docx> <output_pdf>")
        sys.exit(1)
    
    input_docx = sys.argv[1]
    output_pdf = sys.argv[2]
    
    word_to_pdf(input_docx, output_pdf)
