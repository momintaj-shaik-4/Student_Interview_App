from sqlalchemy import Column, Integer, String, Boolean, Text
from sqlalchemy.dialects.postgresql import ARRAY
from app.database import Base

class Role(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    tags = Column(ARRAY(String), nullable=True, default=[])
    is_active = Column(Boolean, default=True, nullable=False)
    
    def __repr__(self):
        return f"<Role(id={self.id}, title='{self.title}', is_active={self.is_active})>"