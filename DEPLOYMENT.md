# ProEase Global — Storefront Deployment

React + Vite static site. `vercel.json` already rewrites all routes to
`index.html` so client-side routes (`/collection`, `/faq`, `/bulk-order`, …)
work on refresh.

## Deploy on Vercel (or Netlify)
1. **New Project** → import the `proeaseglobal-fe` repo.
2. Framework preset: **Vite**. Build command: `npm run build`. Output dir: `dist`.
3. Add the **Environment Variables** below.
4. Deploy.

## Required environment variables
| Variable | Value |
|---|---|
| `VITE_BACKEND_URL` | The deployed backend URL, e.g. `https://proeaseglobal-be.vercel.app` (no trailing slash). |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID (same value as backend's `GOOGLE_CLIENT_ID`). |
| `VITE_RAZORPAY_KEY_ID` | Optional — only if using Razorpay. |

> Vite reads env vars **at build time**, so after changing any `VITE_*` value you must **redeploy**.

## After deploying
- **Google sign-in**: in Google Cloud Console → your OAuth client → **Authorized
  JavaScript origins**, add the deployed storefront URL (e.g.
  `https://proeaseglobal-fe.vercel.app`). Without this the Google button errors.
- The "Continue with Google" button only appears once `VITE_GOOGLE_CLIENT_ID` is set
  to a real value.

## Order of deployment
Deploy the **backend first**, copy its URL into `VITE_BACKEND_URL` here, then deploy.
