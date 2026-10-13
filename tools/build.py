# Assembles index.html from src/ and injects the maps, the word table and the audio offsets.
import json, os, subprocess, sys
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
rd = lambda *p: open(os.path.join(root, *p), encoding='utf-8').read()
maps = subprocess.run([sys.executable, os.path.join(root, 'tools', 'mapgen.py')], capture_output=True, text=True, check=True).stdout.strip()
words = rd('data', 'words.json')
clips = rd('data', 'clips.json')
music = rd('data', 'music.json')
js = '\n'.join(rd('src', f) for f in ['art.js', 'art2.js', 'art3.js', 'art4.js', 'art5.js', 'art6.js', 'art7.js', 'world.js', 'learn.js', 'quest.js', 'story.js', 'far.js', 'rapids.js', 'north.js', 'mountains.js', 'podillia.js', 'sea.js', 'lviv.js', 'errands.js', 'church.js', 'finale.js', 'boot.js'])
for key, val in [('/*MAPS*/null', maps), ('/*WORDS*/null', words), ('/*CLIPS*/null', clips), ('/*MUSIC*/null', music)]:
    assert js.count(key) == 1, key
    js = js.replace(key, val)
html = rd('src', 'page.html') + "\n<script>\n(() => {\n'use strict';\n" + js + "\n})();\n</script>\n"
open(os.path.join(root, 'index.html'), 'w', encoding='utf-8').write(html)
print('index.html', len(html.encode()) // 1024, 'KB')
