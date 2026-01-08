# 🚀 Deployment Guide - Wingspan Online

## Deploy to Render.com (Recommended - FREE)

### Why Render?
- ✅ **Free tier** with 750 hours/month
- ✅ **Full WebSocket support** (Socket.IO works perfectly)
- ✅ **Auto-deploy from GitHub**
- ✅ **Zero configuration needed**
- ⚠️ **Free tier sleeps after 15min** (~30s wake time on first visit)

---

## 📋 Prerequisites

1. **GitHub account** with your code pushed
2. **Render.com account** (free) - Sign up at https://render.com

---

## 🎯 Quick Deploy (3 Minutes)

### **Step 1: Create Render Account**
1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (easiest)

### **Step 2: Create New Web Service**
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `varunish/Wingspan-online`
3. Grant Render access to the repo

### **Step 3: Configure Service**
Render should auto-detect settings, but verify:

| Setting | Value |
|---------|-------|
| **Name** | `wingspan-online` (or any name) |
| **Environment** | `Node` |
| **Branch** | `main` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Plan** | **Free** |

### **Step 4: Add Health Check (Optional)**
- **Health Check Path**: `/health`

### **Step 5: Deploy! 🎉**
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for initial build
3. Render will give you a URL: `https://wingspan-online-xxxx.onrender.com`

---

## 🎮 **Play with Friends!**

### Share Your Game URL:
```
https://your-app-name.onrender.com
```

### **Important Notes:**
1. **First load after sleep**: Takes ~30 seconds (free tier limitation)
2. **Keep it awake**: Visit every 15 minutes OR use a service like [UptimeRobot](https://uptimerobot.com) (free) to ping it every 5 minutes
3. **Wakes automatically**: When anyone visits the URL

---

## 🔧 Advanced: Custom Domain (Optional)

1. In Render dashboard → **Settings** → **Custom Domain**
2. Add your domain (e.g., `wingspan.yourdomain.com`)
3. Update DNS records as instructed

---

## 🐛 Troubleshooting

### **"Application failed to respond"**
- Wait 30 seconds (free tier is waking up)
- Check build logs in Render dashboard

### **WebSocket connection errors**
- Ensure you're using HTTPS (not HTTP) in production
- Check browser console for CORS errors

### **Game state resets**
- Free tier restarts can clear in-memory game state
- Upgrade to paid tier ($7/month) for persistent instances

### **View Logs**
- Render Dashboard → Your Service → **Logs** tab
- Real-time logs show all server activity

---

## 💰 Cost Breakdown

| Tier | Cost | Features |
|------|------|----------|
| **Free** | $0/mo | 750hrs, WebSockets, Auto-sleep |
| **Starter** | $7/mo | Always on, Custom domains |

**Recommendation**: Start free, upgrade if friends play often!

---

## 🔄 Auto-Deploy Setup

Once connected to GitHub, Render auto-deploys on every push to `main`:

1. Make code changes locally
2. Commit: `git commit -m "fix: something"`
3. Push: `git push origin main`
4. Render auto-deploys in 2-3 minutes! 🚀

---

## 🌐 Alternative: Vercel (Not Recommended)

**Why not?** Vercel's serverless functions have 10-second timeout, causing WebSocket disconnections during long games.

If you want to try anyway:
```bash
npm install -g vercel
vercel --prod
```

---

## 📊 Monitor Your App

**Free Monitoring Tools:**
- [UptimeRobot](https://uptimerobot.com) - Ping every 5min to keep awake
- [Render Dashboard](https://dashboard.render.com) - Built-in metrics
- Browser DevTools → Network tab - Check WebSocket status

---

## ✅ Post-Deployment Checklist

- [ ] App loads at Render URL
- [ ] Lobby creation works
- [ ] Multiplayer lobby join works
- [ ] Game starts successfully
- [ ] Bird cards render correctly
- [ ] Actions work (Gain Food, Play Bird, etc.)
- [ ] Round progression works
- [ ] Game end screen shows

---

## 🎉 You're Live!

Share your game URL with friends and start playing!

**Example:** "Join me for Wingspan at https://wingspan-online-xxxx.onrender.com"

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **Socket.IO Docs**: https://socket.io/docs/
- **Check server logs** in Render dashboard
