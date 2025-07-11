import pandas as pd
import numpy as np
import spacy
import faiss
import torch
import random
import pickle
from sentence_transformers import SentenceTransformer
from transformers import AutoModel, AutoTokenizer
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime, timedelta
import sys
from plyer import notification
import time
import json
import os

# ------------------ Load Embedding Model ------------------
embedding_model_name = "intfloat/e5-base"
embedding_tokenizer = AutoTokenizer.from_pretrained(embedding_model_name)
embedding_model = AutoModel.from_pretrained(embedding_model_name)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
embedding_model = AutoModel.from_pretrained(embedding_model_name).to(device)


def get_embedding(text):
    inputs = embedding_tokenizer(text, return_tensors="pt", padding=True, truncation=True).to(device)
    with torch.no_grad():
        embeddings = embedding_model(**inputs).last_hidden_state.mean(dim=1)
    return embeddings[0].cpu().numpy()

# ------------------ Load Data ------------------
asana_df = pd.read_csv("new_yoga - Sheet1.csv", encoding='latin')
profession_df = pd.read_csv("health_profession.csv", encoding='latin')

# Prepare profession tips
# Prepare profession tips
profession_df["Health Tip"] = profession_df["Health Tip"].astype(str).str.split("\n")
profession_tips = profession_df.groupby("Profession")["Health Tip"].sum().to_dict()

# ------------------ Load Precomputed FAISS Index ------------------
faiss_index = faiss.read_index("asana_benefits.index")  # <- Replace with your path

with open("asana_benefits_data.pkl", "rb") as f:         # <- Replace with your path
    asana_embeddings = pickle.load(f)

# ------------------ Match Profession ------------------
nlp = spacy.load("en_core_web_md")
profession_list = list(profession_tips.keys())

def match_profession(user_input):
    user_vec = nlp(user_input).vector.reshape(1, -1)
    best_match = None
    best_score = 0
    for prof in profession_list:
        prof_vec = nlp(prof).vector.reshape(1, -1)
        score = cosine_similarity(user_vec, prof_vec)[0][0]
        if score > best_score:
            best_score = score
            best_match = prof
    return best_match

# ------------------ Asana Retrieval ------------------
def retrieve_asanas(query, top_k=3):
    query_embed = get_embedding(query).astype("float32").reshape(1, -1)
    D, I = faiss_index.search(query_embed, top_k)
    return asana_df.iloc[I[0]]

# ------------------ Daily Schedule ------------------
def generate_schedule(morning_mins, evening_mins, work_start, work_end, interval_mins, profession):
    schedule = []
    start_time = datetime.strptime(work_start, "%H:%M")
    end_time = datetime.strptime(work_end, "%H:%M")

    schedule.append(("Morning Yoga", f"{morning_mins} mins of yoga"))

    matched_prof = match_profession(profession)
    if matched_prof:
        current_time = start_time
        tips = profession_tips.get(matched_prof, ["Stretch and breathe"])
        tips_list = tips[0].split("\\n")
        tip_index = 0  # start from first tip
        while current_time < end_time:
            schedule.append((current_time.strftime("%H:%M"), tips_list[tip_index]))
            tip_index = (tip_index + 1) % len(tips_list)  # loop tips if time slots > tips
            current_time += timedelta(minutes=interval_mins)

    schedule.append(("Evening Yoga", f"{evening_mins} mins of yoga"))
    return schedule




# ------------------ CLI Execution ------------------
if __name__ == "__main__":
    
    profession = sys.argv[1] 
    condition = sys.argv[2] 
    goal = sys.argv[3]

    query = f"Yoga asanas for {condition} to achieve {goal}"
    recommended = retrieve_asanas(query)

    if recommended.empty:
        print("⚠️ No matching asanas found.")
    else:
        for _, row in recommended.iterrows():
            print(f"\nAsana: {row['asana']}")
            print(f"Description: {row['description']}")
            print(f"Precautions: {row['precautions']}")

    print("\nYour Daily Wellness Schedule:")
    schedule = generate_schedule(30, 20, "09:00", "17:00", 120, profession)
    for time_str, task in schedule:
        print(f"⏰ {time_str} ➝ {task}")
    output_schedule = [{"time": time_str, "task": task} for time_str, task in schedule]

# Save to JSON file
    react_schedule_path = os.path.join("..", "src", "schedule.json")  # Adjust path if needed

    # Create the directory if it doesn't exist
    os.makedirs(os.path.dirname(react_schedule_path), exist_ok=True)

    # Write the schedule file into the React src folder
    with open(react_schedule_path, "w") as f:
        json.dump(output_schedule, f, indent=4)








