import os 
from dotenv import load_dotenv
from groq import Groq
import tiktoken

load_dotenv()

api_key = os.getenv("API_KEY")
if not api_key: 
    raise ValueError("API_KEY not found in .env")
client = Groq(api_key = api_key)


MODEL ="openai/gpt-oss-20b"
TEMPERATURE = 0.7 
MAX_TOKENS = 1000
TOKEN_BUDGET = 100

def get_encoding(model): 
    try: 
        return tiktoken.encoding_for_model(model)
    except KeyError: 
        print(f"Warning: Tokenizer for model {model} not found. Falling back to cl100k_base.")
        return tiktoken.get_encoding("cl100k_base")

ENCODING = get_encoding(MODEL)

def count_token(text): 
    return len(ENCODING.encode(text))

def total_tokens_used(messages): 
    try: 
        return sum(count_token(msg["content"]) for msg in messages)
    except Exception as e: 
        print(f"Token count error: {e}")
        return 0


def enforce_token_budget(messages, budget=TOKEN_BUDGET):
    try: 
        while total_tokens_used(messages) > budget: 
            if len(messages) <= 2: 
                break 
            messages.pop(1)
    except Exception as e: 
        print(f"token budget error: {e}")

def generate_response(messages: list[dict]) -> str: 
    response = client.chat.completions.create(
        model=MODEL, 
        messages=messages, 
        temperature=TEMPERATURE, 
        max_tokens=MAX_TOKENS
    )
    
    reply = response.choices[0].message.content
    if not reply: 
        raise ValueError("The AI returned an empty response.")

    enforce_token_budget(messages)
    
    return reply




