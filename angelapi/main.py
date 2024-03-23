import json
from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
import uvicorn
from mangum import Mangum
from security_analyzer import analyze_github_repo
app = FastAPI()

@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.get("/endpoint")
async def process_link(link: str):
    print("link:",link) 
    # Analyze the GitHub repository and get the result
    result = analyze_github_repo(link)
    
    # Return the result as JSON response with 200 OK status code
    return JSONResponse(content=result, status_code=status.HTTP_200_OK)

handler = Mangum(app)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
