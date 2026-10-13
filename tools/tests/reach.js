// Every place: can you walk from where you arrive to every exit, every door, every sign and everybody you need to talk to?
// People count as obstacles (even ones who only appear later), so a person standing in a corridor shows up here.
start();
const A = v().AREAS, D = v().DOORS, bad = [];
const arrivals = {};
for (const id of Object.keys(A)) for (const e of A[id].exits) (arrivals[e.to] = arrivals[e.to] || []).push([e.tx, e.ty]);
for (const id of Object.keys(A)) for (const h of A[id].hops || []) (arrivals[id] = arrivals[id] || []).push(h);   // places you get to by raft, not on foot
for (const id of Object.keys(D)) for (const k of Object.keys(D[id])) { const [to, tx, ty] = D[id][k]; (arrivals[to] = arrivals[to] || []).push([tx, ty]); }
for (const id of Object.keys(A)) {
  if (A[id].planned || !v().MAPS[id]) continue;
  v().enterArea(id, 1, 1, 'down');
  const W = v().WORLD[id], M = v().MAPS[id], w = M[0].length, h = M.length;
  const people = W.ents.filter(e => e !== v().player && !e.water);
  const solid = (x, y) => x < 0 || y < 0 || x >= w || y >= h || W.blocked[y * w + x] || people.some(e => e.tx === x && e.ty === y);
  const seen = new Set(), q = [];
  for (const [x, y] of arrivals[id] || []) {
    if (solid(x, y)) { bad.push(`${id}: you arrive at ${x},${y}, which is solid`); continue; }
    seen.add(x + ',' + y); q.push([x, y]);
  }
  if (!q.length) { bad.push(`${id}: nowhere to arrive`); continue; }
  while (q.length) {
    const [x, y] = q.shift();
    if (A[id].exits.some(e => e.x === x && e.y === y)) continue;   // stepping on an exit takes you away
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const k = (x + dx) + ',' + (y + dy);
      if (!seen.has(k) && !solid(x + dx, y + dy)) { seen.add(k); q.push([x + dx, y + dy]); }
    }
  }
  const at = (x, y) => seen.has(x + ',' + y);
  const besides = (x, y) => [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => at(x + dx, y + dy));
  for (const e of A[id].exits) if (!at(e.x, e.y)) bad.push(`${id}: can't reach the exit at ${e.x},${e.y} (to ${e.to})`);
  for (const k of Object.keys(D[id] || {})) { const [x, y] = k.split(',').map(Number); if (!at(x, y + 1)) bad.push(`${id}: can't reach the door at ${k} (to ${D[id][k][0]})`); }
  for (const k of Object.keys(A[id].signs || {})) { const [x, y] = k.split(',').map(Number); if (!besides(x, y)) bad.push(`${id}: can't reach the sign at ${k}`); }
  for (const e of people) if (!e.kind || e.talk) { if (!besides(e.tx, e.ty)) bad.push(`${id}: can't reach ${e.id} at ${e.tx},${e.ty}`); }
  log(id, seen.size + ' tiles');
}
for (const b of bad) log('PROBLEM ' + b);
log(bad.length + ' problems');
done();
