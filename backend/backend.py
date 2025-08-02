import pandas as pd
import numpy as np
import faiss
import pickle
from sentence_transformers import SentenceTransformer
from transformers import pipeline
import re
import sys

embedding_model = SentenceTransformer("intfloat/e5-base") 

# Zero-shot classifier to categorize into dataset category
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Categories and their descriptions
category_labels = {
    "asana_benefits": "Yoga asanas and postures with benefits and contradictions",
    "condition_based": "Diet and nutrition recommendations for specific health conditions",
    "profession_tips": "Health and fitness tips for different professions",
    "general_health": "General wellness tips like sleep, hydration, vitamins, and lifestyle"
}

# Initialize storage dicts
category_indexes = {}
category_data = {}
def faiss_index(category_name):
    index = faiss.read_index(f"{category_name}.index")
    with open(f"{category_name}_data.pkl", "rb") as f:
        texts = pickle.load(f)
    category_indexes[category_name] = index
    category_data[category_name] = texts

# Load saved indexes and text data
faiss_index("general_health")
faiss_index("profession_tips")
faiss_index("condition_based")
faiss_index("condition_based_diet")
faiss_index("asana_benefits")

# -------------------- Category Detection --------------------
def detect_category(query):
    result = classifier(query, list(category_labels.values()))
    best_match_label = result['labels'][0]
    for key, desc in category_labels.items() or "general-health":
        if desc == best_match_label:
            return key
    return "general_health"

    diet_keywords = ["diet", "food", "nutrition", "meal", "eat", "eating"]
    if any(word in query.lower() for word in diet_keywords):
        return "condition_based_diet"



# -------------------- Extract Best Sentence --------------------
def extract_best_sentence(passage, query):
    sentences = re.split(r'[.?!]', passage)
    best_score = -1
    best_sent = ""
    for sent in sentences:
        sent = sent.strip()
        if sent:
            score = embedding_model.encode([sent, query], convert_to_numpy=True)
            similarity = -np.linalg.norm(score[0] - score[1])
            if similarity > best_score:
                best_score = similarity
                best_sent = sent
    return best_sent

# -------------------- Get Response from FAISS --------------------


# -------------------- Chat Interface --------------------

def get_response(user_query, top_k=3):
    category = detect_category(user_query)
    print(f"\n Detected Category: {category.replace('_', ' ').title()}")

    query_vector = embedding_model.encode(user_query).reshape(1, -1)
    index = category_indexes.get(category)
    docs = category_data.get(category)

    if index is None or docs is None:
        return "No index found for the detected category."

    distances, indices = index.search(query_vector, top_k)
    top_docs = [docs[i] for i in indices[0] if i < len(docs)]

    if not top_docs:
        return "No relevant information found."

    formatted_docs = []

    for doc in top_docs:

        lines = doc.split("\n")
        condition_line = next((line for line in lines if "Condition:" in line), "")

        def extract_lines(keyword):
            extracted_lines = [line.replace(f"{keyword}:", "").strip() for line in lines if keyword in line]
            extracted_lines = [tip.strip() for line in extracted_lines for tip in line.split("\n")]
            return extracted_lines

        diet_lines = extract_lines("Diet")
        activity_lines = extract_lines("Activities")
        asana_lines = extract_lines("Asanas")
        general_tips_lines = extract_lines("General Tips")
        profession_tips_lines = extract_lines("Profession Tips")

        # Response
        response_text = condition_line
        if category=='profession_tips' or category =='asana_benefits' or category == 'general_health':
            print("\n Processing Document:\n", doc)

        # If query includes other specific keywords, return only those
        if category == 'condition_based_diet':
            response_text += "\nDiet:\n" + "\n".join(diet_lines) if diet_lines else "No diet tips found."

        if category == 'condition_based':
            response_text += "\nActivities:\n" + "\n".join(activity_lines) if activity_lines else "No activities found."
        else:
            # Default: return everything
            response_text += "\nDiet:\n" + "\n".join(diet_lines) if diet_lines else ""
            response_text += "\nActivities:\n" + "\n".join(activity_lines) if activity_lines else ""

        formatted_docs.append(response_text)

    return "\n\n".join(formatted_docs)

if __name__ == "__main__":
    print("\n Welcome to Yoga Recommendation CLI ")
    prompt = sys.argv[1] 
    response = get_response(prompt)
    print(f"\n Chatbot:\n{response}\n")
