import os
import json
import asyncio
import time
import subprocess
from dotenv import load_dotenv
from google import genai
from google.genai import types
import edge_tts
import re

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)
VOICES = ['en-CA-LiamNeural', 'en-CA-ClaraNeural', 'en-US-ChristopherNeural', 'en-US-EricNeural', 'en-US-MichelleNeural', 'en-GB-RyanNeural']

# We will use flash to save tokens and avoid quota limits quickly
MODEL_NAME = 'gemini-2.5-flash' 

# The user wants 150 tests. We will generate them in batches and push to git periodically.
TOTAL_TESTS = 150

def load_data(filename, default):
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            return json.load(f)
    return default

def save_data(filename, data):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

def update_js(reading_data, listening_data):
    with open('celpip_data.js', 'w', encoding='utf-8') as jf:
        jf.write(f"const readingData = {json.dumps(reading_data)};\nconst listeningData = {json.dumps(listening_data)};")

async def generate_listening_audio(transcript, index):
    lines = re.sub(r'\[.*?\]', '', transcript).strip().split('\n')
    segments = []
    speaker_map = {}
    voice_idx = 0
    
    os.makedirs('audio', exist_ok=True)
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line: continue
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
            voice = 'en-CA-LiamNeural'
            
        seg_file = f"audio/temp_{index}_{i}.mp3"
        communicate = edge_tts.Communicate(text, voice, rate="+5%")
        await communicate.save(seg_file)
        segments.append(seg_file)
        
    if segments:
        list_file = f"audio/list_{index}.txt"
        with open(list_file, "w", encoding='utf-8') as f:
            for seg in segments:
                f.write(f"file '{os.path.basename(seg)}'\n")
                
        out_file = f"audio/audio_{index}.mp3"
        if os.path.exists(out_file):
            os.remove(out_file)
        subprocess.run(['ffmpeg', '-f', 'concat', '-safe', '0', '-i', list_file, '-c', 'copy', out_file], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        for seg in segments: os.remove(seg)
        os.remove(list_file)
        return out_file
    return None

def generate_content_with_retry(prompt):
    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                )
            )
            time.sleep(5) # Respect 15 RPM free tier
            return json.loads(response.text)
        except Exception as e:
            print(f"Error calling API (attempt {attempt+1}): {e}")
            time.sleep(15) # Wait longer on error
    return None

async def generate_single_reading_test(part_num):
    print(f"Generating Reading Part {part_num}...")
    prompt = f"""
    You are an expert CELPIP examiner. Generate an extreme CLB 12 difficulty Reading Practice Test for Part {part_num}.
    If Part 1: "Reading Correspondence".
    If Part 2: "Reading to Apply a Diagram" (use an ASCII table for the diagram).
    If Part 3: "Reading for Information".
    If Part 4: "Reading for Viewpoints".
    
    Output exactly in this JSON format:
    {{
      "title": "CLB 12 Reading: Part {part_num}: [Name of part]",
      "passage": "[The extremely complex text, use \\n for newlines]",
      "questions": [
        {{ "text": "[Question]", "options": ["[A]", "[B]", "[C]", "[D]"], "correctAnswerIndex": 0 }}
      ]
    }}
    Make sure to include 5 questions.
    """
    return generate_content_with_retry(prompt)

async def generate_single_listening_test(part_num, global_index):
    print(f"Generating Listening Part {part_num}...")
    prompt = f"""
    You are an expert CELPIP examiner. Generate an extreme CLB 12 difficulty Listening Practice Test for Part {part_num}.
    If Part 1: "Listening to Problem Solving" (Dialogue).
    If Part 2: "Listening to a Daily Life Conversation" (Dialogue).
    If Part 3: "Listening for Information" (Dialogue or single speaker).
    If Part 4: "Listening to a News Item" (Single speaker).
    If Part 5: "Listening to a Discussion" (3 speakers).
    If Part 6: "Listening to Viewpoints" (Single speaker).
    
    Output exactly in this JSON format:
    {{
      "title": "CLB 12 Listening: Part {part_num}: [Name of part]",
      "transcript": "[If multiple speakers, prefix with 'Name: ', e.g. 'John: Hello.\\nSarah: Hi.']",
      "questions": [
        {{ "text": "[Question]", "options": ["[A]", "[B]", "[C]", "[D]"], "correctAnswerIndex": 0 }}
      ]
    }}
    Make sure to include 5 questions.
    """
    test_json = generate_content_with_retry(prompt)
    if test_json and 'transcript' in test_json:
        # Generate the MP3
        print(f"Generating audio for Listening Part {part_num}...")
        audio_url = await generate_listening_audio(test_json['transcript'], global_index)
        if audio_url:
            test_json['audioUrl'] = audio_url
    return test_json

async def main():
    rData = load_data('celpip_reading.json', [])
    lData = load_data('celpip_listening.json', [])
    
    start_r = len(rData)
    start_l = len(lData)
    
    print(f"Starting factory. Currently have {start_r} Reading and {start_l} Listening tests.")
    
    # Generate in small batches and push to git
    for i in range(TOTAL_TESTS):
        # We will cycle through Reading parts 1-4 and Listening parts 1-6
        r_part = (len(rData) % 4) + 1
        l_part = (len(lData) % 6) + 1
        
        # 1. Generate one Reading test
        r_test = await generate_single_reading_test(r_part)
        if r_test:
            rData.append(r_test)
            save_data('celpip_reading.json', rData)
            
        # 2. Generate one Listening test
        l_test = await generate_single_listening_test(l_part, len(lData))
        if l_test:
            lData.append(l_test)
            save_data('celpip_listening.json', lData)
            
        update_js(rData, lData)
        
        # Commit every 5 tests to save progress on Github
        if (i + 1) % 5 == 0:
            print("Committing batch to GitHub...")
            subprocess.run(['git', 'add', '.'], check=False)
            subprocess.run(['git', 'commit', '-m', f'Auto-generate batch {i+1} of 150'], check=False)
            subprocess.run(['git', 'push'], check=False)
            
        print(f"Progress: {i+1} / 150 completed.")

if __name__ == "__main__":
    asyncio.run(main())
