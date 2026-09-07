import pdfplumber
import json
import os

pdfs = {
    "strategy": r"C:\Users\joysh\Documents\caspr\caspr-claude-core\Other Inputs\Strategic_Options_European_Retail_Banks.pdf",
    "investors": r"C:\Users\joysh\Documents\caspr\caspr-claude-core\Other Inputs\European_B2B_HR_Tech_Investment_Landscape.pdf",
    "agencies": r"C:\Users\joysh\Documents\caspr\caspr-claude-core\Other Inputs\UK_Sustainable_Personal_Care_Pitch_Brief.pdf",
    "startups": r"C:\Users\joysh\Documents\caspr\caspr-claude-core\Other Inputs\North_American_Fleet_Management_Software_Market.pdf",
    "category": r"C:\Users\joysh\Documents\caspr\caspr-claude-core\Other Inputs\European_Plant_Based_Food_Category_Report_2024.pdf",
    "market_research": r"C:\Users\joysh\Documents\caspr\caspr-claude-core\Other Inputs\UK Embedded Finance & BNPL Consumer Brief v1.pdf",
    "academic": r"C:\Users\joysh\Documents\caspr\caspr-claude-core\Other Inputs\Climate_Tech_Investment_Flows_in_Emerging_Markets.pdf",
}

results = {}

for key, path in pdfs.items():
    print(f"\n{'='*60}")
    print(f"PDF: {key}")
    print(f"{'='*60}")

    with pdfplumber.open(path) as pdf:
        total_pages = len(pdf.pages)
        print(f"Total pages: {total_pages}")

        # Extract first 15 pages text
        for i in range(min(15, total_pages)):
            page = pdf.pages[i]
            text = page.extract_text()
            if text:
                print(f"\n--- PAGE {i+1} ---")
                print(text[:3000])  # First 3000 chars per page
