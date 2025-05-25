# devgrid-tree

A full-stack, real-time tree management app built with Next.js, Prisma, and MUI for the DevGrid programming challenge.

---

## 📋 Project Requirements

> **DevGrid Programming Challenge**
> Objective: Demonstrate your knowledge of several technologies, including databases, backend design, and UI/UX by creating a live-updating tree view as a web application.

- Tree structure with a root node and any number of “factories”
- Factories generate up to 15 random-number children
- Factories and children are created via user input (button, etc.)
- Factories have adjustable name, removable, and adjustable bounds
- All users see changes live (no polling/refresh)
- State is persistent (database-backed)
- Regenerating children replaces all previous children
- Secure, input-validated, and protected against injections
- Hosted on the web (AWS, Heroku, Vercel, etc.)
- Both frontend and backend codebases
- Uses a database (not Firebase)
- Source code and live link submitted to DevGrid

---

## 🚀 Getting Started

### 1. **Clone and Install**

```bash
git clone https://github.com/yourusername/devgrid-tree.git
cd devgrid-tree
npm install
```

### 2. **Environment Variables**

Copy `.env.example` to `.env.local` and fill in any required values (see below).

### 3. **Database Setup**

```bash
npx prisma migrate dev --name init
```

### 4. **Run the Development Server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## 🐳 Docker

To build and run with Docker:

```bash
docker build -t devgrid-tree .
docker run -p 3000:3000 -p 4000:4000 --env-file .env.local devgrid-tree
```

- The default Dockerfile uses SQLite for local development.
- For production, set your `DATABASE_URL` to a Postgres or other production database.

---

## 🗂️ Project Structure

```
/src
  /app            # Next.js App Router pages and API routes
    /components   # Reusable React components (tables, forms, dialogs, etc.)
    /api          # API endpoints (RESTful, with Prisma)
  /lib            # Prisma client and utilities
/types            # Shared TypeScript types
```

---

## ✨ Features

- Real-time, persistent tree view of factories and children
- CRUD operations for factories (create, update, delete, rename, adjust bounds)
- Random number generation for children (up to 15 per factory)
- Live updates across all browsers via socket events (no polling)
- Accessible, responsive UI (MUI + Tailwind)
- Input validation and security best practices
- Comprehensive tests (Jest, React Testing Library)
- Docker support for easy deployment

---

## ⚙️ Tech Stack

- [Next.js 15+](https://nextjs.org/)
- [React 19+](https://react.dev/)
- [Prisma ORM](https://www.prisma.io/)
- [SQLite/Postgres](https://www.postgresql.org/) (default: SQLite for dev)
- [MUI (Material UI)](https://mui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/)
- [socket.io-client](https://socket.io/)
- [Docker](https://www.docker.com/)

---

## 🧪 Testing

- **Run all tests:**
  ```bash
  npm test
  ```
- All external network calls are mocked for reliability.
- Coverage includes API endpoints and UI flows.

---

## 🛠️ Useful Scripts

- `npm run dev` — Start Next.js in development mode
- `npm run dev:all` — Start Next.js and the socket server together (for full local experience)
- `npm run build` — Build for production
- `npm run start` — Start Next.js in production mode
- `npm run start:all` — Start Next.js and the socket server in production mode
- `npm run test` — Run all tests
- `npm run lint` — Run ESLint
- `npm run format` — Format code with Prettier
- `npm run seed` — Seed the database
- `npm run socket` — Run the socket server only

---

## 🛠️ Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```
2. **Start the production server:**
   ```bash
   npm start
   ```
3. **Set environment variables** in your production environment (see `.env.example`).
4. **Recommended hosting:**
   - [Vercel](https://vercel.com/) (Next.js native)
   - [Render](https://render.com/), [Fly.io](https://fly.io/), [Heroku](https://heroku.com/)

---

## 📄 License

MIT

---

## 👤 Author

- [Molly McDonough](https://github.com/mollyamcdonough)

---

## 📢 Notes

- Please see the original challenge prompt above for requirements.
- If you have any questions or feedback, feel free to reach out!

---

## 📝 Example `.env.example`

```env
# .env.example

# Database connection string (SQLite for dev, Postgres for prod)
DATABASE_URL="file:./dev.db"
# For Postgres, use:
# DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# (Optional) Node environment
NODE_ENV=development

# (Optional) Socket server port (if configurable)
SOCKET_PORT=4000

# (Optional) Next.js port (if running outside Docker)
PORT=3000
```
