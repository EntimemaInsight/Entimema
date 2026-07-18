# Release Process

1. Copy the release contents into the local Entimema repository.
2. Run `npm install` only when dependencies changed.
3. Run `npm run dev` and inspect desktop and mobile.
4. Run `npm run build`.
5. Commit with a versioned message.
6. Push to GitHub and review the Vercel deployment.
7. Record visual or functional changes in `CHANGELOG.md`.
