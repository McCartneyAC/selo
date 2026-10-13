// HOPAK on the title screen opens a playtest save; the real save stays as it was
localStorage.setItem('vyshneve-save-v2', JSON.stringify({ v: 2, t: 1, name: 'Real', f: { book: 1, intro: 1 }, w: {}, items: {} }));
for (const [k, c] of [['р','KeyH'],['щ','KeyO'],['з','KeyP'],['ф','KeyA'],['л','KeyK']]) { key(k, c); tick(1); }
log(document.getElementById('titleSave').textContent);
key('z'); tick(3); talk();
log('area', v().area, 'pysanky', [0,1,2,3,4,5].map(z => v().S.f['b' + z] ? 1 : 0).join(''), 'horseshoe', !!v().S.items.horseshoe, 'HUD', document.getElementById('hud').textContent);
go('ferry', 22, 15); meet('semen'); talk([1]); for (let i = 0; i < 40; i++) tick(1); log('after Semen:', v().area);
v().S.tx = 1; window.dispatchEvent(new Event('visibilitychange'));
log('real save untouched:', JSON.parse(localStorage.getItem('vyshneve-save-v2')).name, 'playtest saved:', !!localStorage.getItem('vyshneve-playtest'));
done();
