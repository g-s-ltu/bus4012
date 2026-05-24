from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import database
import os
from dotenv import load_dotenv
import bcrypt

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="LocalLend API",
    description="Backend API for LocalLend - Peer-to-Peer Lending Application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ProfileData(BaseModel):
    fullName: str
    email: str
    password: str
    phone: Optional[str] = None
    address: Optional[str] = None

class PaymentData(BaseModel):
    cardType: Optional[str] = None
    cardNumber: Optional[str] = None
    nameOnCard: Optional[str] = None
    expiryDate: Optional[str] = None
    cvv: Optional[str] = None
    agreedToTerms: bool = False

class RegistrationRequest(BaseModel):
    profile: ProfileData
    payment: PaymentData

class RegistrationResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    data: Optional[dict] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    data: Optional[dict] = None

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """
    Initialize database connection pool and run schema setup on startup.
    """
    try:
        # Initialize connection pool
        database.init_connection_pool()
        
        # Run schema setup
        conn = database.get_connection()
        cursor = conn.cursor()
        
        # Read and execute schema setup SQL
        schema_path = os.path.join(os.path.dirname(__file__), "setup_schema.sql")
        with open(schema_path, "r") as f:
            schema_sql = f.read()
            cursor.execute(schema_sql)
        
        conn.commit()
        cursor.close()
        database.release_connection(conn)
        
        print("Database initialization completed successfully")
    except Exception as e:
        error_msg = str(e)
        # Check if it's a duplicate object error (which is safe to ignore)
        if "already exists" in error_msg.lower() or "duplicateobject" in error_msg.lower():
            print(f"Database schema already exists (this is safe): {error_msg}")
            # Try to rollback the transaction if possible
            try:
                if 'conn' in locals():
                    conn.rollback()
                    cursor.close()
                    database.release_connection(conn)
            except:
                pass
        else:
            print(f"Database initialization failed: {e}")
            raise

@app.on_event("shutdown")
async def shutdown_event():
    """
    Close all database connections on shutdown.
    """
    database.close_all_connections()

# API Endpoints
@app.get("/")
async def root():
    """
    Root endpoint - returns basic API information.
    """
    return {
        "message": "Welcome to LocalLend API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """
    Health check endpoint - verifies API and database connectivity.
    """
    try:
        db_healthy = database.test_connection()
        return {
            "status": "healthy" if db_healthy else "degraded",
            "database": "connected" if db_healthy else "disconnected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "error",
            "error": str(e)
        }

@app.post("/api/register", response_model=RegistrationResponse)
async def register_user(request: RegistrationRequest):
    """
    Register a new user with profile and payment information.
    """
    try:
        profile = request.profile
        payment = request.payment
        
        # Validate card number starts with 2-6 if provided
        if payment.cardNumber:
            cleaned_card = payment.cardNumber.replace(" ", "")
            if len(cleaned_card) == 16:
                first_digit = int(cleaned_card[0])
                if first_digit < 2 or first_digit > 6:
                    return RegistrationResponse(
                        success=False,
                        message="Card number must start with a digit between 2 and 6"
                    )
        
        # Hash the password securely
        password_hash = bcrypt.hashpw(profile.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Store user profile in database with hashed password
        conn = database.get_connection()
        cursor = conn.cursor()
        
        # Generate a UUID for the user (in production, this would come from Supabase Auth)
        import uuid
        user_id = str(uuid.uuid4())
        
        cursor.execute(
            """INSERT INTO user_profiles (id, full_name, email, password_hash, phone, address) 
               VALUES (%s, %s, %s, %s, %s, %s)""",
            (user_id, profile.fullName, profile.email, password_hash, profile.phone, profile.address)
        )
        
        conn.commit()
        cursor.close()
        database.release_connection(conn)
        
        return RegistrationResponse(
            success=True,
            message="Registration successful",
            data={
                "id": user_id,
                "fullName": profile.fullName,
                "email": profile.email
            }
        )
        
    except Exception as e:
        print(f"Registration error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(e)}"
        )

@app.post("/api/login", response_model=LoginResponse)
async def login_user(request: LoginRequest):
    """
    Authenticate user with email and password.
    """
    try:
        conn = database.get_connection()
        cursor = conn.cursor()
        
        # Query user by email
        cursor.execute(
            "SELECT id, full_name, email, password_hash FROM user_profiles WHERE email = %s",
            (request.email,)
        )
        
        user = cursor.fetchone()
        cursor.close()
        database.release_connection(conn)
        
        if not user:
            return LoginResponse(
                success=False,
                message="Invalid email or password"
            )
        
        user_id, full_name, email, password_hash = user
        
        # Verify password
        if not bcrypt.checkpw(request.password.encode('utf-8'), password_hash.encode('utf-8')):
            return LoginResponse(
                success=False,
                message="Invalid email or password"
            )
        
        return LoginResponse(
            success=True,
            message="Login successful",
            data={
                "id": str(user_id),
                "fullName": full_name,
                "email": email
            }
        )
        
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Login failed: {str(e)}"
        )

@app.get("/api/users/{email}")
async def get_user(email: str):
    """
    Get user profile by email.
    """
    try:
        conn = database.get_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT id, full_name, email, phone, address, created_at FROM user_profiles WHERE email = %s",
            (email,)
        )
        
        user = cursor.fetchone()
        cursor.close()
        database.release_connection(conn)
        
        if user:
            return {
                "success": True,
                "data": {
                    "id": str(user[0]),
                    "fullName": user[1],
                    "email": user[2],
                    "phone": user[3],
                    "address": user[4],
                    "createdAt": user[5].isoformat() if user[5] else None
                }
            }
        else:
            raise HTTPException(status_code=404, detail="User not found")
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching user: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch user: {str(e)}"
        )

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)