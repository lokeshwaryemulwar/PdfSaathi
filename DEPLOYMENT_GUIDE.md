# Deployment Guide for PDF Saathi

Your application is now ready for deployment! Because your app uses **Node.js**, **Python** (for Excel conversion), and **SQLite**, the best way to deploy it is using **Docker**.

We recommend using **Render.com** as it supports Docker containers easily.

## option 1: Deploy on Render.com (Recommended)

1.  **Push your code to GitHub** (if you haven't already).
2.  **Sign up/Log in to [Render.com](https://render.com)**.
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Configuration**:
    *   **Runtime**: Select **Docker**.
    *   **Region**: Choose the one closest to you (e.g., Singapore, Frankfurt, Oregon).
    *   **Instance Type**: The "Free" tier works for testing, but note it puts the app to sleep after inactivity. For production, the generic "Starter" ($7/mo) is better.
6.  **Environment Variables**:
    *   Scroll down to "Environment Variables".
    *   Add `NODE_ENV` = `production`
    *   *(Optional)* If you want a specific admin password, you can modify it in the database code or add env vars later, but default is `admin/admin123`.
7.  **Disk (Persistent Data) - IMPORTANT**:
    *   Your app uses **SQLite** (`pdfsaathi.db`). On most cloud platforms, the file system is "ephemeral" (temporary). If the app restarts, **you will lose all registered users and data**.
    *   **To fix this on Render**:
        *   You need to add a **Disk** to your service (Paid feature, ~$0.25/GB).
        *   Mount path: `/app/server/pdfsaathi.db` (This is tricky because the file needs to be in a directory).
        *   **Better Strategy for Render**: Use the Docker volume if supported, or just accept that data resets on the Free tier.
        *   **Alternative**: For a serious app, you should switch `better-sqlite3` to **PostgreSQL**. Render provides a managed PostgreSQL database. This requires code changes.
    *   *For now, just deploying it will work, but data will reset on redeployment.*

## Option 2: Deploy on a VPS (DigitalOcean/AWS EC2)

This is the best option for keeping your SQLite data without code changes.

1.  **Get a VPS** (e.g., standard Ubuntu droplet).
2.  **Install Docker**:
    ```bash
    sudo apt update
    sudo apt install docker.io
    ```
3.  **Clone your repo**:
    ```bash
    git clone https://github.com/your-username/PDFSaathi.git
    cd PDFSaathi
    ```
4.  **Build and Run**:
    ```bash
    # Build the image
    docker build -t pdfsaathi .

    # Run it (mapping port 80 to container 3000)
    # The -v volume maps the local server directory to the container to save the DB
    docker run -d -p 80:3000 --name myapp \
      -v $(pwd)/server/pdfsaathi.db:/app/server/pdfsaathi.db \
      -v $(pwd)/server/uploads:/app/server/uploads \
      pdfsaathi
    ```
5.  Your app is now live at your VPS IP address!

## Domain Setup

Once deployed (e.g., `https://pdfsaathi.onrender.com`), you can add a custom domain:
1.  Buy a domain (Namecheap, GoDaddy, etc.).
2.  In Render (or your host), go to **Settings** -> **Custom Domains**.
3.  Follow the instructions to add a CNAME record in your domain's DNS settings pointing to your app.

## Troubleshooting

-   **Uploads not working**: Ensure the `server/uploads` folder is writable. In Docker, it is writable by default, but content vanishes on restart unless you use volumes.
-   **Excel Conversion fail**: Check logs (`docker logs <container_id>`). Ensure Python memory is sufficient.
