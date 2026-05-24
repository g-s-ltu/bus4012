import os
import psycopg2
from psycopg2 import pool
from dotenv import load_dotenv
from urllib.parse import quote_plus

# Load environment variables from backend directory
import os
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

def get_database_url() -> str:
    """
    Constructs the DATABASE_URL with URL-encoded password to handle special characters.
    Falls back to direct DATABASE_URL if provided.
    """
    # Check if DATABASE_URL is directly provided
    database_url = os.getenv("DATABASE_URL")
    database_pwd = os.getenv("DATABASE_PWD")
    
    if database_url and database_pwd:
        # URL-encode the password to handle special characters
        encoded_pwd = quote_plus(database_pwd)
        # Replace the password placeholder in the URL
        if "YOUR_PASSWORD" in database_url:
            database_url = database_url.replace("YOUR_PASSWORD", encoded_pwd)
        return database_url
    elif database_url:
        return database_url
    else:
        raise ValueError("DATABASE_URL environment variable is not set")

# Database connection configuration
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "database": os.getenv("DB_NAME", "postgres"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", ""),
    "port": os.getenv("DB_PORT", "5432"),
}

# Connection pool
connection_pool = None

def init_connection_pool(minconn: int = 1, maxconn: int = 10):
    """
    Initialize the connection pool.
    """
    global connection_pool
    try:
        database_url = get_database_url()
        connection_pool = pool.SimpleConnectionPool(
            minconn,
            maxconn,
            database_url
        )
        print("Database connection pool initialized successfully")
    except Exception as e:
        print(f"Error initializing connection pool: {e}")
        raise

def get_connection():
    """
    Get a connection from the pool.
    """
    if connection_pool is None:
        init_connection_pool()
    return connection_pool.getconn()

def release_connection(conn):
    """
    Release a connection back to the pool.
    """
    if connection_pool:
        connection_pool.putconn(conn)

def close_all_connections():
    """
    Close all connections in the pool.
    """
    if connection_pool:
        connection_pool.closeall()

def test_connection() -> bool:
    """
    Test the database connection.
    """
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        cursor.close()
        release_connection(conn)
        return result[0] == 1
    except Exception as e:
        print(f"Database connection test failed: {e}")
        return False

if __name__ == "__main__":
    # Test the connection when run directly
    try:
        if test_connection():
            print("Database connection successful")
        else:
            print("Database connection failed")
    except Exception as e:
        print(f"Error: {e}")