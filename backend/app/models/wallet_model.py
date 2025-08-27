from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Wallet(Base):
    __tablename__ = "wallets"
    
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    balance_credits = Column(Integer, default=0, nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<Wallet(user_id={self.user_id}, balance_credits={self.balance_credits})>"