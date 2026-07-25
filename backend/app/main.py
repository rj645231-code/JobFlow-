from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
from app.config import settings
from app.api.v1.router import api_router
from app.core.exceptions import JobFlowException, NotFoundError, UnauthorizedError, ValidationError, DuplicateError

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create upload directory
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    yield
    # Shutdown

app = FastAPI(
    title="JobFlow API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(NotFoundError)
async def not_found_exception_handler(request: Request, exc: NotFoundError):
    return JSONResponse(status_code=404, content={"message": exc.message})

@app.exception_handler(UnauthorizedError)
async def unauthorized_exception_handler(request: Request, exc: UnauthorizedError):
    return JSONResponse(status_code=401, content={"message": exc.message})

@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(status_code=400, content={"message": exc.message})

@app.exception_handler(DuplicateError)
async def duplicate_exception_handler(request: Request, exc: DuplicateError):
    return JSONResponse(status_code=409, content={"message": exc.message})

@app.exception_handler(JobFlowException)
async def jobflow_exception_handler(request: Request, exc: JobFlowException):
    return JSONResponse(status_code=500, content={"message": exc.message})

app.include_router(api_router, prefix="/api/v1")

@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok"}
