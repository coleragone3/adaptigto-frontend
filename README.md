# AdaptiGTO

A poker hand simulator with GTO recommendations and user management.

## Deployment Instructions

### Frontend Deployment (Vercel)

1. Create a Vercel account at https://vercel.com
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Login to Vercel:
   ```bash
   vercel login
   ```
4. Deploy the frontend:
   ```bash
   vercel
   ```
5. Set up environment variables in Vercel:
   - Go to your project settings
   - Add the following environment variables:
     - `REACT_APP_CLERK_PUBLISHABLE_KEY`
     - `REACT_APP_API_URL` (your Railway backend URL)

### Backend Deployment (Railway)

1. Create a Railway account at https://railway.app
2. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```
3. Login to Railway:
   ```bash
   railway login
   ```
4. Initialize Railway project:
   ```bash
   railway init
   ```
5. Deploy the backend:
   ```bash
   railway up
   ```
6. Set up environment variables in Railway:
   - Go to your project settings
   - Add the following environment variables:
     - `CLERK_SECRET_KEY`
     - `ALLOWED_ORIGINS` (your Vercel frontend URL)
     - `PORT` (default: 3001)

### Post-Deployment

1. Update your Clerk application settings:
   - Add your Vercel domain to the allowed origins
   - Update any webhook URLs if needed

2. Test the deployment:
   - Visit your Vercel URL
   - Try logging in
   - Access the admin panel (if authorized)
   - Verify all features are working

## Development

To run locally:

1. Frontend:
   ```bash
   npm install
   npm start
   ```

2. Backend:
   ```bash
   node server.js
   ```

Make sure to set up your `.env` files with the appropriate environment variables for both frontend and backend. 