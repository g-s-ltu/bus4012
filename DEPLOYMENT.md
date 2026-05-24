# LocalLend - Vercel Deployment Guide

## Project Structure

```
BUS4012-A3/
├── frontend/          # React + Vite frontend
│   ├── src/
│   ├── .env          # API configuration
│   └── package.json
├── backend/           # FastAPI backend
│   ├── api/
│   │   └── index.py  # Vercel serverless entry point
│   ├── database.py
│   ├── requirements.txt
│   └── setup_schema.sql
├── vercel.json        # Vercel deployment configuration
└── DEPLOYMENT.md      # This file
```

## Deployment Steps

### 1. Prerequisites
- Vercel account
- Supabase database (PostgreSQL)
- Vercel CLI installed: `npm i -g vercel`

### 2. Environment Variables Setup

#### Backend (Vercel)
Set these environment variables in your Vercel project settings:
- `DATABASE_URL`: Your Supabase connection string
- `DATABASE_PWD`: Your database password

#### Frontend
Update `frontend/.env` with your production API URL after backend deployment:
```
VITE_API_BASE_URL=https://your-backend-url.vercel.app
```

### 3. Deploy Backend

```bash
# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: locallend-backend
# - Directory: ./
```

### 4. Deploy Frontend

After backend is deployed, update `frontend/.env` with the backend URL, then:

```bash
cd frontend
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: locallend-frontend
# - Directory: ./
# - Override settings? N
```

### 5. Configure CORS

Update `backend/api/index.py` CORS origins with your frontend domain:
```python
allow_origins=[
    "http://localhost:5173",
    "https://your-frontend-url.vercel.app"
]
```

### 6. Database Setup

Ensure your Supabase database has the required schema:
```bash
# Connect to Supabase and run setup_schema.sql
```

## API Endpoints

- `GET /` - API info
- `GET /health` - Health check
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/users/{email}` - Get user by email

## Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

## Troubleshooting

### Common Issues

1. **CORS errors**: Update CORS origins in backend/api/index.py
2. **Database connection**: Verify DATABASE_URL and DATABASE_PWD in Vercel
3. **Import errors**: Check that all Python files are in the backend/ directory

### Logs
View logs in Vercel dashboard or use:
```bash
vercel logs