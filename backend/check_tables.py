#!/usr/bin/env python3
"""
Database Tables Check Script
Verifies that the user_profiles table exists and the trigger is active.
"""

import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(__file__))

import database

def check_table_exists(conn, table_name: str) -> bool:
    """
    Check if a table exists in the public schema.
    """
    cursor = conn.cursor()
    cursor.execute("""
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = %s
        );
    """, (table_name,))
    result = cursor.fetchone()[0]
    cursor.close()
    return result

def check_trigger_exists(conn, trigger_name: str) -> bool:
    """
    Check if a trigger exists on the auth.users table.
    """
    cursor = conn.cursor()
    cursor.execute("""
        SELECT EXISTS (
            SELECT FROM information_schema.triggers 
            WHERE trigger_schema = 'auth' 
            AND event_object_table = 'users'
            AND trigger_name = %s
        );
    """, (trigger_name,))
    result = cursor.fetchone()[0]
    cursor.close()
    return result

def check_columns(conn, table_name: str) -> list:
    """
    Get list of columns in a table.
    """
    cursor = conn.cursor()
    cursor.execute("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = %s
        ORDER BY ordinal_position;
    """, (table_name,))
    columns = [row[0] for row in cursor.fetchall()]
    cursor.close()
    return columns

def main():
    """
    Check tables and triggers, print results.
    """
    try:
        conn = database.get_connection()
        
        # Check if user_profiles table exists
        if check_table_exists(conn, 'user_profiles'):
            print("Table found: public.user_profiles")
            
            # List columns
            columns = check_columns(conn, 'user_profiles')
            print(f"Columns: {', '.join(columns)}")
        else:
            print("Table not found: public.user_profiles")
        
        # Check if trigger exists
        if check_trigger_exists(conn, 'on_auth_user_created'):
            print("Trigger found: on_auth_user_created")
        else:
            print("Trigger not found: on_auth_user_created")
        
        database.release_connection(conn)
        sys.exit(0)
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()