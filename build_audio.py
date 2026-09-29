import json
import re
import os
import subprocess
import asyncio
import edge_tts

# Load listening tests
with open('celpip_listening.json', 'r', encoding='utf-8') as f:
    tests = json.load(f)

# Define voices for mapping
VOICES = ['en-CA-LiamNeural', 'en-CA-ClaraNeural', 'en-US-ChristopherNeural', 'en-US-EricNeural', 'en-US-MichelleNeural', 'en-GB-RyanNeural']

async def generate_segment(text, voice, filename):
    communicate = edge_tts.Communicate(text, voice, rate="+5%")
    await communicate.save(filename)

async def process_test(index, test):
    print(f"Processing Test {index}...")
    transcript = test.get('transcript', '')
    
    # Remove bracketed intro
    transcript = re.sub(r'\[.*?\]', '', transcript).strip()
    
    # Split by lines
    lines = transcript.split('\n')
    
    segments = []
    speaker_map = {}
    voice_idx = 0
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
            
        # Match speaker
        match = re.match(r'^([A-Za-z]+):\s*(.*)', line)
        if match:
            speaker = match.group(1)
            text = match.group(2)
            if speaker not in speaker_map:
                speaker_map[speaker] = VOICES[voice_idx % len(VOICES)]
                voice_idx += 1
            voice = speaker_map[speaker]
        else:
            text = line
            voice = 'en-CA-LiamNeural' # Default narrator
            
        seg_file = f"temp_{index}_{i}.mp3"
        await generate_segment(text, voice, seg_file)
        segments.append(seg_file)
        
    # Concatenate using ffmpeg
    if segments:
        with open(f"list_{index}.txt", "w", encoding='utf-8') as f:
            for seg in segments:
                f.write(f"file '{seg}'\n")
                
        out_file = f"audio_{index}.mp3"
        if os.path.exists(out_file):
            os.remove(out_file)
            
        subprocess.run(['ffmpeg', '-f', 'concat', '-safe', '0', '-i', f"list_{index}.txt", '-c', 'copy', out_file], check=True)
        
        # Cleanup temp
        for seg in segments:
            os.remove(seg)
        os.remove(f"list_{index}.txt")
        
        # Update test JSON
        test['audioUrl'] = out_file
        print(f"Finished generating {out_file}")

async def main():
    for i, test in enumerate(tests):
        await process_test(i, test)
        
    with open('celpip_listening.json', 'w', encoding='utf-8') as f:
        json.dump(tests, f, indent=2)
        
    # Also update celpip_data.js
    with open('celpip_reading.json', 'r', encoding='utf-8') as rf:
        reading_data = json.load(rf)
    with open('celpip_data.js', 'w', encoding='utf-8') as jf:
        jf.write(f"const readingData = {json.dumps(reading_data)};\nconst listeningData = {json.dumps(tests)};")

if __name__ == "__main__":
    asyncio.run(main())
