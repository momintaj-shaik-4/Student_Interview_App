from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index
from sqlalchemy.sql import func
from app.database import Base

class Interview(Base):
    __tablename__ = "interviews"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    cv_id = Column(Integer, ForeignKey("cvs.id"), nullable=True)
    status = Column(String(50), nullable=False)  # pending|in_progress|done|failed
    credits_used = Column(Integer, default=5, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<Interview(id={self.id}, user_id={self.user_id}, role_id={self.role_id}, status='{self.status}', credits_used={self.credits_used})>"

# Add indexes  
__table_args__ = (
    Index('ix_interviews_user_id_created_at', 'user_id', 'created_at'),
)
