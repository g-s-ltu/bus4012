# LocalLend - Peer-to-Peer Lending Application

LocalLend is a full-stack peer-to-peer lending application with a React + TypeScript frontend and a Python FastAPI backend connected to Supabase PostgreSQL.

## Project Structure

```
.
├── frontend/          # React + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormSection.tsx
│   │   │   ├── IconButton.tsx
│   │   │   ├── ThreeDButton.tsx
│   │   │   ├── FloatingInput.tsx
│   │   │   └── AnimatedCheckmark.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── VerifyEmailPage.tsx
│   │   │   ├── VerifiedPage.tsx
│   │   │   ├── PaymentPage.tsx
│   │   │   └── RegistrationResultPage.tsx
│   │   ├── types.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── package.json
└── backend/           # Python FastAPI + Supabase
    ├── main.py
    ├── database.py
    ├── setup_schema.sql
    ├── requirements.txt
    ├── .env.example
    ├── test_database_connection.py
    └── check_tables.py
```

## Features

### Frontend
- **6-screen registration wizard** with clean UX
- **Form validation** with touched field pattern
- **Floating label inputs** with peer CSS utilities
- **OTP verification** with 4 independent input boxes
- **Animated checkmark** SVG with stroke-dashoffset animation
- **3D button** with tactile press effect
- **State management** in App.tsx with localStorage persistence
- **Props-down/callbacks-up** pattern throughout

### Backend
- **FastAPI** REST API with automatic OpenAPI docs
- **Supabase PostgreSQL** connection with URL encoding
- **Connection pooling** with psycopg2
- **Automatic schema initialization** on startup
- **User profiles table** linked to Supabase Auth
- **Database trigger** for auto-creating profiles on signup
- **Health check** endpoint

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- Supabase account with PostgreSQL database

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:5173

### Backend Setup

1. Create a `.env` file from `.env.example`:
```bash
cd backend
cp .env.example .env
```

2. Edit `.env` with your Supabase credentials:
```
DATABASE_URL=postgresql://postgres.YOUR_PROJECT_ID:YOUR_PASSWORD@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres
DATABASE_PWD=your_password_here
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Run the FastAPI server:
```bash
python main.py
```

The backend will run on http://127.0.0.1:8000

Swagger docs available at http://127.0.0.1:8000/docs

### Database Verification Scripts

Test database connection:
```bash
python test_database_connection.py
```

Check tables and triggers:
```bash
python check_tables.py
```

## API Endpoints

- `GET /` - Root endpoint with API info
- `GET /health` - Health check with database status
- `POST /api/register` - User registration endpoint
- `GET /api/users/{email}` - Get user by email

## Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router v6

### Backend
- Python 3.8+
- FastAPI
- Uvicorn
- psycopg2-binary
- python-dotenv
- Pydantic

### Database
- Supabase PostgreSQL
- Row Level Security (RLS)
- Database triggers
- Connection pooling

## License

ISC