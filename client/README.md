# YT Clone

This is a minimal React + Vite frontend scaffold for your YT-Clone backend.

Quick start

1. Open a terminal in `client/`.
2. Install dependencies:

   npm install

3. Start the dev server:

   npm run dev

The frontend expects the backend to be available at `http://localhost:8000` by default. You can set `VITE_API_URL` in your environment to point to a different URL (Vite requires env vars to start with `VITE_`). For example on PowerShell:

```powershell
$env:VITE_API_URL='http://your-backend:8000'; npm run dev
```

What's included

- `src/App.jsx` - routes
- `src/pages/Home.jsx` - list videos
- `src/pages/Watch.jsx` - watch single video
- `src/pages/Upload.jsx` - upload video form
- `src/components` - `Navbar`, `VideoList`, `VideoCard`, `VideoPlayer`
- `src/api.js` - axios instance and helpers

Notes & next steps

- Wire authentication (login/register) if needed.
- Add better error handling and pagination.
- Improve UI with a CSS framework or Tailwind.
