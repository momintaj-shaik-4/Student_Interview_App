from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    kind = Column(String(50), nullable=False)  # upload|interview_start|screening|login|profile_update
    # Use string to store flexible reference identifiers (e.g., order ids, composed keys)
    ref_id = Column(String(255), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<Activity(id={self.id}, user_id={self.user_id}, kind='{self.kind}', ref_id={self.ref_id})>"