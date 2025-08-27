from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index
from sqlalchemy.sql import func
from app.database import Base

class CV(Base):
    __tablename__ = "cvs"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=True)
    filename = Column(String(255), nullable=False)
    mime_type = Column(String(100), nullable=False)
    size_bytes = Column(Integer, nullable=False)
    storage_url = Column(String(500), nullable=False)
    status = Column(String(50), default="uploaded", nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<CV(id={self.id}, filename='{self.filename}', user_id={self.user_id}, status='{self.status})>"

# Add indexes
__table_args__ = (
    Index('ix_cvs_user_id_created_at', 'user_id', 'created_at'),
)