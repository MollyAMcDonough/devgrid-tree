# devgrid-tree

A full-stack, real-time tree management app built with Next.js, Prisma, TypeScript, Tailwind CSS, MUI, and Socket.IO for the DevGrid programming challenge.

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

## 🐳 Docker & Docker Compose

You can run the app with Docker or Docker Compose for local development and testing.

### **Single-Container Docker (uses SQLite)**

Build and run the app in a single container (with SQLite as the database):

```bash
docker build -t devgrid-tree .
docker run -p 3000:3000 -p 4000:4000 --env-file .env.local devgrid-tree
```

- This runs both the Next.js app (port 3000) and the socket server (port 4000) in one container.
- By default, this setup uses SQLite for local development.

---

### **Docker Compose (recommended for local development with Postgres)**

Run the app and a Postgres database together:

```bash
docker compose up --build
```

- This will:
  - Build and start the app (Next.js + socket server) on ports 3000 and 4000.
  - Start a Postgres database on port 5432.
  - Set up the database connection automatically via `DATABASE_URL`.
  - Persist database data in a Docker volume (`db_data`).

To stop and remove containers, networks, and volumes:

```bash
docker compose down
```

- The Compose setup is ideal for local development and testing with a real Postgres database.
- For production, set your `DATABASE_URL` to a managed Postgres or other production database.

---

**Note:**

- The default Dockerfile uses SQLite for local development if you run the app container by itself.
- The `docker-compose.yml` file sets up a Postgres database container and connects your app to it automatically.

## 🗂️ Project Structure

```
/src
  /app              # Next.js App Router pages and API routes
    /components     # Reusable React components (tables, forms, dialogs, etc.)
      /tests        # Component level tests
    /api/factories  # API endpoints (RESTful, with Prisma)
      /tests        # Backend tests on endpoints and sockets
    /tests          # Page level tests
  /lib              # Prisma client and utilities
/types              # Shared TypeScript types
```

---

## ✨ Features

- Real-time, persistent tree view of factories and children
- CRUD operations for factories (create, update, delete, rename, adjust bounds)
- Random number generation for children (up to 15 per factory)
- Live updates across all browsers via socket events (no polling)
- Accessible, responsive UI (MUI + Tailwind)
- Input validation and security best practices
- Proof of concept tests (Jest, React Testing Library)
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
- Proof of concept tests are included to demonstrate the testing setup and core functionality.
- Coverage includes API endpoints and some main UI flows. Would expand API, UI, and integration testing for an ongoing project.
- Tests are run against a separate test database (see .env.example for setup) and are configured for local development. With environment variables pointing to production, front end tests will fail.

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
3. **Set environment variables**
   - in your production environment (see `.env.example`).
   - The socket server URL is currently hardcoded in the frontend for deployment reliability on Render. In a larger scale project, a workaround to get the Render environment variable to propagate at the right step of the build should be implemented.

**If you deploy to a different host or domain, update the hardcoded socket server URL in `src/app/page.tsx` and `src/app/factories/[id]/page.tsx` to match your new socket server address.**

4. **Hosting:**
   - [Render](https://render.com/) for single host deployment. Vercel is recommended for static Next.js hosting, but doesn't support custom socket servers (websockets).

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

- See the .env.example file in the repo for required environment variables.
