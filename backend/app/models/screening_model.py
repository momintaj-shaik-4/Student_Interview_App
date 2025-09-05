from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Screening(Base):
    __tablename__ = "screenings"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    cv_id = Column(Integer, ForeignKey("cvs.id"), nullable=False)
    status = Column(String(50), nullable=False)  # pending|done|failed
    credits_used = Column(Integer, default=1, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<Screening(id={self.id}, user_id={self.user_id}, cv_id={self.cv_id}, status='{self.status}', credits_used={self.credits_used})>"
