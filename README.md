# Selo

A browser game for learning Ukrainian vocabulary: walk a Ukrainian village and beyond, meet people, and learn words to earn pysanky. It has levels A1–C1.
As you travel through Ukraine, you will meet many people, animals, and more who help you build your vocabulary.  The guesses are multiple choice, and the distractor words are chosen based on Levenshtein distance to be maximally difficult within the set of vocabulary words. 

## Layout

- `index.html` is the built game: one self-contained page. `clips-A2.json` … `clips-C1.json` hold the voices for the A2–C1 words, and the page loads them from beside itself.
- `src/` is the game source. `tools/build.py` assembles it into `index.html`.
- `data/` holds the word tables, voice clips and music that the build inlines.
- `tools/` holds the build, the map generator, the music converters, the corpus and TTS scripts (`tools/puls/`), and the browser tests (`tools/tests/`).
- `docs/` holds the design notes. The story plan (spoilers) is kept out of the repo.

## Build and test

```sh
python3 tools/build.py                       # src/ + data/ -> index.html
python3 tools/tests/play.py tools/tests/levels.js   # headless Chromium scenario
```

Regenerating the level tables (`tools/levels.py`) and voices (`tools/clips.py`, `tools/puls/tts.py`) needs the private working files in `../local/`, which are not part of this repo.

## Credits and licences

- Every level's word list (A1–C1) comes from PULS, the Ukrainian Vocabulary Profile (puls.peremova.org; School of Ukrainian Language and Culture at UCU), licensed CC BY-NC-SA 4.0, at PULS's own levels. The English glosses were written for this game. The game is non-commercial and shares the derived word tables (`data/words.json`, `data/levels.json`) under the same licence.
- Every word's voice was generated offline with Piper (uk_UA-ukrainian_tts-medium, speaker Lada).
- The music is traditional Ukrainian folk tunes.
- The title cover is drawn from a photograph by the author of Easter dancing in vyshyvanky at St Sophia's in Kyiv (`tools/cover/cover.py`).
