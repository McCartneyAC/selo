# Resume protocol: levels overhaul (Nov 2026)

If the power went out: read this file, then continue from the first unchecked step.
Folders: ~/selo/github is the git repo (the site plus the code that builds it); ~/selo/local holds the PULS corpus, the Piper model, reference books and notes, and is never pushed. Run commands from ~/selo/github.
Every step can be rerun safely and skips work already on disk.

Decisions (revised 2026-11-14): every level, A1 included, is PULS at PULS's own level. Nothing from the earlier Anki deck remains (word choice, glosses, examples, stress, audio); all glosses are hand-written for this game.
Reaching Baba Yaga needs 75% of a level mastered. New words get Piper TTS audio. Folklore figures are unlocked by mini-quests.
PULS is licensed CC BY-NC-SA 4.0, so the corpus stays in ../local/puls_corpus/ (outside the repo) and PULS is credited.

## Phase 1: corpus
- [x] 1. Fetch (all done; per-level crawl matches the full list exactly; 37/37 themes): `python3 tools/puls/fetch.py all levels topics` (raw pages go to ../local/puls_corpus/raw/; rerun to resume)
- [x] 2. Parse: `python3 tools/puls/parse.py` writes entries_raw.csv, phrases.csv and puls_themes.csv
- [x] 3. Lemmas + buckets: `python3 tools/puls/build.py`
- [x] 4. Glosses: 29 chunks in ../local/puls_corpus/gloss/ (all 8,548 done)
- [x] 5. Final: `python3 tools/puls/assemble.py` builds puls_corpus.csv/.json; README.md written; 30-row + 5 live spot-checks passed
## Phase 2: levels in the game + area mapping + Piper audio
- [x] 6. TTS masters (slow, a few hours): `for k in 0 1 2 3; do nohup taskset -c $k python3 -X utf8 tools/puls/tts.py $k 4 > ../local/puls_corpus/tts_$k.log 2>&1 & done`
      (resumable: skips existing wavs in ../local/puls_corpus/tts/; check with `tail ../local/puls_corpus/tts_*.log`)
- [x] 7. Levels in the game: `python3 tools/levels.py` writes data/levels.json (balanced into 25 places) and build.py inlines it.
      Title screen: arrows (or the on-screen arrow buttons) pick A1–C1. Each level has its own save (A1 keeps the old key). Keeper trial = ceil(75% of the place).
- [x] 8. After TTS: `python3 tools/clips.py` writes clips-A2..C1.json; `python3 tools/build.py`; publish with files clips-*.json
## Phase 3: folklore unlock mini-quests
- [x] 9. src/folk.js (see ../local/STORY.md, spoilers). Test: tools/tests/folk.js

## Notes so far
- 10,361 entries, all unique. Lemmas: A1 890, A2 1262, B1 2213, B2 3354, C1 1891 (no C2 on the site, so no fill needed).
- Game levels: A1 890, A2 1262, B1 2213, B2 3354, C1 1891, all PULS.
- Pairs come only from the hand-written accept list in ../local/puls_corpus/pairs_review.json (tools/puls/pairs_accept.json, committed).
- Glossing: `python3 tools/puls/gloss.py status`, then `todo 300`, then write the next chunk_NNN.tsv ending in '#END'.
- [x] 10. Published as version 19 (2026-11-11)

## Per-level lessons (2026-11-14 evening)
- [x] 11. Characters teach their level's words: src/lessons.js holds, for each of the 41 lessons (keepers, folk beings, errand thanks), a same-theme list of A2/B1/B2/C1 words of the same length as the A1 one; A1 keeps the words written into each scene. Check: `python3 -X utf8 tools/tests/lessons.py` (static) and `tools/tests/lessons.js` (in the browser).
- [x] 12. Audio check: every word at every level (A1 included) is a Piper/Lada clip; none of the deck's old recordings remain in index.html.
- Not per-level, on purpose: the roadQuiz grammar and story puzzles (vocative, motion verbs, colours, wax, jokes…), which are hand-written sentences.

## Deck removed (2026-11-14 night)
- [x] 13. A1 = PULS A1. The 1,062 corpus glosses that had come from the deck were rewritten (gloss chunks 029–032); tools/words.py and tools/themes.py deleted; tools/levels.py builds all five levels (data/words.json is now PULS A1). Saves are version 3, keyed by word (old v2 saves are left alone; only names carry over). Lessons have an A1 list each.
