from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# CV schemas
class CVPresignRequest(BaseModel):
    filename: str
    mime_type: str
    role_id: Optional[int] = None

class CVPresignResponse(BaseModel):
    url: str
    fields: dict

class CVConfirmRequest(BaseModel):
    filename: str  # Original filename
    storage_filename: str  # The filename generated during presign (from fields)
    role_id: Optional[int] = None
    size_bytes: int

class CVResponse(BaseModel):
    id: int
    user_id: int
    role_id: Optional[int]
    filename: str
    mime_type: str
    size_bytes: int
    storage_url: str
    status: str
    created_at: datetime

class CVDownloadResponse(BaseModel):
    download_url: str
    expires_in: int  # seconds until URL expires

class CVListResponse(BaseModel):
    cvs: List[CVResponse]
    total: int
