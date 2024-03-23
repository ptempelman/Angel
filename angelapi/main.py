import json
from fastapi import FastAPI
import uvicorn
from mangum import Mangum

app = FastAPI()


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/endpoint")
async def train_model():
    return {"message": "whatever"}


handler = Mangum(app)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)