import json
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
import uvicorn
from mangum import Mangum
from security_analyzer import analyze_github_repo
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Specify domains you want to allow
    allow_credentials=True,
    allow_methods=["*"],  # Specify HTTP methods to allow
    allow_headers=["*"],
)


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.post("/generate-report/")
async def process_link(request: Request):
    # Read JSON body from the request
    body = await request.json()

    # Extract the "url" key
    reportId = body.get("reportId")
    link = body.get("url")
    analysis_type = body.get("analysisType")

    print(f"Link: {link}")

    if not link:
        return JSONResponse(
            content={"error": "URL key is missing"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    # Analyze the GitHub repository and get the result
    result = analyze_github_repo(link, reportId, analysis_type)

    # Return the result as JSON response with 200 OK status code
    return JSONResponse(content=result, status_code=status.HTTP_200_OK)


handler = Mangum(app)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
