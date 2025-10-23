# Contributing to Gradeless ChatGPT Connector

Thank you for your interest in contributing to Gradeless! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on GitHub with:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Your environment details (Node.js version, OS, etc.)
- Screenshots if applicable

### Suggesting Enhancements

We love to hear your ideas! To suggest an enhancement:

1. Check if the suggestion already exists in Issues
2. Open a new issue with the label "enhancement"
3. Clearly describe the feature and its benefits
4. Explain any potential implementation approaches

### Pull Requests

We actively welcome your pull requests!

#### Process

1. **Fork the repository** and create your branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write clear, concise code
   - Follow existing code style and conventions
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**:
   ```bash
   npm start
   # Test all endpoints and functionality
   ```

4. **Commit your changes**:
   ```bash
   git commit -m "Add: Brief description of your changes"
   ```
   - Use clear commit messages
   - Follow format: `Add:`, `Fix:`, `Update:`, `Remove:`

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**:
   - Provide a clear title and description
   - Reference any related issues
   - Explain what changes you made and why

#### Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Ensure code is properly formatted
- Update README.md if you change functionality
- Make sure all endpoints still work
- Test with both local server and after deployment

## Code Style

### JavaScript

- Use ES6+ modern JavaScript syntax
- Use `const` and `let` instead of `var`
- Use arrow functions where appropriate
- Add JSDoc comments for functions
- Keep functions small and focused

### Example

```javascript
/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} s - The string to escape
 * @returns {string} Escaped string
 */
const escapeHtml = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
```

### JSON

- Use 2 spaces for indentation
- Always use double quotes
- Validate JSON before committing

### File Structure

- Keep related files together
- Use clear, descriptive file names
- Maintain the existing directory structure

## Adding New Lessons

To add new video lessons to Gradeless:

1. **Edit `lessons.json`**:
   ```json
   {
     "id": "l5",
     "title": "Your Lesson Title",
     "desc": "Clear, concise description of the lesson content",
     "youtube_id": "YouTube_Video_ID"
   }
   ```

2. **Requirements**:
   - ID must be unique (use sequential format: l1, l2, l3, etc.)
   - Title should be clear and descriptive
   - Description should be 1-2 sentences
   - YouTube ID must be valid and publicly accessible

3. **Test the lesson**:
   - Start the server: `npm start`
   - Visit: `http://localhost:3000`
   - Click on your new lesson
   - Verify video plays correctly

## Testing

### Manual Testing Checklist

Before submitting a PR, please test:

- [ ] Server starts without errors
- [ ] All API endpoints respond correctly
- [ ] Web interface loads and displays lessons
- [ ] Individual lesson pages work
- [ ] Videos embed and play correctly
- [ ] MCP endpoints respond properly
- [ ] OpenAPI specs are valid JSON
- [ ] No console errors in browser

### API Testing

```bash
# Test lessons endpoint
curl http://localhost:3000/api/lessons

# Test specific lesson
curl http://localhost:3000/lesson/l1

# Test MCP health
curl http://localhost:3000/mcp/health
```

## Documentation

When making changes, please update:

- **README.md**: If you add features or change setup
- **Code comments**: For complex logic
- **OpenAPI specs**: If you modify API endpoints
- **This file**: If you change contribution process

## Areas for Contribution

We especially welcome contributions in these areas:

### Features

- [ ] Search functionality for lessons
- [ ] Category/tag system for lessons
- [ ] User progress tracking
- [ ] Lesson recommendations
- [ ] Playlist support
- [ ] Comments or notes on lessons
- [ ] Dark mode for web interface

### Technical Improvements

- [ ] Add automated tests (Jest, Mocha)
- [ ] Improve error handling
- [ ] Add logging system
- [ ] Performance optimizations
- [ ] Add caching layer
- [ ] Database integration for lessons
- [ ] User authentication

### Documentation

- [ ] API usage examples
- [ ] Video tutorials on setup
- [ ] Translation to other languages
- [ ] Troubleshooting guide
- [ ] Architecture documentation

### Design

- [ ] Improve UI/UX of web interface
- [ ] Mobile-responsive improvements
- [ ] Accessibility enhancements
- [ ] Custom theme support

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect differing opinions and experiences
- Accept responsibility and apologize for mistakes

### Communication

- Use clear, professional language
- Be patient with responses
- Ask questions if something is unclear
- Provide context in issues and PRs

## Development Setup

### Prerequisites

```bash
node --version  # Should be >=18 and <23
npm --version
```

### Local Development

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/-gradeless-chatgpt-connector.git
cd -gradeless-chatgpt-connector

# Install dependencies
npm install

# Start development server
npm start
```

### Environment Variables

Create a `.env` file if needed:

```bash
PORT=3000
NODE_ENV=development
```

## Release Process

Maintainers will handle releases. Version numbering follows [SemVer](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## Recognition

Contributors will be recognized in:

- GitHub contributors list
- Release notes for significant contributions
- README acknowledgments section

## Questions?

If you have questions about contributing:

1. Check existing [Issues](https://github.com/GoPgb015/-gradeless-chatgpt-connector/issues)
2. Open a new issue with the "question" label
3. Email: gourab.chatterjee.25n@jaipuria.ac.in

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Gradeless! Your efforts help make AI education more accessible to everyone.
