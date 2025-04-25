from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    api_key=os.environ.get("GEMINI_API_KEY"),
)

app = FastAPI()

# Enable CORS for local frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class CodeRequest(BaseModel):
    selected_code: str
    prompt: str


@app.post("/suggest")
async def suggest_code(data: CodeRequest):
    system_message = "You are a code improvement expert. A game developer will provide you with code and a prompt describing the desired change. You will suggest improved code with a clear explanation of the changes, also make sure to add a headline of Improved Code before providing the code and Explanation of Changes and Improvents before providing the explanation details."
    user_message = f"Code:\n{data.selected_code}\n\Prompt:\n{data.prompt}"
    reply = ""

    try:
        model = "gemini-2.0-flash"
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=system_message + "\n\n" + user_message),
                ],
            ),
        ]
        generate_content_config = types.GenerateContentConfig(
            response_mime_type="text/plain",
        )

        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            response = chunk.text
            reply = reply + response
        return {"suggested_code": reply}
    except Exception as e:
        return {"error": str(e)}
