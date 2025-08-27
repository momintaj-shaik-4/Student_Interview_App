from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    name = Column(String(50), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(128), nullable=False)
    city = Column(String(50), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<User(id={self.id}, name='{self.name}', email='{self.email}', active={self.is_active})>"
    
