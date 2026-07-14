import os
import glob

base = "C:/Users/sergu/OneDrive/Documents/AngieScientific/src"
files = glob.glob(base + "/**/*.tsx", recursive=True)

untranslated = []

for f in files:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    if "useLanguage" not in content and "useTranslation" not in content:
        untranslated.append(f)

print(f"Found {len(untranslated)} files without useLanguage:")
for f in untranslated:
    print(f.replace(base, ""))
