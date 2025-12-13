# Free Hosting Guide: Render + Namecheap

Since you have purchased the domain (`pdfsaathi.online`) but don't have hosting, you need a hosting provider that supports your application stack (Node.js + Python + SQLite).

**Render.com** is the best option because:
1.  It has a **Free Tier**.
2.  It supports **Docker** (which we just set up).
3.  It allows **Custom Domains** (like yours) even on the free plan.

---

## Phase 1: Push Code to GitHub (Prerequisite)

Render pulls your code from GitHub. If you haven't pushed your code yet:
1.  Create a new repository on [GitHub.com](https://github.com).
2.  Run these commands in your VS Code terminal (inside `d:\PDFSaathi`):
    ```bash
    git init
    git add .
    git commit -m "Ready for deployment"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git push -u origin main
    ```

---

## Phase 2: Deploy to Render for Free

1.  Go to [Render.com](https://render.com) and sign up/login (use GitHub login).
2.  Click **"New +"** button -> Select **"Web Service"**.
3.  Connect the GitHub repository you just pushed.
4.  **Settings**:
    *   **Name**: `pdfsaathi` (or unique name)
    *   **Runtime**: **Docker** (Important!)
    *   **Region**: Singapore (or nearest to you)
    *   **Instance Type**: **Free**
5.  **Environment Variables** (Click "Advanced" or "Environment"):
    *   Key: `NODE_ENV` | Value: `production`
6.  Click **"Create Web Service"**.
    *   *Wait for it to build. It might take 5-10 minutes.*
    *   Once done, you will get a URL like `https://pdfsaathi-xyz.onrender.com`.

---

## Phase 3: Connect Namecheap Domain (pdfsaathi.online)

Now to make `pdfsaathi.online` show your website:

### 1. Tell Render about your domain
1.  In your Render Dashboard, go to your **Web Service**.
2.  Go to the **"Settings"** tab.
3.  Scroll down to **"Custom Domains"**.
4.  Click **"Add Custom Domain"**.
5.  Enter: `www.pdfsaathi.online`
6.  Click **"Save"**.
    *   Render will verify it. It will show you a "DNS Configuration" value.
    *   It usually asks for a **CNAME** record pointing to `[your-app-name].onrender.com`.

### 2. Configure Namecheap DNS
1.  Log in to **Namecheap**.
2.  Go to **Domain List** -> Click **Manage** next to `pdfsaathi.online`.
3.  Go to the **Advanced DNS** tab.
4.  **Delete any existing records** (like parking page records).
5.  Add the following **2 New Records**:

    | Type | Host | Value | TTL |
    | :--- | :--- | :--- | :--- |
    | **CNAME Record** | `www` | `pdfsaathi-xyz.onrender.com` (Your Render URL) | Automatic |
    | **URL Redirect Record** | `@` | `https://www.pdfsaathi.online` | Unmasked |

    *Note: Replace `pdfsaathi-xyz.onrender.com` with your ACTUAL Render app URL.*

### 3. Verification
*   Wait 30-60 minutes for DNS to propagate.
*   Render needs to issue an SSL certificate (https) for you. This happens automatically once DNS is verified.
*   Visit `https://www.pdfsaathi.online`.

---

## ⚠️ Important Limitations of Free Hosting

1.  **Spin Down**: On the free tier, if no one visits the site for 15 minutes, it goes to "sleep". The next person to visit will wait ~30 seconds for it to wake up.
2.  **Data Reset**: Since we are using SQLite (a file-based database) in a Docker container, **every time the app restarts or you deploy new code, your database file is wiped**.
    *   **Consequence**: Registered users and contact messages will be lost on restart.
    *   **Solution**: To fix this permanently, you would need to use a cloud database (like MongoDB Atlas) instead of SQLite, or upgrade to a paid Render plan with "Persistent Disk". For a portfolio/demo project, the current setup is fine.
