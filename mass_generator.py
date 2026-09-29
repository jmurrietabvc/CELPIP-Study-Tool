import os
import json
import asyncio
import time
import subprocess
import random
from dotenv import load_dotenv
from google import genai
from google.genai import types
import edge_tts
import re

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)
VOICES = ['en-CA-LiamNeural', 'en-CA-ClaraNeural', 'en-US-ChristopherNeural', 'en-US-EricNeural', 'en-US-MichelleNeural', 'en-GB-RyanNeural']

MODEL_NAME = 'gemini-2.5-flash' 
TOTAL_TESTS = 63 

# Focused strictly on the user's requested domains, elevated to CLB 12 complexity
TOPICS = [
    # Educación
    "Pedagogical paradigms and neurodevelopment in early childhood education",
    "The socioeconomic impacts of decentralized digital learning platforms",
    "Cognitive load theory in modern curriculum design",
    
    # Transporte
    "Urban logistics and the physics of magnetic levitation (Maglev) transit",
    "Supply chain bottlenecks in global maritime shipping regulations",
    "The infrastructure challenges of transitioning to autonomous electric fleets",
    
    # Historia
    "The socio-political collapse of the late Bronze Age civilizations",
    "Historiography of the Industrial Revolution's impact on agrarian societies",
    "Economic shifts during the Renaissance and the rise of modern banking",
    
    # Naturaleza
    "Symbiotic mycelial networks and resource sharing in old-growth forests",
    "The cascading ecological effects of apex predator removal in marine biomes",
    "Epigenetic adaptation of flora in extreme drought conditions",
    
    # Leyes
    "Jurisdictional ambiguities in international cybercrime and data sovereignty",
    "The ethical implications of copyrighting artificially generated intellectual property",
    "Antitrust laws and the regulation of modern digital monopolies",
    
    # Tecnología
    "Quantum entanglement applications in secure telecommunications",
    "Algorithmic bias and ethical considerations in predictive policing software",
    "The integration of brain-computer interfaces in neuro-prosthetics"
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
            return json.loads(response.text)
        except Exception as e:
            print(f"Error calling API: {e}")
            time.sleep(20)
    return None

async def generate_single_reading_test(part_num):
    topic = random.choice(TOPICS)
    print(f"Generating Reading Part {part_num} on {topic}...")
    prompt = f"""
    You are an expert CELPIP examiner crafting a test that guarantees NO REPETITION and MAXIMUM CLB 12 difficulty.
    Generate an extreme CLB 12 difficulty Reading Practice Test for Part {part_num}.
    The core topic MUST be strictly about: {topic}. 
    Use highly advanced C2-level academic vocabulary, complex syntax, and deeply inferential questions.
    
    If Part 1: "Reading Correspondence" (A highly technical or formal email thread).
    If Part 2: "Reading to Apply a Diagram" (Include an ASCII table diagram in the passage, and an email discussing it).
    If Part 3: "Reading for Information" (An encyclopedic, dense text).
    If Part 4: "Reading for Viewpoints" (An op-ed with two heavily contrasting academic viewpoints).
    
    Output exactly in this JSON format:
    {{
      "title": "CLB 12 Reading: Part {part_num} - {topic}",
      "passage": "[The complex text, use \\n for newlines]",
      "questions": [
        {{ "text": "[Question]", "options": ["[A]", "[B]", "[C]", "[D]"], "correctAnswerIndex": 0 }}
      ]
    }}
    Include 5 extremely difficult questions.
    """
    return generate_content_with_retry(prompt)

async def generate_single_listening_test(part_num, global_index):
    topic = random.choice(TOPICS)
    print(f"Generating Listening Part {part_num} on {topic}...")
    prompt = f"""
    You are an expert CELPIP examiner crafting a test that guarantees NO REPETITION and MAXIMUM CLB 12 difficulty.
    Generate an extreme CLB 12 difficulty Listening Practice Test for Part {part_num}.
    The core topic MUST be strictly about: {topic}.
    Use highly advanced C2-level spoken vocabulary, nuanced arguments, and distractors.
    
    If Part 1: "Listening to Problem Solving" (A high-stakes professional dialogue).
    If Part 2: "Listening to a Daily Life Conversation" (An extremely dense logistical dialogue).
    If Part 3: "Listening for Information" (An expert lecture).
    If Part 4: "Listening to a News Item" (A rapid-fire, complex news broadcast).
    If Part 5: "Listening to a Discussion" (3 experts arguing about the topic, prefix with names like 'John:', 'Sarah:', 'Mark:').
    If Part 6: "Listening to Viewpoints" (A deep socio-economic analysis).
    
    Output exactly in this JSON format:
    {{
      "title": "CLB 12 Listening: Part {part_num} - {topic}",
      "transcript": "[If multiple speakers, strictly prefix with 'Name: ', e.g. 'John: Hello.\\nSarah: Hi.']",
      "questions": [
        {{ "text": "[Question]", "options": ["[A]", "[B]", "[C]", "[D]"], "correctAnswerIndex": 0 }}
      ]
    }}
    Include 5 extremely difficult questions.
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
    print(f"Starting Quality Factory for {TOTAL_TESTS} tests on requested topics.")
    
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
        
        if (i + 1) % 2 == 0:
            print("Committing batch to GitHub...")
            subprocess.run(['git', 'add', '.'], check=False)
            subprocess.run(['git', 'commit', '-m', f'Auto-generate targeted batch {i+1} of {TOTAL_TESTS}'], check=False)
            subprocess.run(['git', 'push'], check=False)
            
        print(f"Progress: {i+1} / {TOTAL_TESTS} completed.")

if __name__ == "__main__":
    asyncio.run(main())
