# Contributing to OmniForge AI

Thank you for your interest in contributing to OmniForge AI! We welcome contributions from developers, designers, product managers, and community members. This guide will help you get started.

---

## 🎯 Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read our [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) and adhere to its principles.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git
- GitHub account

### Setup Development Environment

```bash
# 1. Fork the repository
# Visit https://github.com/ChaitanyaJoshi1769/OmniForgeAI and click "Fork"

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/OmniForgeAI.git
cd OmniForgeAI

# 3. Add upstream remote
git remote add upstream https://github.com/ChaitanyaJoshi1769/OmniForgeAI.git

# 4. Install dependencies
npm install

# 5. Setup environment
cp .env.example .env.local

# 6. Start development environment
docker-compose up -d
npm run db:migrate
npm run dev
```

---

## 📋 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout develop
git pull upstream develop
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring
- `test/description` - Tests
- `perf/description` - Performance improvements

### 2. Make Your Changes

```bash
# Make code changes, following the style guide (see below)

# Run linting
npm run lint

# Run tests
npm run test

# Type checking
npm run type-check

# Format code
npm run format
```

### 3. Commit Your Changes

**Commit message format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without new features or fixes
- `perf`: Performance improvements
- `test`: Tests
- `chore`: Build process, dependencies, etc.
- `ci`: CI/CD changes

**Example:**
```
feat(auth): add two-factor authentication

Implement TOTP-based 2FA for user accounts.
Users can now enable 2FA in account settings.

Closes #123
```

### 4. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Visit the repository and click "Create Pull Request". Fill in the template with:
- Description of changes
- Related issues
- Type of change
- Testing done
- Screenshots (if applicable)

---

## 🎨 Code Style Guide

### TypeScript/JavaScript

```typescript
// ✅ Good
export const getUserById = async (id: string): Promise<User> => {
  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
};

// ❌ Avoid
export async function getUserById(id) {
  try {
    const u = await User.findById(id);
    if (!u) return null;
    return u;
  } catch (e) {
    console.log(e);
  }
}
```

**Rules:**
- Use `const` by default, `let` when necessary
- Prefer arrow functions for callbacks
- Use explicit return types for exported functions
- Add JSDoc comments for public APIs
- No unused variables or imports
- Use descriptive variable names

### React/TSX

```typescript
// ✅ Good
interface UserCardProps {
  user: User;
  onClick?: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};

// ❌ Avoid
export const UserCard = (props) => (
  <div className="card" onClick={() => props.onClick?.()}>
    <h2>{props.user.name}</h2>
  </div>
);
```

**Rules:**
- Use functional components with hooks
- Define prop interfaces/types
- Use React.FC for components
- Memoize components when necessary
- Keep components small and focused

### Naming Conventions

```typescript
// Files
- components/UserCard.tsx
- services/userService.ts
- hooks/useAuth.ts
- types/user.types.ts
- constants/api.constants.ts

// Variables & Functions
const MAX_RETRIES = 3; // Constants: UPPER_SNAKE_CASE
const userId = '123'; // Variables: camelCase
const getUserById = () => {}; // Functions: camelCase
const formatDate = () => {}; // Utilities: verb + Noun

// Classes & Interfaces
class UserService {} // Classes: PascalCase
interface User {} // Interfaces: PascalCase
type UserProps = {} // Types: PascalCase
```

---

## 🧪 Testing

### Test Coverage Requirements

- **Minimum coverage**: 80%
- **Critical paths**: 100%
- **All public APIs**: Must have tests

### Writing Tests

```typescript
describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  describe('getUserById', () => {
    it('should return a user when user exists', async () => {
      const userId = '123';
      const user = await service.getUserById(userId);
      expect(user.id).toBe(userId);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const userId = 'non-existent';
      expect(() => service.getUserById(userId)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov

# Run tests for specific package
npm run test -- --testPathPattern=auth
```

---

## 📚 Documentation

### Code Documentation

```typescript
/**
 * Generates a JWT token for the given user.
 *
 * @param user - The user to generate a token for
 * @param expiresIn - Token expiration time (default: 7 days)
 * @returns A JWT token string
 * @throws InvalidUserException if user is invalid
 *
 * @example
 * const token = generateToken(user, '24h');
 */
export const generateToken = (
  user: User,
  expiresIn: string = '7d'
): string => {
  // implementation
};
```

### File Documentation

Each significant file should include:

```typescript
/**
 * Authentication service for handling user authentication and authorization.
 * Supports JWT tokens, OAuth providers, and multi-factor authentication.
 *
 * @module auth/authService
 */
```

---

## 🔍 Pull Request Review

### What to Expect

1. **Automated Checks**
   - Linting and formatting
   - Type checking
   - Test coverage
   - Build verification
   - Security scanning

2. **Code Review**
   - Architecture alignment
   - Code quality
   - Test coverage
   - Documentation
   - Performance implications

3. **Approval Requirements**
   - ✅ All checks passing
   - ✅ At least 2 approvals (1 for docs)
   - ✅ No requested changes
   - ✅ Tests included

### Responding to Feedback

- Be respectful and open to suggestions
- Ask for clarification if needed
- Make requested changes promptly
- Re-request review after making changes
- Ping reviewers if needed

---

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What should happen

**Actual behavior**
What actually happens

**Environment**
- OS: [e.g. macOS 13.0]
- Node version: [e.g. 20.0.0]
- Browser: [e.g. Chrome 120]

**Screenshots**
If applicable, add screenshots

**Additional context**
Any other context
```

---

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Describe the problem

**Describe the solution you'd like**
How should this feature work?

**Describe alternatives you've considered**
Other possible solutions

**Additional context**
Wireframes, examples, or other context
```

---

## 🎓 Development Tips

### Useful Commands

```bash
# Start backend in debug mode
DEBUG=* npm run dev:backend

# Run specific test file
npm run test -- auth.spec.ts

# Generate API documentation
npm run docs

# Check for circular dependencies
npm run lint:circular

# Profile application performance
npm run profile

# Database operations
npm run db:migrate        # Run migrations
npm run db:migrate:undo   # Undo last migration
npm run db:seed           # Seed database
npm run db:reset          # Reset database
```

### Architecture Decisions

When making significant changes, please:

1. Document your decision in an ADR (Architecture Decision Record)
2. Add it to `/docs/adr/`
3. Reference it in your PR

---

## 📚 Resources

- [Development Guide](./docs/DEVELOPER_GUIDE.md)
- [Architecture Documentation](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Roadmap](./ROADMAP.md)

---

## ✅ Checklist Before Submitting PR

- [ ] Code follows style guide
- [ ] No console.log or debugger statements
- [ ] Added tests for new functionality
- [ ] Tests pass locally
- [ ] Added/updated documentation
- [ ] No breaking changes (or documented)
- [ ] Commit messages follow convention
- [ ] No large files added
- [ ] Performance impact considered

---

## 🎉 Recognition

Contributors will be recognized in:
- GitHub [Contributors page](https://github.com/ChaitanyaJoshi1769/OmniForgeAI/graphs/contributors)
- Release notes
- CONTRIBUTORS.md file

---

## ❓ Questions?

- 📖 Check the [FAQ](./docs/FAQ.md)
- 💬 Open a [GitHub Discussion](https://github.com/ChaitanyaJoshi1769/OmniForgeAI/discussions)
- 🐛 File an [Issue](https://github.com/ChaitanyaJoshi1769/OmniForgeAI/issues)
- 💬 Join our [Discord community](https://discord.gg/omniforge)

---

## 📜 License

By contributing to OmniForge AI, you agree that your contributions will be licensed under its Apache License 2.0.

---

**Thank you for contributing to OmniForge AI! 🙏**
