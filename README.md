# DevOps Dashboard Resume

A responsive, interactive resume modeled after a Kubernetes/Cloud Console dashboard.

## 🚀 Features

- **Interactive Terminal**: Run commands like `help`, `kubectl get pods`, `top`, etc.
- **Resource Monitoring**: Live charts showing mock CPU/Memory usage.
- **Live Events**: Real-time log streaming simulation.
- **PDF Export**: Print-friendly layout toggle.
- **CI/CD Deployment**: Deployed via GitHub Actions.

## 🛠️ Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

## 📦 Deployment

This repository uses **GitHub Actions** for deployment.
1. Push changes to `main`.
2. The workflow in `.github/workflows/deploy.yml` will automatically build and deploy to GitHub Pages.
3. Ensure **Settings > Pages > Build and deployment > Source** is set to **GitHub Actions**.
