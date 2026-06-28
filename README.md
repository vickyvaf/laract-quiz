# Laract Quiz - Laravel & React Quiz Application

Laract Quiz is an interactive online quiz application built using **Laravel 13**, **React 19**, **Inertia.js v3**, and **Tailwind CSS v4**. This application supports two main user roles: **Admin** (to manage quizzes and the question bank) and **Student** (to attempt quizzes with an active countdown timer).

---

## Key Features

- **Authentication & Authorization**: Registration, login, and role-based access control managed via Laravel Fortify.
- **Admin Panel**:
  - CRUD Quizzes (with time limit configuration).
  - CRUD Questions (supports both Multiple Choice and Essay types).
- **Student Workspace**:
  - List of available quizzes.
  - Quiz attempt page featuring a real-time countdown timer.
  - Instant quiz results with correct/incorrect answer breakdowns.
- **Wayfinder Route Integration**: Automatic TypeScript routing functions mapped to Laravel controllers.

---

## System Requirements

- PHP >= 8.3
- Node.js >= 18.0 & npm / pnpm
- Composer
- MySQL >= 8.0

---

## Installation Steps

1. **Clone the repository and navigate into the project directory**:
   ```bash
   cd laract-quiz
   ```

2. **Copy the environment configuration file**:
   ```bash
   cp .env.example .env
   ```

3. **Configure the Database**:
   - Create a MySQL database named `laract_quiz`.
   - Open your `.env` file and configure the database credentials under `DB_*` settings:
     ```env
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=laract_quiz
     DB_USERNAME=your_username
     DB_PASSWORD=your_password
     ```

4. **Run the automatic setup script** (recommended):
   ```bash
   composer run setup
   ```
   *This script automatically installs PHP & Node.js dependencies, generates the application key, runs database migrations, and builds frontend assets.*

5. **Run the database seeder** to populate demo users and sample quizzes:
   ```bash
   php artisan db:seed
   ```

---

## Running the Application

This application uses Laravel Artisan Dev Server and Vite. You can run both development servers concurrently using a single command:

```bash
composer run dev
```

Open your browser and navigate to:
- **URL**: [http://localhost:8000](http://localhost:8000)

---

## Demo Accounts (Seeder)

Use the following credentials to test the application after running the database seeder (`php artisan db:seed`):

### 1. Admin Account (Access Quiz & Question Management)
- **Email**: `admin@laract.com`
- **Password**: `password`

### 2. Student Account (Access Quiz Workspace)
- **Email**: `student@laract.com`
- **Password**: `password`
