import json
from fastapi import FastAPI
import uvicorn
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Specify domains you want to allow
    allow_credentials=True,
    allow_methods=["*"],  # Specify HTTP methods to allow
    allow_headers=["*"],
)


@app.post("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/endpoint")
async def train_model():
    return {"message": "whatever"}


handler = Mangum(app)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
