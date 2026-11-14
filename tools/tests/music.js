// every place has a tune that exists, and it starts when you walk in
start({}); badges(25);
const missing = [];
for (const id of Object.keys(v().AREAS)) {
  const a = v().AREAS[id]; if (a.planned) continue;
  const m = a.music; if (!m) { missing.push(id + ':none'); continue; }
}
log('areas without music', missing);
v().unlockAudio && v().unlockAudio();
for (const id of ['khortytsia', 'podil', 'polissia', 'verkhovyna', 'polonyna', 'chornohora', 'kamianets', 'dniester', 'liman', 'odesa', 'vylkove', 'lviv', 'fair', 'khutir', 'lake', 'ferry', 'korchma2']) { go(id, 5, 5); tick(5); }
log('last music', v().music, 'sound trouble', v().soundTrouble);
done();
