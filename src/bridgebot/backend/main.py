from fastapi import FastAPI
from pydantic import BaseModel
import os
from openai import OpenAI

app = FastAPI()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ChatRequest(BaseModel):
    projectId: str
    message: str

SYSTEM_PROMPT = """
You are BridgeBot, an AI assistant for multidisciplinary engineering student teams.
You help with requirements, architecture, risks, and task planning.
Always answer in a clear, structured way with bullet points.
"""

@app.post("/chat")
def chat(req: ChatRequest):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": req.message}
        ]
    )
    return {"reply": completion.choices[0].message.content}
