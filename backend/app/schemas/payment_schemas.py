from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

# Wallet schemas
class WalletResponse(BaseModel):
    balance_credits: int
    last_transactions: List['TransactionResponse']

# Transaction schemas
class TransactionResponse(BaseModel):
    id: int
    user_id: int
    type: str  # purchase, deduct, refund, adjust
    credits: int
    amount_inr: Optional[Decimal]
    currency: str
    payment_gateway: Optional[str]
    external_ref: Optional[str]
    status: str
    created_at: datetime

# Payment schemas
class PaymentOrderRequest(BaseModel):
    pack_id: int  # Credit pack ID

class PaymentOrderResponse(BaseModel):
    order_id: str
    amount: Decimal
    upi_link: str
    qr_code: Optional[str]

class PaymentWebhookRequest(BaseModel):
    order_id: str
    payment_id: str
    signature: str
    status: str
    amount: Decimal

# Credit pack schemas
class CreditPackResponse(BaseModel):
    id: int
    credits: int
    amount_inr: Decimal
    description: str
    is_active: bool

# Transaction list response
class TransactionListResponse(BaseModel):
    transactions: List[TransactionResponse]
    total: int





