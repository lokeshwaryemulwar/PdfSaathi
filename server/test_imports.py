try:
    import pdfplumber
    import pandas
    import openpyxl
    print("Imports successful")
except Exception as e:
    print(f"Import failed: {e}")
