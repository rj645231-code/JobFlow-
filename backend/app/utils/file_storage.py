import aiofiles
import os
from app.config import settings

async def save_file(file_content: bytes, filename: str) -> str:
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    async with aiofiles.open(file_path, 'wb') as out_file:
        await out_file.write(file_content)
    return file_path

async def delete_file(file_path: str) -> None:
    if os.path.exists(file_path):
        os.remove(file_path)
