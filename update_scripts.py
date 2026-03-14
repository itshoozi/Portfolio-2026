import os

files = [
    'advice-bot.html', 'beginning-experience.html', 'code-ninjas.html',
    'db-script.html', 'discsender.html', 'eastwood-caddyshack.html',
    'index.html', 'old-school-arcade.html', 'portfolio-concept.html',
    'project-template.html', 'science-geek-games.html', 'teach-kids-code.html',
    'the-garden.html'
]

tag = '<script src="js/transitions.js"></script>\n'

for f_path in files:
    if os.path.exists(f_path):
        with open(f_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'js/transitions.js' not in content:
            if '</body>' in content:
                new_content = content.replace('</body>', tag + '</body>')
                with open(f_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {f_path}")
            else:
                print(f"No </body> tag in {f_path}")
        else:
            print(f"Already updated: {f_path}")
