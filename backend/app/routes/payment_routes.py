from fastapi import Depends, HTTPException, APIRouter, Request
from typing import Annotated, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.user_model import User
from app.models.wallet_model import Wallet
from app.models.transaction_model import Transaction
from app.models.payment_model import Payment
from app.schemas import (
    PaymentWalletResponse, PaymentTransactionResponse, PaymentOrderRequest,
    PaymentOrderResponse, PaymentWebhookRequest, TransactionListResponse
)
from app.dependencies import SessionDep, get_curr_user
import os
import hashlib
import hmac
import json
from decimal import Decimal

router = APIRouter()

# Payment configuration
PAYMENT_PROVIDER = os.getenv("PAYMENT_PROVIDER", "razorpay")
RAZORPAY_KEY = os.getenv("RAZORPAY_KEY")
RAZORPAY_SECRET = os.getenv("RAZORPAY_SECRET")
MERCHANT_UPI_ID = os.getenv("MERCHANT_UPI_ID", "merchant@upi")  # Your UPI ID
COMPANY_NAME = os.getenv("COMPANY_NAME", "InterviewCredits")

# Credit pack configuration (hardcoded for MVP)
CREDIT_PACKS = {
    1: {"credits": 10, "amount_inr": Decimal("100.00"), "description": "10 Credits Pack"},
    2: {"credits": 25, "amount_inr": Decimal("225.00"), "description": "25 Credits Pack"},
    3: {"credits": 50, "amount_inr": Decimal("400.00"), "description": "50 Credits Pack"},
    4: {"credits": 100, "amount_inr": Decimal("750.00"), "description": "100 Credits Pack"},
}

def get_or_create_wallet(user_id: int, session: Session) -> Wallet:
    """Get or create wallet for user"""
    wallet = session.query(Wallet).filter(Wallet.user_id == user_id).first()
    if not wallet:
        wallet = Wallet(user_id=user_id, balance_credits=0)
        session.add(wallet)
        session.commit()
        session.refresh(wallet)
    return wallet

def verify_razorpay_signature(payload: str, signature: str) -> bool:
    """Verify Razorpay webhook signature"""
    if not RAZORPAY_SECRET:
        return False
    
    expected_signature = hmac.new(
        RAZORPAY_SECRET.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(expected_signature, signature)

def create_razorpay_order(amount: int, order_id: str, user_email: str):
    """Create real Razorpay order"""
    try:
        import razorpay
        
        if not RAZORPAY_KEY or not RAZORPAY_SECRET:
            raise Exception("Razorpay credentials not configured")
        
        client = razorpay.Client(auth=(RAZORPAY_KEY, RAZORPAY_SECRET))
        
        order_data = {
            "amount": amount,  # Amount in paise
            "currency": "INR",
            "receipt": order_id,
            "notes": {
                "user_email": user_email,
                "order_type": "credit_purchase"
            }
        }
        
        razorpay_order = client.order.create(data=order_data)
        return razorpay_order
        
    except ImportError:
        raise Exception("Razorpay package not installed. Run: pip install razorpay")
    except Exception as e:
        raise Exception(f"Failed to create Razorpay order: {str(e)}")

def generate_real_upi_link(order_id: str, amount: Decimal, razorpay_order_id: str = None):
    """Generate real UPI payment link"""
    if RAZORPAY_KEY and RAZORPAY_SECRET and MERCHANT_UPI_ID:
        # Production: Use real UPI ID and Razorpay order
        upi_link = f"upi://pay?pa={MERCHANT_UPI_ID}&pn={COMPANY_NAME}&tn={order_id}&am={amount}&cu=INR"
        if razorpay_order_id:
            upi_link += f"&tr={razorpay_order_id}"
        return upi_link
    else:
        # Development: Use mock UPI link
        return f"upi://pay?pa=merchant@upi&pn=InterviewCredits&tn={order_id}&am={amount}&cu=INR"

@router.get("/wallet", response_model=PaymentWalletResponse)
def get_wallet(
    current_user: Annotated[User, Depends(get_curr_user)],
    session: SessionDep
):
    """
    Get user's wallet balance and last 5 transactions
    """
    try:
        # Get or create wallet
        wallet = get_or_create_wallet(current_user.id, session)
        
        # Get last 5 transactions
        transactions = session.query(Transaction).filter(
            Transaction.user_id == current_user.id
        ).order_by(Transaction.created_at.desc()).limit(5).all()
        
        transaction_responses = [
            PaymentTransactionResponse(
                id=t.id,
                user_id=t.user_id,
                type=t.type,
                credits=t.credits,
                amount_inr=t.amount_inr,
                currency=t.currency,
                payment_gateway=t.payment_gateway,
                external_ref=t.external_ref,
                status=t.status,
                created_at=t.created_at
            )
            for t in transactions
        ]
        
        return PaymentWalletResponse(
            balance_credits=wallet.balance_credits,
            last_transactions=transaction_responses
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get wallet: {str(e)}")

@router.post("/payments/order", response_model=PaymentOrderResponse)
def create_payment_order(
    order_data: PaymentOrderRequest,
    current_user: Annotated[User, Depends(get_curr_user)],
    session: SessionDep
):
    """
    Create a payment order for credit purchase
    """
    try:
        # Validate credit pack
        if order_data.pack_id not in CREDIT_PACKS:
            raise HTTPException(status_code=400, detail="Invalid credit pack")
        
        pack = CREDIT_PACKS[order_data.pack_id]
        
        # Generate order ID
        import uuid
        order_id = f"order_{uuid.uuid4().hex[:16]}"
        
        # Create payment record
        payment = Payment(
            user_id=current_user.id,
            order_id=order_id,
            amount_inr=pack["amount_inr"],
            currency="INR",
            status="created",
            method="UPI",
            payload_json={"pack_id": order_data.pack_id, "credits": pack["credits"]}
        )
        
        session.add(payment)
        session.commit()
        session.refresh(payment)
        
        # Create Razorpay order if credentials are available
        razorpay_order_id = None
        if RAZORPAY_KEY and RAZORPAY_SECRET:
            try:
                amount_in_paise = int(pack["amount_inr"] * 100)  # Convert to paise
                razorpay_order = create_razorpay_order(
                    amount=amount_in_paise,
                    order_id=order_id,
                    user_email=current_user.email
                )
                razorpay_order_id = razorpay_order.get("id")
                
                # Update payment record with Razorpay order ID
                payment.payload_json["razorpay_order_id"] = razorpay_order_id
                session.commit()
                
            except Exception as e:
                # Log error but continue with mock payment
                print(f"Razorpay order creation failed: {e}")
        
        # Generate UPI link
        upi_link = generate_real_upi_link(
            order_id=order_id,
            amount=pack["amount_inr"],
            razorpay_order_id=razorpay_order_id
        )
        
        # Generate QR code (in production, you'd use a QR code library)
        qr_code = None
        if RAZORPAY_KEY and RAZORPAY_SECRET:
            # In production, generate QR code for the UPI link
            try:
                import qrcode
                import base64
                from io import BytesIO
                
                # Generate QR code
                qr = qrcode.QRCode(version=1, box_size=10, border=5)
                qr.add_data(upi_link)
                qr.make(fit=True)
                
                # Create QR code image
                img = qr.make_image(fill_color="black", back_color="white")
                
                # Convert to base64
                buffer = BytesIO()
                img.save(buffer, format='PNG')
                qr_code = f"data:image/png;base64,{base64.b64encode(buffer.getvalue()).decode()}"
                
            except ImportError:
                # QR code library not installed, continue without QR
                pass
            except Exception as e:
                # QR generation failed, continue without QR
                print(f"QR code generation failed: {e}")
                pass
        
        return PaymentOrderResponse(
            order_id=order_id,
            amount=pack["amount_inr"],
            upi_link=upi_link,
            qr_code=qr_code
        )
        
    except HTTPException:
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create payment order: {str(e)}")

@router.post("/payments/webhook")
async def payment_webhook(
    request: Request,
    session: SessionDep
):
    """
    Handle payment webhook from payment gateway
    """
    try:
        # Get raw body for signature verification
        body = await request.body()
        payload = body.decode()
        
        # Get headers
        signature = request.headers.get("X-Razorpay-Signature")
        
        # Verify signature (in production)
        if RAZORPAY_SECRET and not verify_razorpay_signature(payload, signature):
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Parse webhook data
        webhook_data = json.loads(payload)
        
        # Extract payment details
        payment_id = webhook_data.get("payload", {}).get("payment", {}).get("entity", {}).get("id")
        order_id = webhook_data.get("payload", {}).get("payment", {}).get("entity", {}).get("order_id")
        status = webhook_data.get("payload", {}).get("payment", {}).get("entity", {}).get("status")
        amount = webhook_data.get("payload", {}).get("payment", {}).get("entity", {}).get("amount")
        
        if not all([payment_id, order_id, status, amount]):
            raise HTTPException(status_code=400, detail="Invalid webhook data")
        
        # Find payment record
        payment = session.query(Payment).filter(Payment.order_id == order_id).first()
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")
        
        # Check if already processed
        if payment.status == "success":
            return {"message": "Payment already processed"}
        
        # Update payment status
        payment.status = status
        payment.signature = signature
        
        if status == "captured":
            # Payment successful - credit the wallet
            pack_data = payment.payload_json
            credits = pack_data.get("credits", 0)
            
            # Get or create wallet
            wallet = get_or_create_wallet(payment.user_id, session)
            
            # Add credits
            wallet.balance_credits += credits
            
            # Create transaction record
            transaction = Transaction(
                user_id=payment.user_id,
                type="purchase",
                credits=credits,
                amount_inr=payment.amount_inr,
                currency=payment.currency,
                payment_gateway="razorpay",
                external_ref=payment_id,
                status="success"
            )
            
            session.add(transaction)
            session.commit()
            
            return {"message": "Payment processed successfully", "credits_added": credits}
        else:
            # Payment failed
            session.commit()
            return {"message": "Payment failed", "status": status}
            
    except HTTPException:
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to process webhook: {str(e)}")

@router.get("/transactions", response_model=TransactionListResponse)
def get_transactions(
    current_user: Annotated[User, Depends(get_curr_user)],
    session: SessionDep,
    skip: int = 0,
    limit: int = 10
):
    """
    Get paginated list of user's transactions
    """
    try:
        # Get total count
        total = session.query(Transaction).filter(
            Transaction.user_id == current_user.id
        ).count()
        
        # Get transactions with pagination
        transactions = session.query(Transaction).filter(
            Transaction.user_id == current_user.id
        ).order_by(Transaction.created_at.desc()).offset(skip).limit(limit).all()
        
        transaction_responses = [
            PaymentTransactionResponse(
                id=t.id,
                user_id=t.user_id,
                type=t.type,
                credits=t.credits,
                amount_inr=t.amount_inr,
                currency=t.currency,
                payment_gateway=t.payment_gateway,
                external_ref=t.external_ref,
                status=t.status,
                created_at=t.created_at
            )
            for t in transactions
        ]
        
        return TransactionListResponse(
            transactions=transaction_responses,
            total=total
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get transactions: {str(e)}")

