// server.js
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// MCP SDK (Streamable HTTP)
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", exposedHeaders: ["Mcp-Session-Id"], allowedHeaders: ["Content-Type","mcp-session-id"] }));

// __dirname helper
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// utils
const readLessons = async () => {
  const raw = await fs.readFile(path.join(__dirname, "lessons.json"), "utf8");
  return JSON.parse(raw);
};
const escapeHtml = (s = "") =>
  String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

/* -------------------------------------------------------
   Static: SDK demo, Manifest, OpenAPI, Logo
------------------------------------------------------- */
app.use("/sdk-app", express.static(path.join(__dirname, "sdk-app"), { maxAge: "5m" }));
app.use("/.well-known", express.static(path.join(__dirname, ".well-known"), { maxAge: "1h" }));

app.get("/openapi.json", (_req, res) => res.type("application/json").sendFile(path.join(__dirname, "openapi.json")));
app.get("/logo.png", (_req, res) => res.type("image/png").sendFile(path.join(__dirname, "logo.png")));

/* -------------------------------------------------------
   Simple pages + API (used by Actions)
------------------------------------------------------- */
app.get("/", async (_req, res) => {
  try {
    const lessons = await readLessons();
    const cards = lessons.map(l => `
      <a href="/lesson/${l.id}" style="text-decoration:none;color:inherit;">
        <div style="padding:16px;border:1px solid #eee;border-radius:12px;margin:10px 0;">
          <h3 style="margin:0 0 6px 0;">${escapeHtml(l.title)}</h3>
          <p style="margin:0;opacity:.85;">${escapeHtml(l.desc)}</p>
        </div>
      </a>`).join("");
    res.type("html").send(`<!doctype html><meta charset="utf-8"><title>Gradeless</title>
      <div style="font-family:system-ui,Arial;max-width:900px;margin:18px auto;padding:16px;">
        <h2>Gradeless — AI Video Tutorials</h2>
        <p><a href="/sdk-app/">Open the ChatGPT App view</a></p>
        ${cards}
      </div>`);
  } catch {
    res.type("text").send("Gradeless — healthy");
  }
});

app.get("/api/lessons", async (_req, res) => {
  try { res.json(await readLessons()); }
  catch { res.status(500).json({ error: "Unable to load lessons" }); }
});

app.get("/lesson/:id", async (req, res) => {
  try {
    const lessons = await readLessons();
    const lesson = lessons.find(l => String(l.id) === String(req.params.id));
    if (!lesson) return res.status(404).type("text").send("Lesson not found");
    const embedUrl = `https://www.youtube.com/embed/${lesson.youtube_id}`;
    res.type("html").send(`<!doctype html><meta charset="utf-8"><title>${escapeHtml(lesson.title)}</title>
      <div style="font-family:system-ui,Arial;max-width:900px;margin:18px auto;padding:16px;">
        <h2>${escapeHtml(lesson.title)}</h2>
        <p>${escapeHtml(lesson.desc)}</p>
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;">
          <iframe src="${embedUrl}" allowfullscreen
            style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"></iframe>
        </div>
        <p><a href="/">Back</a></p>
      </div>`);
  } catch {
    res.status(500).type("text").send("Server error");
  }
});

/* ==================================================================
   🔵 MCP SERVER (minimal + validator-safe)
   Tools:
     show_lessons  -> returns inline list (text/html+skybridge)
     open_lesson   -> returns inline player (text/html+skybridge)
   No Zod, no _meta, plain JSON Schema
================================================================== */
const mcp = new McpServer({ name: "gradeless-mcp", version: "1.0.0" });

// Inline HTML templates
const listHtml = (lessons) => `\
<div style="font-family: system-ui, Arial; max-width: 900px; padding: 8px;">
  <h3 style="margin: 6px 0;">Gradeless Lessons</h3>
  <div style="display:flex;flex-direction:column;gap:10px;">
    ${lessons.map(l => `
      <div style="border:1px solid #eee;border-radius:12px;padding:12px;">
        <div style="font-weight:600;margin-bottom:6px;">${escapeHtml(l.title)}</div>
        <div style="opacity:.85;margin-bottom:10px;">${escapeHtml(l.desc)}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button data-id="${l.id}" style="padding:8px 12px;border:1px solid #ddd;border-radius:8px;cursor:pointer;">Open lesson</button>
          <a href="/lesson/${l.id}" target="_blank" style="padding:8px 12px;border:1px solid #ddd;border-radius:8px;text-decoration:none;color:inherit;">Open in tab</a>
        </div>
      </div>
    `).join("")}
  </div>
  <script type="module">
    const root = document.currentScript.parentElement;
    root.addEventListener('click', (e) => {
      const id = e.target?.getAttribute('data-id');
      if (id && window.openai?.invokeTool) {
        window.openai.invokeTool('open_lesson', { id });
      }
    });
  </script>
</div>`;

const playerHtml = (lesson) => `\
<div style="font-family: system-ui, Arial; max-width: 900px; padding: 8px;">
  <div style="font-weight:700;margin:6px 0;">${escapeHtml(lesson.title)}</div>
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:8px 0;">
    <iframe allowfullscreen
      src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(lesson.youtube_id)}"
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"></iframe>
  </div>
  <div style="opacity:.9;">${escapeHtml(lesson.desc)}</div>
</div>`;

// show_lessons
mcp.registerTool(
  "show_lessons",
  {
    description: "Show a list of all available AI tutorial lessons",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  async () => {
    try {
      const lessons = await readLessons();
      const lessonList = lessons.map(l =>
        `• ${l.title} (ID: ${l.id})\n  ${l.desc}`
      ).join('\n\n');

      return {
        content: [{
          type: "text",
          text: `Here are the available Gradeless AI tutorial lessons:\n\n${lessonList}\n\nTo watch a lesson, use open_lesson with the lesson ID.`
        }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error loading lessons: ${error.message}` }]
      };
    }
  }
);

// open_lesson
mcp.registerTool(
  "open_lesson",
  {
    description: "Open and display a specific lesson video by its ID",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "The lesson ID (e.g., l1, l2, l3, l4)"
        }
      },
      required: ["id"]
    }
  },
  async (args) => {
    try {
      const id = args?.id || args;
      const lessons = await readLessons();
      const lesson = lessons.find(l => String(l.id) === String(id));

      if (!lesson) {
        return {
          content: [{
            type: "text",
            text: `Lesson '${id}' not found. Available IDs: l1, l2, l3, l4`
          }]
        };
      }

      const videoUrl = `https://gradeless-chatgpt-connector.onrender.com/lesson/${lesson.id}`;
      return {
        content: [{
          type: "text",
          text: `**${lesson.title}**\n\n${lesson.desc}\n\nWatch here: ${videoUrl}\n\nYouTube: https://www.youtube.com/watch?v=${lesson.youtube_id}`
        }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error opening lesson: ${error.message}` }]
      };
    }
  }
);

// Custom MCP handler for ChatGPT compatibility
app.post("/mcp", async (req, res) => {
  try {
    const body = req.body;
    console.log("MCP Request:", JSON.stringify(body));

    // Handle tools/call method
    if (body.method === "tools/call") {
      const toolName = body.params?.name;
      const args = body.params?.arguments || {};

      if (toolName === "show_lessons") {
        const lessons = await readLessons();
        const lessonList = lessons.map(l =>
          `• ${l.title} (ID: ${l.id})\n  ${l.desc}`
        ).join('\n\n');

        res.json({
          jsonrpc: "2.0",
          id: body.id,
          result: {
            content: [{
              type: "text",
              text: `Here are the available Gradeless AI tutorial lessons:\n\n${lessonList}\n\nTo watch a lesson, ask me to open it by name or ID.`
            }]
          }
        });
        return;
      }

      if (toolName === "open_lesson") {
        const id = args.id;
        const lessons = await readLessons();
        const lesson = lessons.find(l => String(l.id) === String(id));

        if (!lesson) {
          res.json({
            jsonrpc: "2.0",
            id: body.id,
            result: {
              content: [{
                type: "text",
                text: `Lesson '${id}' not found. Available IDs: l1, l2, l3, l4`
              }]
            }
          });
          return;
        }

        const videoUrl = `https://gradeless-chatgpt-connector.onrender.com/lesson/${lesson.id}`;
        res.json({
          jsonrpc: "2.0",
          id: body.id,
          result: {
            content: [{
              type: "text",
              text: `**${lesson.title}**\n\n${lesson.desc}\n\nWatch here: ${videoUrl}\n\nYouTube: https://www.youtube.com/watch?v=${lesson.youtube_id}`
            }]
          }
        });
        return;
      }

      res.json({
        jsonrpc: "2.0",
        id: body.id,
        error: { code: -32601, message: `Unknown tool: ${toolName}` }
      });
      return;
    }

    // Handle tools/list method
    if (body.method === "tools/list") {
      res.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          tools: [
            {
              name: "show_lessons",
              description: "Show a list of all available AI tutorial lessons",
              inputSchema: {
                type: "object",
                properties: {}
              }
            },
            {
              name: "open_lesson",
              description: "Open and display a specific lesson video by its ID",
              inputSchema: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    description: "The lesson ID (e.g., l1, l2, l3, l4)"
                  }
                },
                required: ["id"]
              }
            }
          ]
        }
      });
      return;
    }

    // Handle initialize method
    if (body.method === "initialize") {
      res.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: "gradeless-mcp",
            version: "1.0.0"
          }
        }
      });
      return;
    }

    res.json({
      jsonrpc: "2.0",
      id: body.id,
      error: { code: -32601, message: `Unknown method: ${body.method}` }
    });

  } catch (err) {
    console.error("MCP POST error:", err);
    res.status(500).json({
      jsonrpc: "2.0",
      id: req.body?.id || null,
      error: { code: -32000, message: err.message }
    });
  }
});

app.get("/mcp", async (req, res) => {
  res.json({
    name: "gradeless-mcp",
    version: "1.0.0",
    description: "MCP server for Gradeless AI tutorials",
    tools: ["show_lessons", "open_lesson"]
  });
});

// Optional warm-up endpoint
app.get("/mcp/health", (_req, res) => res.type("text").send("OK MCP"));

/* ------------------------------------------------------- */
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
