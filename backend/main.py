from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class JobPage(BaseModel):
    url: str
    title: str
    content: str


@app.get("/")
def home():
    return {
        "message": "JobTracker API is running"
    }


@app.post("/extract-job")
def extract_job(page: JobPage):

    return {
        "title": page.title,
        "company": "Unknown",
        "location": "Unknown",
        "employment_type": "Unknown",
        "url": page.url
    }