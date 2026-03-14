import os
import re

curtain_html = r'''
<div class="pt-curtain" aria-hidden="true">
  <div class="pt-panel"></div>
  <div class="pt-panel"></div>
  <div class="pt-panel"></div>
</div>
'''

head_script = r'''
<script>
  if (sessionStorage.getItem('pt_active') === 'true') {
    document.documentElement.classList.add('pt-loading');
  }
</script>
'''

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Inject head script before </head>
    if '<script>' not in content or 'pt_active' not in content:
        content = content.replace('</head>', head_script + '\n</head>')
    
    # 2. Inject curtain div after <body>
    if 'pt-curtain' not in content:
        # Avoid double inject
        content = re.sub(r'(<body[^>]*>)', r'\1' + curtain_html, content)
    
    # 3. Clean up old page-fade if exists
    content = content.replace('<div class="page-fade" aria-hidden="true"></div>', '')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
for html_file in html_files:
    print(f"Processing {html_file}...")
    process_file(html_file)

print("Done.")
