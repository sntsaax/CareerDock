from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()

client = OpenAI()


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


class JobInfo(BaseModel):
    title: str
    company: str
    location: str
    employment_type: str


@app.get("/")
def home():
    return {
        "message": "JobTracker API is running"
    }


@app.post("/extract-job")
def extract_job(page: JobPage):

    response = client.responses.parse(
        model="gpt-6-luna",
        input=[
            {
                "role": "system",
                "content": (
                    "You extract structured information from job postings. "
                    "Return only information that can reasonably be determined "
                    "from the provided webpage. If a field cannot be found, "
                    "return 'Unknown'."
                )
            },
            {
                "role": "user",
                "content": (
                    f"URL: {page.url}\n\n"
                    f"Page title: {page.title}\n\n"
                    f"Page content:\n{page.content}"
                )
            }
        ],
        text_format=JobInfo,
    )

    job = response.output_parsed

    return {
        "title": job.title,
        "company": job.company,
        "location": job.location,
        "employment_type": job.employment_type,
        "url": page.url
    }