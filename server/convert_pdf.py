import sys
import os
import subprocess

def word_to_pdf(input_docx, output_pdf):
    try:
        # Resolve absolute paths
        input_abs = os.path.abspath(input_docx)
        output_abs = os.path.abspath(output_pdf)
        
        # Ensure output directory exists
        output_dir = os.path.dirname(output_abs)
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # Try using docx2pdf (Best for Windows with MS Word)
        try:
            from docx2pdf import convert
            # convert() handles the conversion
            # On Windows it uses COM, on Mac it uses JXA
            convert(input_abs, output_abs)
            print("Conversion Successful")
            return
        except ImportError:
            print("docx2pdf not installed, falling back to LibreOffice", file=sys.stderr)
        except Exception as e:
            print(f"docx2pdf failed: {e}, falling back to LibreOffice", file=sys.stderr)

        # Build LibreOffice command (Fallback for Linux/Servers)
        cmd = [
            'libreoffice', 
            '--headless', 
            '--convert-to', 'pdf', 
            '--outdir', output_dir,
            input_abs
        ]
        
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        
        if result.returncode != 0:
            # Try 'soffice' as well
            cmd[0] = 'soffice'
            result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            if result.returncode != 0:
                raise Exception("Both docx2pdf and LibreOffice failed.")
            
        # LibreOffice saves the file with the same basename but .pdf extension in outdir
        base_name = os.path.splitext(os.path.basename(input_docx))[0]
        generated_pdf = os.path.join(output_dir, base_name + ".pdf")
        
        if os.path.exists(generated_pdf) and os.path.abspath(generated_pdf) != output_abs:
            if os.path.exists(output_abs):
                os.remove(output_abs)
            os.rename(generated_pdf, output_abs)
            
        print("Conversion Successful")
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert_pdf.py <input_docx> <output_pdf>")
        sys.exit(1)
    
    input_docx = sys.argv[1]
    output_pdf = sys.argv[2]
    
    word_to_pdf(input_docx, output_pdf)
