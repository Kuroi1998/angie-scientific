import os
import glob

base = "C:/Users/sergu/OneDrive/Documents/AngieScientific/src/features/physics-chemistry-lab"
files = glob.glob(base + "/**/*.tsx", recursive=True)

hooks_path = "C:/Users/sergu/OneDrive/Documents/AngieScientific/src/hooks/useLanguage.ts"

for f in files:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    if "import { useLanguage }" in content:
        # Calculate relative path
        f_dir = os.path.dirname(f)
        rel = os.path.relpath(hooks_path, f_dir)
        rel = rel.replace("\\", "/").replace(".ts", "")
        if not rel.startswith("."):
            rel = "./" + rel
        
        # Replace the line
        lines = content.split("\n")
        for i, line in enumerate(lines):
            if line.startswith("import { useLanguage }"):
                lines[i] = f"import {{ useLanguage }} from '{rel}';"
        
        with open(f, "w", encoding="utf-8") as file:
            file.write("\n".join(lines))
