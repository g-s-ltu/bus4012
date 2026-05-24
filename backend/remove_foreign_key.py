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
    
    # Drop the foreign key constraint if it exists
    cursor.execute("ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey")
    
    conn.commit()
    cursor.close()
    conn.close()
    
    print("Foreign key constraint removed successfully from user_profiles table")
    
except Exception as e:
    print(f"Error: {e}")