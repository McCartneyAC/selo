#!/usr/bin/env python3
"""Piper TTS for every word in the game. Resumable: one mp3 per text, named by a hash of the
text, written to a .tmp file and then renamed. Rerunning skips clips that already exist.

  python3 tools/puls/tts.py [shard k] [of n]

Text = the stressed form (uk_stressed, else uk). The voice was trained on stress-marked text (U+0301).
Voice: uk_UA-ukrainian_tts-medium, speaker lada (0). Output: local/puls_corpus/tts/<sha1[:16]>.wav (trimmed, mono 22.05 kHz);
the game build encodes mp3 from these masters.
"""
import csv, hashlib, io, os, re, subprocess, sys, time, wave
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, '..', 'local', 'puls_corpus', 'tts')
MODEL = os.path.join(ROOT, '..', 'local', 'piper', 'uk_UA-ukrainian_tts-medium.onnx')
SPEAKER = 0

def clip_name(text): return hashlib.sha1(text.encode('utf-8')).hexdigest()[:16] + '.wav'

def texts():
    """every word of every level, A1 first: exactly what tools/levels.py wrote to data/levels_tts.json"""
    import json
    said = json.load(open(os.path.join(ROOT, 'data', 'levels_tts.json'), encoding='utf-8'))
    return [t for L in ('A1', 'A2', 'B1', 'B2', 'C1') for t in said[L]]

def main():
    import onnxruntime as ort
    _IS = ort.InferenceSession
    def one_thread(path, sess_options=None, **kw):   # one thread per process; run one process per core instead
        so = sess_options or ort.SessionOptions(); so.intra_op_num_threads = 1; so.inter_op_num_threads = 1
        return _IS(path, sess_options=so, **kw)
    ort.InferenceSession = one_thread
    from piper import PiperVoice, SynthesisConfig
    os.makedirs(OUT, exist_ok=True)
    todo = [t for t in dict.fromkeys(texts()) if not os.path.exists(os.path.join(OUT, clip_name(t)))]
    # usage: tts.py [shard k] [of n]  -- run n processes, one per shard
    if len(sys.argv) > 2:
        k, n = int(sys.argv[1]), int(sys.argv[2])
        todo = [t for t in todo if int(hashlib.sha1(t.encode('utf-8')).hexdigest()[:8], 16) % n == k]
    print(f'{len(todo)} clips to make', flush=True)
    voice = PiperVoice.load(MODEL)
    cfg = SynthesisConfig(speaker_id=SPEAKER, length_scale=1.05)
    t0 = time.time()
    for n, text in enumerate(todo, 1):
        buf = io.BytesIO()
        with wave.open(buf, 'wb') as w: voice.synthesize_wav(text.lower().replace('’', "'").replace('ʼ', "'"), w, syn_config=cfg)   # the model knows only the ASCII apostrophe
        path = os.path.join(OUT, clip_name(text))
        wav = subprocess.run(['ffmpeg', '-loglevel', 'error', '-f', 'wav', '-i', 'pipe:0', '-af',
                              'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse',
                              '-ac', '1', '-ar', '22050', '-c:a', 'pcm_s16le', '-f', 'wav', 'pipe:1'],
                             input=buf.getvalue(), capture_output=True, check=True).stdout
        with open(path + '.tmp', 'wb') as f: f.write(wav)
        os.replace(path + '.tmp', path)
        if n % 100 == 0:
            rate = (time.time() - t0) / n
            print(f'{n}/{len(todo)}  {rate:.2f}s each, about {rate * (len(todo) - n) / 60:.0f} min left', flush=True)
    print('DONE', flush=True)

if __name__ == '__main__':
    main()
