import sys
import pdfplumber
import pandas as pd

def convert_pdf_to_excel(pdf_file, excel_file):
    try:
        with pdfplumber.open(pdf_file) as pdf:
            with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
                has_tables = False
                for i, page in enumerate(pdf.pages):
                    # Try extraction strategies
                    tables = page.extract_tables()
                    
                    if tables:
                        has_tables = True
                        for j, table in enumerate(tables):
                            # Clean None values in table
                            cleaned_table = [['' if cell is None else str(cell) for cell in row] for row in table]
                            
                            df = pd.DataFrame(cleaned_table)
                            # Truncate sheet name to 31 chars (Excel limit)
                            sheet_name = f"P{i+1}_T{j+1}"[:31]
                            df.to_excel(writer, sheet_name=sheet_name, index=False, header=False)
                
                if not has_tables:
                    # Fallback: Try to dump text lines if no tables detected?
                    # Or just a warning sheet.
                    df = pd.DataFrame(["No structured tables found using standard extraction."])
                    df.to_excel(writer, sheet_name="Info", index=False, header=False)
                    print("Warning: No tables found.")
                    
        print("Conversion Successful")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert_excel.py <input_pdf> <output_xlsx>")
        sys.exit(1)
    
    input_pdf = sys.argv[1]
    output_xlsx = sys.argv[2]
    
    convert_pdf_to_excel(input_pdf, output_xlsx)
