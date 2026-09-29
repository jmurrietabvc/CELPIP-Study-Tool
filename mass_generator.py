import os
import json
import asyncio
import time
import subprocess
import random
import sys
from dotenv import load_dotenv
from google import genai
from google.genai import types
import edge_tts
import re

# Force unbuffered output so we can see print statements in the log
sys.stdout.reconfigure(line_buffering=True)

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)
VOICES = ['en-CA-LiamNeural', 'en-CA-ClaraNeural', 'en-US-ChristopherNeural', 'en-US-EricNeural', 'en-US-MichelleNeural', 'en-GB-RyanNeural']

MODEL_NAME = 'gemini-2.5-flash' 
TOTAL_TESTS = 63 

# Everyday Canadian topics that appear in CELPIP
TOPICS = [
    # Educación
    "Registering a child for public school and discussing curriculum",
    "Applying for a university scholarship and navigating the admissions portal",
    "A dispute with a professor about a graded assignment",
    
    # Transporte
    "Complaining to the city about a new toll bridge",
    "Discussing the lack of bike lanes in a downtown neighborhood",
    "A conversation with a mechanic about a surprisingly expensive car repair",
    "Navigating public transit delays during a snowstorm",
    
    # Historia / Municipal
    "A debate at a city council meeting about preserving an old historical building",
    "A local museum's new exhibit on early Canadian settlers",
    "Discussing the legacy of a former mayor who changed the city's zoning laws",
    
    # Naturaleza / Medio Ambiente
    "A community initiative to clean up a local park and plant trees",
    "Discussing a new city bylaw about mandatory composting and recycling",
    "A news report on bears wandering into suburban neighborhoods",
    
    # Leyes / Vida Cívica
    "A dispute with a landlord over returning a security deposit",
    "Discussing a new noise bylaw that affects local businesses",
    "Receiving a parking ticket and trying to appeal it at city hall",
    
    # Tecnología / Trabajo
    "A conversation with IT support about a broken office laptop",
    "Discussing the implementation of a new work-from-home policy",
    "A news item about a local tech startup bringing jobs to the city"
]

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
        if os.path.exists(out_file): os.remove(out_file)
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
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            time.sleep(6) 
            try:
                # Validate JSON
                parsed = json.loads(response.text)
                return parsed
            except Exception as json_e:
                print(f"JSON Parsing Error on attempt {attempt+1}: {json_e}")
                time.sleep(5)
                continue
        except Exception as e:
            print(f"API Error calling Gemini (attempt {attempt+1}): {e}")
            time.sleep(20)
    print("FAILED to generate valid content after 3 retries.")
    return None

async def generate_single_reading_test(part_num):
    topic = random.choice(TOPICS)
    print(f"Generating Reading Part {part_num} on {topic}...")
    prompt = f"""
    You are an expert CELPIP examiner. Generate a CLB 12 difficulty Reading Practice Test for Part {part_num}.
    The topic must be about everyday Canadian life: "{topic}". 
    Do NOT use extreme sci-fi or overly obscure science topics. Make it highly realistic to the actual CELPIP exam, but use complex vocabulary (CLB 10-12 level) and nuanced inferential questions.
    
    If Part 1: "Reading Correspondence" (An email).
    If Part 2: "Reading to Apply a Diagram" (Include an ASCII table diagram in the passage, and an email discussing it).
    If Part 3: "Reading for Information" (An informative article).
    If Part 4: "Reading for Viewpoints" (An article with two contrasting opinions).
    
    Output exactly in this JSON format:
    {{
      "title": "CLB 12 Reading: Part {part_num} - Everyday Topic",
      "passage": "[The text, use \\n for newlines]",
      "questions": [
        {{ "text": "[Question]", "options": ["[A]", "[B]", "[C]", "[D]"], "correctAnswerIndex": 0 }}
      ]
    }}
    Include 5 difficult questions.
    """
    return generate_content_with_retry(prompt)

async def generate_single_listening_test(part_num, global_index):
    topic = random.choice(TOPICS)
    print(f"Generating Listening Part {part_num} on {topic}...")
    prompt = f"""
    You are an expert CELPIP examiner. Generate a CLB 12 difficulty Listening Practice Test for Part {part_num}.
    The topic must be about everyday Canadian life: "{topic}".
    Make it highly realistic to the actual CELPIP exam, but use complex vocabulary (CLB 10-12 level) and nuanced arguments.
    
    If Part 1: "Listening to Problem Solving" (A dialogue between two people).
    If Part 2: "Listening to a Daily Life Conversation" (A dialogue between two people).
    If Part 3: "Listening for Information" (A presentation or dialogue).
    If Part 4: "Listening to a News Item" (A single news anchor).
    If Part 5: "Listening to a Discussion" (3 people arguing, prefix with names like 'John:', 'Sarah:', 'Mark:').
    If Part 6: "Listening to Viewpoints" (A single speaker).
    
    Output exactly in this JSON format:
    {{
      "title": "CLB 12 Listening: Part {part_num} - Everyday Topic",
      "transcript": "[If multiple speakers, strictly prefix with 'Name: ', e.g. 'John: Hello.\\nSarah: Hi.']",
      "questions": [
        {{ "text": "[Question]", "options": ["[A]", "[B]", "[C]", "[D]"], "correctAnswerIndex": 0 }}
      ]
    }}
    Include 5 difficult questions.
    """
    test_json = generate_content_with_retry(prompt)
    if test_json and 'transcript' in test_json:
        audio_url = await generate_listening_audio(test_json['transcript'], global_index)
        if audio_url:
            test_json['audioUrl'] = audio_url
    return test_json

async def main():
    rData = load_data('celpip_reading.json', [])
    lData = load_data('celpip_listening.json', [])
    print(f"Starting Realistic Factory for {TOTAL_TESTS} tests on standard CELPIP topics.")
    
    for i in range(TOTAL_TESTS):
        r_part = (len(rData) % 4) + 1
        l_part = (len(lData) % 6) + 1
        
        r_test = await generate_single_reading_test(r_part)
        if r_test:
            rData.append(r_test)
            save_data('celpip_reading.json', rData)
            
        l_test = await generate_single_listening_test(l_part, len(lData))
        if l_test:
            lData.append(l_test)
            save_data('celpip_listening.json', lData)
            
        update_js(rData, lData)
        
        if (i + 1) % 1 == 0: # Push every single successful iteration now just to be safe
            print("Committing to GitHub...")
            subprocess.run(['git', 'add', '.'], check=False)
            subprocess.run(['git', 'commit', '-m', f'Auto-generate realistic batch {i+1} of {TOTAL_TESTS}'], check=False)
            subprocess.run(['git', 'push'], check=False)
            
        print(f"Progress: {i+1} / {TOTAL_TESTS} completed.")

if __name__ == "__main__":
    asyncio.run(main())
