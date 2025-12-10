# Portfolio Deployment Guide

## Overview
This portfolio uses a modern JAMstack architecture:
- **Frontend**: React + Vite (Static Site)
- **CMS**: Strapi (Headless CMS)
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render

---

## Part 1: Setting Up Strapi CMS

### 1. Create Strapi Backend

```bash
# Navigate to your projects directory
cd d:\

# Create new Strapi project
npx create-strapi-app@latest portfolio-cms

# Choose:
# - Installation type: Quickstart (recommended)
# - Database: SQLite (for development) or PostgreSQL (for production)
```

### 2. Configure Content Types

Once Strapi is running (http://localhost:1337/admin):

1. **Create Admin Account** (first time only)
2. **Create Content Types**:

#### Hero Content Type
- `name` (Text)
- `tagline` (Text)
- `handle` (Text)

#### Projects Collection
- `title` (Text)
- `subtitle` (Text)
- `description` (Long Text)
- `tech` (JSON)
- `role` (Text)
- `links` (JSON)
- `thumbnailPublicId` (Text)

#### Graphics Collection
- `title` (Text)
- `description` (Text)
- `imagePublicId` (Text)
- `category` (Text)

#### About Content Type
- `intro` (Text)
- `paragraphs` (JSON)
- `stats` (JSON)

#### Tech Stack Content Type
- `categories` (JSON)

#### Contact Content Type
- `email` (Email)
- `socials` (JSON)

#### WIP Collection
- `title` (Text)
- `description` (Long Text)
- `status` (Enumeration: design, dev, testing)
- `progress` (Number)
- `tech` (JSON)
- `imagePublicId` (Text)

#### Certifications Collection
- `title` (Text)
- `issuer` (Text)
- `date` (Text)
- `link` (Text)

#### Hackathons Collection
- `event` (Text)
- `position` (Text)
- `project` (Text)
- `team` (Text)
- `description` (Long Text)

### 3. Configure API Permissions

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. Enable **find** and **findOne** for all content types
3. Save

### 4. Add Your Content

Populate all content types with your portfolio data through the Strapi admin panel.

---

## Part 2: Deploy Strapi to Render

### 1. Push Strapi to GitHub

```bash
cd portfolio-cms
git init
git add .
git commit -m "Initial Strapi setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio-cms.git
git push -u origin main
```

### 2. Deploy on Render

1. Go to [render.com](https://render.com) and sign up
2. Click **New** → **Web Service**
3. Connect your GitHub repository (`portfolio-cms`)
4. Configure:
   - **Name**: `portfolio-cms`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free (or paid for production)

5. Add Environment Variables:
   ```
   NODE_ENV=production
   DATABASE_CLIENT=postgres
   DATABASE_HOST=<render-postgres-host>
   DATABASE_PORT=5432
   DATABASE_NAME=<database-name>
   DATABASE_USERNAME=<username>
   DATABASE_PASSWORD=<password>
   JWT_SECRET=<generate-random-string>
   ADMIN_JWT_SECRET=<generate-random-string>
   APP_KEYS=<generate-random-string>
   API_TOKEN_SALT=<generate-random-string>
   ```

6. Create a PostgreSQL database on Render:
   - Click **New** → **PostgreSQL**
   - Copy connection details to environment variables above

7. Deploy!

Your Strapi backend will be live at: `https://portfolio-cms.onrender.com`

---

## Part 3: Connect Frontend to Strapi

### 1. Install Axios

```bash
cd d:\SPiceZ-Portfolio
npm install axios
```

### 2. Create API Service

Create `src/services/api.ts`:

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337/api';

export const fetchHero = async () => {
  const response = await axios.get(`${API_URL}/hero`);
  return response.data.data.attributes;
};

export const fetchProjects = async () => {
  const response = await axios.get(`${API_URL}/projects`);
  return response.data.data.map((item: any) => item.attributes);
};

export const fetchGraphics = async () => {
  const response = await axios.get(`${API_URL}/graphics`);
  return response.data.data.map((item: any) => item.attributes);
};

// Add more fetch functions for other content types...
```

### 3. Update Components

Replace JSON imports with API calls using React Query or useEffect.

### 4. Add Environment Variable

Create/update `.env`:

```
VITE_STRAPI_URL=https://portfolio-cms.onrender.com/api
```

---

## Part 4: Deploy Frontend to Vercel

### 1. Push to GitHub

```bash
cd d:\SPiceZ-Portfolio
git add .
git commit -m "Connect to Strapi CMS"
git push
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   ```
   VITE_STRAPI_URL=https://portfolio-cms.onrender.com/api
   ```

6. Click **Deploy**

Your portfolio will be live at: `https://your-portfolio.vercel.app`

---

## Part 5: Custom Domain (Optional)

### Vercel (Frontend)
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed

### Render (Backend)
1. Go to your service → **Settings** → **Custom Domain**
2. Add `api.yourdomain.com`
3. Update DNS records

---

## Maintenance

### Update Content
- Login to Strapi admin: `https://portfolio-cms.onrender.com/admin`
- Edit content
- Changes reflect immediately on frontend

### Update Code
- Push to GitHub
- Vercel auto-deploys frontend
- Render auto-deploys backend

---

## Costs

- **Vercel**: Free for personal projects
- **Render**: 
  - Free tier available (sleeps after inactivity)
  - Paid: $7/month for always-on service
- **Total**: $0-7/month

---

## Support

For issues:
- Strapi Docs: https://docs.strapi.io
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
