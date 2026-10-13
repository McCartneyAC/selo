# Runs a scripted scenario against index.html#debug in headless Chromium and saves a screenshot.
# usage: shot.py out.png budget_ms "js steps"   (steps run after load; helpers: key(k), at(ms, fn))
import subprocess, sys, os, tempfile
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
out, budget, steps = sys.argv[1], sys.argv[2], sys.argv[3]
html = open(os.path.join(root, 'index.html'), encoding='utf-8').read()
harness = """<script>
const key = k => { addEventListener; dispatchEvent(new KeyboardEvent('keydown', { key: k })); dispatchEvent(new KeyboardEvent('keyup', { key: k })); };
let _t = 0; const at = (ms, fn) => { _t += ms; setTimeout(fn, _t); };
const keys = (k, n, gap) => { for (let i = 0; i < n; i++) at(gap || 120, () => key(k)); };
window.addEventListener('load', () => { %s });
</script>""" % steps
path = os.path.join(root, '_test.html')
open(path, 'w', encoding='utf-8').write(html + harness)
subprocess.run(['chromium', '--headless=new', '--disable-gpu', '--hide-scrollbars', '--enable-logging=stderr', f'--virtual-time-budget={budget}',
                '--window-size=1000,800', f'--screenshot={out}', 'file://' + path + '#debug'], capture_output=True)
r = subprocess.run(['chromium', '--headless=new', '--disable-gpu', '--enable-logging=stderr', f'--virtual-time-budget={budget}', '--dump-dom', 'file://' + path + '#debug'], capture_output=True, text=True)
for l in r.stderr.splitlines():
    if 'CONSOLE' in l: print(l[-300:])
os.remove(path)
