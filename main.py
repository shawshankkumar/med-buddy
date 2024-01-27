import io
from fastapi import FastAPI, File, UploadFile, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import ulid
import boto3
from util import check_validation 

app = FastAPI()

bucket_name = 'shashank'
s3 = boto3.client(
    "s3",
    endpoint_url="https://61837c45dfc997b1a932f4b2116d93ae.r2.cloudflarestorage.com",
    aws_access_key_id="8d1d7da927b6a897dd462fe69b46954e",
    aws_secret_access_key="b5cfdb89b62166644f07df75f8b5e14c8a22f40ae5de2319a4cc9ee133b9551a",
    region_name="auto",
)

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
    return { "message" : "index route of med buddy (/)" }


@app.post("/upload")
async def upload(request: Request, file: UploadFile = File(...)):
    user_id = request.headers.get('Authorization')
    if(not check_validation(user_id)):
        return JSONResponse(status_code = 401, content = {"message": "Auth headers are required"})
    content = await file.read()
    file_key = 'file_' + str(ulid.new())
    s3.upload_fileobj(io.BytesIO(content), bucket_name, user_id + '/' + file_key)
    return {"message": "File uploaded", "code": file_key}
