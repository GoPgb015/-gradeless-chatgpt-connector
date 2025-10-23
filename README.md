# Gradeless - ChatGPT Connector

A ChatGPT plugin and MCP (Model Context Protocol) server for browsing and watching Gradeless AI video tutorials directly within ChatGPT.

## Overview

Gradeless provides an interactive way to discover and watch AI and Prompt Engineering tutorial videos through ChatGPT. This connector integrates YouTube educational content into your ChatGPT conversations, allowing seamless learning experiences.

## Features

- **ChatGPT Plugin Integration**: Works as a native ChatGPT plugin/GPT
- **MCP Server**: Implements Model Context Protocol for advanced interactions
- **Interactive Video Player**: Embedded YouTube videos with responsive design
- **RESTful API**: Clean API endpoints for lesson management
- **Web Interface**: Standalone web app for browsing lessons
- **OpenAPI Documentation**: Full API specification (OpenAPI 3.0.1 & 3.1.0)

## Current Lessons

1. **Introduction to Artificial Intelligence** - Basics, history, and real-world applications
2. **What is Prompt Engineering** - Understanding prompt engineering and LLMs
3. **Components of an Effective Prompt** - Context, role, tone, clarity, and constraints
4. **Testing Out Prompts with Google Gemini** - Hands-on experiments

## Installation

### Prerequisites

- Node.js >= 18 and < 23
- npm or yarn
- A GitHub account (for deployment)

### Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/GoPgb015/-gradeless-chatgpt-connector.git
   cd -gradeless-chatgpt-connector
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Access the application**:
   - Main page: http://localhost:3000
   - Web app: http://localhost:3000/sdk-app/
   - API: http://localhost:3000/api/lessons
   - MCP endpoint: http://localhost:3000/mcp

## API Endpoints

### REST API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Homepage with lesson cards |
| `/api/lessons` | GET | Returns JSON array of all lessons |
| `/lesson/:id` | GET | Display specific lesson with embedded video |
| `/openapi.json` | GET | OpenAPI specification |
| `/logo.png` | GET | Gradeless logo |
| `/.well-known/ai-plugin.json` | GET | ChatGPT plugin manifest |

### MCP Tools

| Tool | Description |
|------|-------------|
| `show_lessons` | Display interactive list of all lessons |
| `open_lesson` | Open and play a specific lesson by ID |

## Deployment

### Deploy to Render

1. **Create a new Web Service** on [Render](https://render.com)
2. **Connect your GitHub repository**
3. **Configure the service**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. **Deploy** and copy your service URL

### Deploy to Railway

1. **Create a new project** on [Railway](https://railway.app)
2. **Deploy from GitHub** repository
3. Railway will auto-detect Node.js and deploy
4. Copy your deployment URL

### Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. Follow the prompts and copy your deployment URL

## ChatGPT Plugin Configuration

After deploying your app:

1. **Update URLs** in the following files with your deployment URL:
   - `.well-known/ai-plugin.json` (line 10)
   - `.well-known/openapi.json` (line 10)
   - `openapi.json` (line 10)

2. **Add to ChatGPT**:
   - Go to ChatGPT → Settings → Beta Features
   - Enable "Plugins"
   - Go to Plugin Store → "Develop your own plugin"
   - Enter your domain: `https://your-app.onrender.com`

3. **Test the plugin** by asking ChatGPT to show Gradeless lessons

## Adding New Lessons

Edit `lessons.json` to add new video tutorials:

```json
{
  "id": "l5",
  "title": "Your Lesson Title",
  "desc": "Lesson description",
  "youtube_id": "YouTube_Video_ID"
}
```

## Project Structure

```
.
├── .well-known/
│   ├── ai-plugin.json      # ChatGPT plugin manifest
│   └── openapi.json        # OpenAPI spec for plugin
├── sdk-app/
│   └── index.html          # Web interface
├── lessons.json            # Lesson data
├── server.js               # Express server with MCP
├── package.json            # Dependencies
├── openapi.json            # OpenAPI 3.1.0 spec
├── openapi.yaml            # YAML version
├── logo.png                # App logo
└── .gitignore              # Git ignore rules
```

## Technology Stack

- **Backend**: Node.js, Express.js
- **MCP SDK**: @modelcontextprotocol/sdk
- **CORS**: Cross-origin resource sharing enabled
- **Standards**: OpenAPI 3.0.1 & 3.1.0

## Configuration

### Environment Variables

You can optionally set:

```bash
PORT=3000  # Server port (default: 3000)
```

### CORS Settings

Currently configured to allow all origins (`*`). For production, consider restricting to specific domains in `server.js:14`.

## Development

### Run in Development Mode

```bash
npm start
```

### Test API Endpoints

```bash
# Get all lessons
curl http://localhost:3000/api/lessons

# Get specific lesson
curl http://localhost:3000/lesson/l1

# Health check
curl http://localhost:3000/mcp/health
```

## Security

- All HTML output is escaped to prevent XSS attacks
- CORS configured for controlled access
- No sensitive data stored in repository
- Access tokens excluded via `.gitignore`

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Email**: gourab.chatterjee.25n@jaipuria.ac.in
- **GitHub**: [@GoPgb015](https://github.com/GoPgb015)
- **Repository**: [gradeless-chatgpt-connector](https://github.com/GoPgb015/-gradeless-chatgpt-connector)

## Acknowledgments

- Built with [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- Powered by OpenAI's ChatGPT platform
- Video content hosted on YouTube
- Deployed on Render

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/GoPgb015/-gradeless-chatgpt-connector/issues) page
2. Open a new issue with detailed information
3. Contact via email for urgent matters

---

Made with ChatGPT and Claude Code
