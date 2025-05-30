# mikro-orm-repro-2025-05-30

## Quickstart

1. Clone the repository:
   ```
   git clone https://github.com/blank5995/mikro-orm-repro-2025-05-30.git
   cd mikro-orm-repro-2025-05-30
   ```

2. Ensure Docker Desktop is running.

3. Install dependencies:
   ```
   pnpm i
   ```
   _Installs all project dependencies._

4. Create the database:
   ```
   pnpm db:setup
   ```
   _Starts the database container and initializes the database._

5. Pull the latest database schema:
   ```
   pnpm db:pull
   ```
   _Synchronizes the local schema with the database._

6. Delete the database:
   ```
   pnpm db:delete
   ```
   _Stops and removes the database container and data._

---
