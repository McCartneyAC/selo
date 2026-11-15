# Vyshneve 2: a journey across Ukraine

The 9-area build (commit f632790 and the fixes after it) is the MVP. Version 2 grows it to
25 locations with 40 words each. You need 30 of a location's 40 words (75%) to win its pysanka.

Decisions (2026-10-12): a journey across Ukraine · words grouped by theme · saves start fresh.
Later on 2026-10-12: light grammar (it comes through the quests, never as a gate) · Hutsulshchyna is its own region,
locked behind a dialect test, and teaches Hutsul words as bonus words · commit and republish after every phase ·
shortcuts work in both keyboard layouts.

## Locations

| # | Location | Region | Theme of its 40 words | Keeper |
|---|---|---|---|---|
| 0 | Vyshneve | Poltava (home) | greetings, family, home basics | Baba Hanna |
| 1 | The khutir | Poltava | farm animals, bees, the yard | Hryhoriy the beekeeper |
| 2 | The steppe | Poltava | fields, weather, sky, seasons | Danylo the miller |
| 3 | Kalynivka | Poltava | school, reading, little grammar words | Lida the teacher |
| 4 | Sorochyntsi fair | Poltava | buying, selling, money | Vakula |
| 5 | The lake | Poltava | water, fish, swimming | Berehynia |
| 6 | The Dnipro crossing | Poltava | roads, travel, directions | Kozak Mamai |
| 7 | The marsh | Poltava | the body, health, healing | Yaryna |
| 8 | The old forest | Poltava | the forest, magic, fear | Mavka |
| 9 | Khortytsia | Zaporizhzhia | the Sich: freedom, war and peace, history | the koshovyi otaman |
| 10 | The rapids (пороги) | Zaporizhzhia | doing words: verbs of action | the lotsman (river pilot) |
| 11 | Podil | Kyiv | the city: streets, buildings, services | a Kyiv cabbie |
| 12 | The Lavra | Kyiv | faith, holidays, customs | a monk-chronicler |
| 13 | A Polissia village | Polissia | crafts, cloth, clothes | a weaver |
| 14 | The pine forest (бір) | Polissia | plants, berries, mushrooms, trees | the forest bortnyk (wild-honey gatherer) |
| 15 | Verkhovyna | Hutsulshchyna | music, dance, weddings | a trembita player |
| 16 | The polonyna | Hutsulshchyna | food and cooking | a vivchar (shepherd) |
| 17 | Chornohora | Hutsulshchyna | time: days, months, calendar | a molfar |
| 18 | Lake Synevyr | Zakarpattia | love, friends, feelings | Vyr's ghost (the legend of Syn and Vyr) |
| 19 | Kamianets | Podillia | describing things: size, shape, colour, quality | the castle keeper |
| 20 | The Dniester canyon | Podillia | work, jobs, tools | a raftsman |
| 21 | Odesa | Black Sea | the sea, ships, talk and jokes | an Odesa fisherwoman |
| 22 | Vylkove | Danube delta | boats, canals, everyday verbs | a Vylkove boatman |
| 23 | The salt liman | Black Sea | numbers, measures, quantities | the chumaks' salt master |
| 24 | Lviv | Galicia | coffee, cafés, modern life, communication | a coffee-house owner |

Baba Yaga stays in the old forest as the final villain. You face her after all 25 pysanky.

## Hutsulshchyna
Its own region, closed off. Synevyr (Zakarpattia) is the way in. The pass to Verkhovyna is guarded by a Hutsul
ґазда who won't let a stranger through until you answer him in his own speech: a few dialect words (ґражда, ватра,
ґазда, кресаня, бриндза, трембіта, файний, леґінь, ...) taught by a girl at Synevyr. Inside, Hutsuls salt their
talk with dialect, and each dialect word you hear goes into a bonus page of the словник (not part of the 1,000).

## Phase 2 design: Zaporizhzhia and Kyiv
- Gates: Semen's ferry goes downriver to Khortytsia once you hold 3 pysanky. A маршрутка (minibus) leaves the
  Kalynivka post office for Kyiv once you hold 5. Both bring you back the same way, and Hnidko rides there too.
- Khortytsia (Ivan Sirko, the koshovyi otaman, keeper): the Sich behind its palisade, kurins, the church, the old
  oak. Quest: Baba Yaga has sent the Sich a letter demanding their words; you help the kozaks write the reply
  (after Repin's "Kozaks writing a letter to the Sultan"), finding the missing words. Sirko is a kharakternyk.
- The rapids (the lotsman, keeper): a mini-game. Shoot the nine rapids in a chaika while the lotsman shouts
  commands in Ukrainian only: ліворуч, праворуч, прямо, греби, стій. Imperatives, by doing.
- Podil (Mykyta the cabbie, keeper, Did Panas's son): trams, the funicular, Andriyivskyi uzviz. Quest: carry
  Panas's letter to his son, following directions given in Ukrainian.
- The Lavra (the chronicler monk, keeper): golden domes, the bell tower, the caves. Quest: pages of the chronicle
  are going blank; go into the dark caves with a candle and restore the missing words. Kyiv's Lysa Hora is where
  the broom flies from: Baba Yaga's foreshadowing grows.

## Phase 3 as built: Polissia and the Carpathians
- Gates: north out of the old forest once you hold 7 pysanky (Mavka stops you before that). From the Polissia halt,
  Svitlana's night train runs to Synevyr once you hold 9; Ferents's bus at Synevyr takes you back. (Podillia's road
  into the mountains is built in Phase 4.) The Hutsul pass east of Synevyr opens once you answer Mytro the ґазда in Hutsul.
- The bir (Okhrim the bortnyk): four swarms in four borts, found from clues given in Ukrainian prepositions.
- The Polissia village (Hafiia the weaver): dress the children's scarecrow with old clothes from the neighbours,
  asked for in Ukrainian; it wakes and chases off Baba Yaga's magpies. Lukash still plays for Mavka.
- Synevyr (Vyr, keeper): carry Syn's and Vyr's words across the lake, then row Syn over. Ivanka teaches Hutsul words.
- Verkhovyna (Did Yura the trembitar): the wedding musicians have forgotten their kolomyiky.
- The polonyna (Stepan the vatah): Baba Yaga's wind put out the living fire; bring new fire, then cook banush.
- Chornohora (the molfar): win the stolen days and months back from the old magpie's nest at the Pip Ivan
  observatory. The molfar's prophecy: she can sweep up any word left lying about, but not one spoken aloud.
- Hutsul words: 20 bonus words on the ГОВІРКА page of the словник, noted the first time you hear them.
- Kyiv, after playtesting: the cave mouth opens from either half, Ahafia gives anyone a candle, the caves are bigger
  (an underground church, Brother Ioan, six saints). Pigeons in Podil. Andriyivskyi uzviz goes up to St Andrew's church,
  with St Andrew's Eve at Pani Motrona's: bite the kalyta without laughing.

## Phase 4 as built: Podillia, the Black Sea and Lviv
- Gates: the fair's west road to Kamianets once you hold 11 pysanky (Yosyp the carter); the steppe's chumak road south to the
  salt liman once you hold 13 (Ivan the chumak); Lviv once you hold 15, by Pan Roman's bus from Kamianets or Ferents's
  bus and the night train from Synevyr. Pani Zirka's tram in Lviv goes back to either. The Dniester's river road goes up to
  Verkhovyna, but only once Mytro has passed you (and down from Verkhovyna only with 11). The liman's road runs on east to
  Odesa; Captain Hryhorovych's «Ракета» goes from Odesa's port to Vylkove, and Tolik takes you back.
- Every Phase 4 story is the same theft seen six ways: Baba Yaga's magpies and her black wind are taking whole kinds of
  words now, carrying them west in sacks. In Lviv they fly home to the old forest: she knows you're coming.
- Kamianets (Pan Bohdan, castle keeper): the town is drained of colour (a grey filter that lifts as you go). Ruzha the
  flower seller, Marian the painter and Olia at the balloon field each need their colour or shape words back; then you
  describe the flag and Bohdan raises it over the castle. The balloons go up. Story item: the castle key (за́мок / замо́к).
- The Dniester at Bakota (Did Yakiv, raftsman, once a Hutsul бокораш): the black wind swapped everyone's job words, so
  the journalist waits tables, the waiter reads contracts, the lawyer measures the river, the scientist bosses the apple
  trees and the boss interviews a lizard. Tell each who they really are; then the raft goes down to the Bakota rock
  monastery, where Brother Iov tells of the drowned village and gives you its little bell: whoever hears it remembers.
- The salt liman (Opanas the salt master): the chumaks count "one, two, a lot". Call out the sums while they load.
  Story item: a chumak's tar pot. Flamingos in the pink water.
- Odesa (Tiotia Sonia at the Pryvoz): it's Humorina and every joke has lost its ending. Finish four jokers' jokes with
  the little talking words (насправді, звичайно, нарешті, очевидно...). Story item: a seashell.
- Vylkove (Did Fedot, Lipovan boatman): the storm washed the addresses off Nastia's parcels; deliver them by listening
  to мій/наш/його/її, завжди/рідко, чому/де. Fedot rows you to kilometre zero. Story item: a pelican feather.
- Lviv (Pani Ilona's café «Під левом»): magpies sit on every wire and pick the words off it. From the old underground
  telephones in the poshtamt you call Baba Hanna, Mykyta, Ivanka and Lukash and ask them to stand with you and speak
  aloud when you face her (S.f.dzvin). Story item: a jar of coffee for Ostap, for writing the duma.
- For Phase 5 to pay off: the four friends you called come to the old forest; the Bakota bell, the castle key, the
  shell, the feather and the tar pot are all yours to use there; Ostap gets his coffee.
- Code: src/podillia.js, src/sea.js, src/lviv.js; sprites in src/art7.js (new map letters are Cyrillic: see its header).
  Tests: podillia.js, sea.js, lviv.js. HOPAK now gives 15 pysanky. Music is still borrowed.

## Getting around
- Home region: as now. The horseshoe (the Kozak's Duma quest) lets you ride from any signpost.
- Each region has a gate in the home region, opened by your pysanka count:
  the Dnipro ferry downriver → Zaporizhzhia; Kalynivka's north road → Kyiv; the forest's north edge → Polissia;
  the fair's west road → Podillia → Carpathians → Lviv; the steppe's south road (the chumak road) → the liman → Odesa → Vylkove.

## HUD and UI
- The HUD shows a pysanka counter (◆ 7/25) and the word count, not a row of eggs.
- A world map overlay: regions, where you are, which pysanky you hold, where you can travel.
- The словник gets a pysanka gallery and filters by region.

## Rewards
- Each pysanka: as now.
- Each region: a regional quest with a story item, plus a song for the music box.
- Beating Baba Yaga: the hut walks off, the quiet houses light up, Ostap performs his duma about you (an ending scene and credits), and you get the Golden Pysanka.
- Catching all 1,000 words: the title Кобзар and Ostap's bandura.
- Mastering all 1,000: a final scene with every keeper at the Kupala fire.

## Phases
1. Foundation: assign the words to themes (data/words.json zones 0–24), 25-zone constants, the HUD counter, a fresh save key, the world map overlay.
2. Zaporizhzhia and Kyiv (4 locations): maps, keepers, NPCs, one quest each. **Done 2026-10-12** (src/far.js, src/rapids.js;
   tests in tools/tests: `python3 tools/tests/play.py tools/tests/kyiv.js`). Music for them is still borrowed from home tunes.
3. Polissia and the Carpathians (6 locations). **Done 2026-10-12** (src/north.js, src/mountains.js; tests: polissia.js,
   mountains.js, and reach.js, which checks every place for exits, doors and people you can't get to). Music still borrowed.
4. Podillia, the Black Sea and Lviv (6 locations). **Done 2026-10-13** (src/podillia.js, src/sea.js, src/lviv.js; tests: podillia.js,
   sea.js, lviv.js). Music still borrowed.
4½. The narrative pass (2026-10-13 evening). **Done.** Story plan in ../local/STORY.md (spoilers, kept out of the repo). A grammar spine: every region's quest drills
   one Ukr-101 point by choosing between forms of one word (cases, tenses, aspect, agreement, numbers). Twenty cross-country errands
   (src/errands.js), the road rushnyk, threads for Phase 5 (tato, the Hrytsenkos, Lukash and Mavka, nobody tells Yaga's tale),
   Лісова пісня and Тіні забутих предків. Pure Ukrainian pass. Tests: grammar.js, errands.js, music.js.
5. Endgame and rewards. **Done 2026-10-13** (src/finale.js; test finale.js). With 25 pysanky: turn the hut with the old formula
   (tar pot, castle key), the friends rung from Lviv and the bell, shell and rushnyk each lower what you need, one grammar question
   from every place (21), a 15-word trial, then her own tale, the homecoming (tato, the Hrytsenkos, Mavka), Ostap's duma built from
   your save, a summary and credits. After it: tell her tale again, hear the duma again, tato at home. Also Church Slavonic:
   every lectern has a Gospel verse and three words for the ЦЕРКВА page (src/church.js). Ready for beta testing.
   Playtest codes on the title screen: HOPAK (15 pysanky, the horseshoe, the map) and YAGA (all 25, at the finale).

## Notes
- Folk tunes: write the traditional (public-domain) melodies with tools/music.py, or convert MIDI exports with tools/midi.py.
  Don't copy MuseScore arrangements. Since the narrative pass, every region has its own tune: traditional Ukrainian dance melodies
  from Orest Lechnowsky's ABC transcriptions (tools/tunes/, converted by tools/abc.py, which writes its own bass from the melody):
  Від Києва до Лубен (Kyiv), Коломийка, Аркан, Опришки, Чумак, Коваль, Метелиця, Кучерява Катерина and others.
  «Як тебе не любити, Києве мій» (Shamo, 1962) is under copyright until about 2060, so Kyiv plays Від Києва до Лубен.
- Ukrainian lines are written for a boy. Add a boy/girl choice on the name screen.
- pisni.org.ua only gives MIDI files to logged-in users: download them by hand into a folder, then convert with tools/music.py.
