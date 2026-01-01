import sys
import os
import subprocess

def word_to_pdf(input_docx, output_pdf):
    try:
        # Resolve absolute paths
        input_abs = os.path.abspath(input_docx)
        output_dir = os.path.dirname(os.path.abspath(output_pdf))
        
        # Ensure output directory exists
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # Build LibreOffice command
        # --headless: Run without GUI
        # --convert-to pdf: Target format
        # --outdir: Output directory
        cmd = [
            'libreoffice', 
            '--headless', 
            '--convert-to', 'pdf', 
            '--outdir', output_dir,
            input_abs
        ]
        
        # Execute command
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        
        if result.returncode != 0:
            raise Exception(f"LibreOffice failed: {result.stderr}")
            
        # LibreOffice saves the file with the same basename but .pdf extension in outdir
        # We need to rename it to the requested output_pdf path if it's different
        
        base_name = os.path.splitext(os.path.basename(input_docx))[0]
        generated_pdf = os.path.join(output_dir, base_name + ".pdf")
        
        # Rename if necessary (and if generated file exists)
        if os.path.exists(generated_pdf) and os.path.abspath(generated_pdf) != os.path.abspath(output_pdf):
            # If target exists, remove it first
            if os.path.exists(output_pdf):
                os.remove(output_pdf)
            os.rename(generated_pdf, output_pdf)
            
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
