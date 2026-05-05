# Sodor Academy

An interactive educational platform for children set in the Thomas & Friends universe.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app in development mode:
   `npm run dev`
3. Or run the production build locally:
   `npm run build && npm start`

## Deployment

### On your own server (slashbin.net)

To see the app at `https://slashbin.net/SodorAcademy/`, you must serve the contents of the `dist` folder.

1. Run the build:
   `npm run build`
2. Configure your web server (Nginx/Apache) to point the `/SodorAcademy/` path to the `/var/www/slashbin.net/SodorAcademy/dist` directory.

### GitHub Pages
This repository is configured to automatically deploy to GitHub Pages when you push to the `main` branch.
