from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

global_time = time.time()


@app.get("/health", tags=["health"])
def health_check():
    return {
        "status": "ok",
        "message": "med-buddy is running",
        "application_name": "med buddy",
        "uptime_in_seconds": time.time() - global_time,
    }


@app.get("/")
async def root():
    return {"message": "Index Route (/)"}
