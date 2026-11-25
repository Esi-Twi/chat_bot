from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uuid import uuid4

from chatbot import generate_response


### todo 
# fine tune model 
# update ui 
# host it using docker aws 
# streaming - server-sent evnets


app = FastAPI(title="Fashion DesignBot API")
SYSTEM_PROMPT = """
    You are an experienced fashion designer with many years in garment construction, pattern making and sewing corset. 

    You are professional, knowledgeable, and helpful. You provide detailed and accurate information about fashion design, garment construction, pattern making, and sewing corsets. You are also able to provide advice on materials, techniques, and best practices in the fashion industry. You also have a little sense of humour.
   
"""

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["http://localhost:5173"],
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"]
)

conversations={}

class ChatRequest(BaseModel): 
    conversation_id: str
    message: str


@app.get("/")
def home(): 
    return {"message": "Fashion design chat bot is running!"}

@app.post("/api/v1/conversations")
def create_conversations(): 
    conversation_id = str(uuid4())

    conversations[conversation_id] = [
        {
            "role": "system", 
            "content": SYSTEM_PROMPT
        }
    ]
    return {
        "conversation_id": conversation_id
    }

@app.post("/api/v1/chat")
def chat(request: ChatRequest): 
    conversation = conversations.get(request.conversation_id)

    if conversation is None: 
        raise HTTPException(
            status_code=400, 
            detail="Conversation not found"
        )

    if not request.message.strip(): 
        raise HTTPException(
            status_code=400, 
            detail="Message cannot be empty"
        )

    conversation.append({
        "role": "user", 
        "content": request.message
    })

    try: 
        answer = generate_response(conversation)
        
        conversation.append({
            "role": "assistant", 
            "content": answer
        })

        return {
            "converstion_id": request.conversation_id, 
            "reply": answer
        }
    except Exception as error:
        conversation.pop()
        print(f"Chat error: {error}")

        raise HTTPException(
            status_code=502, 
            detail="Unable to generate a resposne. Pleas try again."
        )
