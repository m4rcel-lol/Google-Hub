import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API proxy route for any git instance to bypass CORS
  app.use("/api/proxy", async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
      return res.status(400).json({ error: "Missing url parameter" });
    }
    
    try {
      const headers: Record<string, string> = {
        "User-Agent": "React-Example-App",
        "Accept": "application/json",
      };

      // Add tokens if necessary. Wait, mostly we just pass through.
      // If it's github API, we can inject token here.
      if (targetUrl.includes("api.github.com") && process.env.GITHUB_TOKEN) {
        headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
        headers["Accept"] = "application/vnd.github.v3+json";
      }

      console.log(`[Proxy] Fetching: ${targetUrl}`);
      
      const targetRes = await fetch(targetUrl, {
        method: req.method,
        headers,
      });

      // Forward ALL safe headers, to avoid client side fetch errors
      targetRes.headers.forEach((val, key) => {
        if (!['content-encoding', 'content-length', 'connection', 'transfer-encoding'].includes(key.toLowerCase())) {
          res.set(key, val);
        }
      });
      res.status(targetRes.status);
      res.set('Access-Control-Allow-Origin', '*'); // explicitly allow any origin just in case

      const text = await targetRes.text();
      res.send(text);
    } catch (e) {
      console.error("[Proxy Error]:", e);
      res.status(500).json({ message: "Internal server error during proxying." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // For Express 4 and 5, * serves index.html for SPA routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
