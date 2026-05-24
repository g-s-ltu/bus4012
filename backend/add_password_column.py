import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables from backend/.env
load_dotenv('backend/.env')

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

try:
    # Connect to database
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    
    # Add password_hash column if it doesn't exist
    cursor.execute("ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS password_hash TEXT NOT NULL DEFAULT ''")
    
    conn.commit()
    cursor.close()
    conn.close()
    
    print("password_hash column added successfully to user_profiles table")
    
except Exception as e:
    print(f"Error: {e}")