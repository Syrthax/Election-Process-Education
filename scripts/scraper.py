#!/usr/bin/env python3
"""
ECI Candidate Data Scraper
==========================
Scrapes candidate affidavit data from the Election Commission of India
and normalizes it into structured JSON for use in VoteWise.

Sources:
- https://affidavit.eci.gov.in/ (Official ECI Affidavit portal)
- https://myneta.info/ (Association for Democratic Reforms - public data)

Usage:
  python scraper.py --state "Maharashtra" --constituency "Mumbai North"
  python scraper.py --all
  python scraper.py --from-csv data.csv

Output:
  Writes to ../src/data/candidates.json

Note:
  For hackathon purposes, this scraper uses myneta.info which provides
  structured candidate data from ECI affidavits. For production use,
  integrate directly with ECI's official API when available.
"""

import json
import re
import sys
import os
import argparse
from datetime import datetime

try:
    import requests
    from bs4 import BeautifulSoup
    HAS_SCRAPING_DEPS = True
except ImportError:
    HAS_SCRAPING_DEPS = False

# ============================================================
# Configuration
# ============================================================

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'candidates.json')

MYNETA_BASE = 'https://myneta.info'

HEADERS = {
    'User-Agent': 'VoteWise-Scraper/1.0 (Election Education Project)',
    'Accept': 'text/html,application/xhtml+xml',
}

# ============================================================
# Data Parsing Utilities
# ============================================================

def parse_currency(text):
    """Parse Indian currency strings like '₹12.5 Cr' or '₹45 L' to standardized format."""
    if not text:
        return '₹0'
    text = text.strip().replace(',', '').replace('Rs', '').replace('₹', '').strip()
    
    # Already formatted
    if 'Cr' in text or 'L' in text:
        return f'₹{text}'
    
    try:
        num = float(re.sub(r'[^\d.]', '', text))
        if num >= 10000000:
            return f'₹{num/10000000:.1f} Cr'
        elif num >= 100000:
            return f'₹{num/100000:.0f} L'
        else:
            return f'₹{num:.0f}'
    except (ValueError, TypeError):
        return '₹0'


def clean_text(text):
    """Clean scraped text of extra whitespace and special characters."""
    if not text:
        return ''
    return re.sub(r'\s+', ' ', text).strip()


def generate_id(state, constituency, index):
    """Generate a unique candidate ID."""
    prefix = ''.join(w[0].lower() for w in constituency.split()[:2])
    return f'{prefix}-{index + 1:03d}'


# ============================================================
# CSV Ingestion (Preferred for hackathon)
# ============================================================

def ingest_from_csv(csv_path):
    """
    Ingest candidate data from a CSV file.
    
    Expected columns:
    State, Constituency, Name, Party, PartyAbbr, Age, Gender,
    Education, CriminalCases, TotalAssets, TotalLiabilities, Profession
    """
    import csv
    
    constituencies = {}
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            key = (row['State'], row['Constituency'])
            if key not in constituencies:
                constituencies[key] = {
                    'state': row['State'],
                    'name': row['Constituency'],
                    'candidates': [],
                }
            
            idx = len(constituencies[key]['candidates'])
            constituencies[key]['candidates'].append({
                'id': generate_id(row['State'], row['Constituency'], idx),
                'name': clean_text(row['Name']),
                'party': clean_text(row['Party']),
                'partyAbbr': clean_text(row.get('PartyAbbr', '')),
                'age': int(row.get('Age', 0)),
                'gender': clean_text(row.get('Gender', '')),
                'education': clean_text(row.get('Education', '')),
                'criminalCases': int(row.get('CriminalCases', 0)),
                'totalAssets': parse_currency(row.get('TotalAssets', '0')),
                'totalLiabilities': parse_currency(row.get('TotalLiabilities', '0')),
                'profession': clean_text(row.get('Profession', '')),
            })
    
    return list(constituencies.values())


# ============================================================
# Web Scraping (requires requests + beautifulsoup4)
# ============================================================

def scrape_constituency(state, constituency):
    """
    Scrape candidate data for a specific constituency from myneta.info.
    
    Note: This is a reference implementation. The actual selectors may need
    updating based on the current page structure.
    """
    if not HAS_SCRAPING_DEPS:
        print("ERROR: Install scraping dependencies first:")
        print("  pip install requests beautifulsoup4")
        sys.exit(1)
    
    # Search for constituency
    search_url = f'{MYNETA_BASE}/ls2024/'
    print(f'  Fetching: {search_url}')
    
    try:
        response = requests.get(search_url, headers=HEADERS, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f'  ERROR: Failed to fetch page: {e}')
        return None
    
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find constituency link
    candidates = []
    tables = soup.find_all('table')
    
    for table in tables:
        rows = table.find_all('tr')
        for row in rows:
            cells = row.find_all('td')
            if len(cells) >= 5:
                name = clean_text(cells[1].get_text())
                party = clean_text(cells[2].get_text())
                
                if name and party:
                    candidates.append({
                        'id': generate_id(state, constituency, len(candidates)),
                        'name': name,
                        'party': party,
                        'partyAbbr': party[:3].upper() if len(party) <= 5 else '',
                        'age': 0,
                        'gender': '',
                        'education': clean_text(cells[3].get_text()) if len(cells) > 3 else '',
                        'criminalCases': int(re.sub(r'\D', '', cells[4].get_text() or '0')) if len(cells) > 4 else 0,
                        'totalAssets': parse_currency(cells[5].get_text()) if len(cells) > 5 else '₹0',
                        'totalLiabilities': parse_currency(cells[6].get_text()) if len(cells) > 6 else '₹0',
                        'profession': '',
                    })
    
    if candidates:
        return {
            'state': state,
            'name': constituency,
            'candidates': candidates,
        }
    
    return None


# ============================================================
# Output
# ============================================================

def write_output(constituencies, output_path):
    """Write structured JSON output."""
    output = {
        'lastUpdated': datetime.now().strftime('%Y-%m-%d'),
        'source': 'Election Commission of India — Affidavit Data',
        'constituencies': constituencies,
    }
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    total_candidates = sum(len(c['candidates']) for c in constituencies)
    print(f'\n✅ Written {len(constituencies)} constituencies, {total_candidates} candidates')
    print(f'   Output: {output_path}')


# ============================================================
# CLI
# ============================================================

def main():
    parser = argparse.ArgumentParser(
        description='Scrape ECI candidate data for VoteWise',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  python scraper.py --from-csv candidates.csv
  python scraper.py --state "Maharashtra" --constituency "Mumbai North"
  python scraper.py --sample
        '''
    )
    parser.add_argument('--state', help='State name')
    parser.add_argument('--constituency', help='Constituency name')
    parser.add_argument('--from-csv', help='Path to CSV file with candidate data')
    parser.add_argument('--output', default=OUTPUT_PATH, help='Output JSON path')
    parser.add_argument('--sample', action='store_true', help='Generate sample CSV template')
    
    args = parser.parse_args()
    
    if args.sample:
        print('Sample CSV template:')
        print('State,Constituency,Name,Party,PartyAbbr,Age,Gender,Education,CriminalCases,TotalAssets,TotalLiabilities,Profession')
        print('Maharashtra,Mumbai North,Rajesh Kumar,BJP,BJP,55,Male,Post Graduate,0,12500000,1200000,Business')
        print('Maharashtra,Mumbai North,Priya Deshmukh,INC,INC,45,Female,Graduate Professional,0,8300000,450000,Advocate')
        return
    
    if args.from_csv:
        print(f'📂 Ingesting from CSV: {args.from_csv}')
        constituencies = ingest_from_csv(args.from_csv)
        write_output(constituencies, args.output)
        return
    
    if args.state and args.constituency:
        print(f'🔍 Scraping: {args.constituency}, {args.state}')
        result = scrape_constituency(args.state, args.constituency)
        if result:
            write_output([result], args.output)
        else:
            print('❌ No data found')
        return
    
    parser.print_help()


if __name__ == '__main__':
    main()
