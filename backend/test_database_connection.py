#!/usr/bin/env python3
"""
Database Connection Test Script
Tests the database connection and prints the result.
"""

import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(__file__))

import database

def main():
    """
    Test database connection and print result.
    """
    try:
        # Test the connection
        if database.test_connection():
            print("Database connection successful")
            sys.exit(0)
        else:
            print("Database connection failed")
            sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()