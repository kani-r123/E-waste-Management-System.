# Trash2Tech — practical project

This project contains:
- React + Vite frontend
- Java 17 + Spring Boot REST API
- Spring Data JPA CRUD for demo items
- E-waste collection request form, saved requests, and Pending/Completed status
- H2 database for quick local/classroom demos
- Optional PostgreSQL profile for hosted persistent database
- A classroom-only login token demonstration (NOT a secure JWT implementation)

## Important
The default H2 database is in-memory. It is suitable for a quick demo but records reset when the backend restarts. For a public deployed version with persistent data, configure a PostgreSQL database and activate the `postgres` Spring profile. Do not put database passwords in frontend files or commit them to GitHub. The included login endpoint is not production authentication.

## Run in GitHub Codespaces (browser-based)
1. Extract this ZIP on your device.
2. Create a GitHub repository and upload the extracted project contents.
3. Open the repository, choose **Code → Codespaces → Create codespace on main**, if available on your account.
4. Open a terminal.

### Start backend
```bash
cd backend
mvn spring-boot:run
```
Wait for Spring Boot to say it started. In the Ports panel, make port `8080` public if needed and open it. Check `/api/health`, `/api/items`, and `/api/requests`.

### Start frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```
Open forwarded port `5173`. In Codespaces the Vite proxy forwards `/api` to port 8080. Keep both terminals running.

## Database
### Quick practical demo
The default configuration uses H2 in-memory. This needs no database server and starts automatically. It demonstrates JPA/database operations, but data is not permanent across restarts.

### Hosted persistent PostgreSQL
1. Create a PostgreSQL project with a managed provider such as Supabase.
2. In the provider's connection details, copy the PostgreSQL host, port, database, username and password. Use SSL.
3. In your deployed Java service set these environment variables:
   - `SPRING_PROFILES_ACTIVE=postgres`
   - `DB_JDBC_URL=jdbc:postgresql://YOUR_HOST:5432/YOUR_DATABASE?sslmode=require`
   - `DB_USER=YOUR_DATABASE_USERNAME`
   - `DB_PASSWORD=YOUR_DATABASE_PASSWORD`
4. Replace the example values with the provider's exact connection details. Never use the example host literally.
5. Redeploy and test by creating a request, refreshing, and checking the provider's table editor.

The database table `collection_requests` is created/updated by JPA on first successful startup.

## Public deployment outline
Deploy the backend as a Java web service on a host such as Render:
- Root directory: `backend`
- Build command: `mvn -DskipTests package`
- Start command: `java -jar target/trash2tech-backend-0.0.1-SNAPSHOT.jar`
- Add the database environment variables above.
- Keep the generated public backend URL, for example `https://YOUR-BACKEND.onrender.com`.

Deploy the frontend as a static site:
- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Build environment variable: `VITE_API_BASE_URL=https://YOUR-BACKEND.onrender.com`
- Replace that example with your actual backend URL, with no trailing slash.

After deploying, test the public frontend form and the backend URL `/api/health`. Free backend services may sleep when idle. Never claim deployment works until you have tested the live public link.

## API endpoints
- `GET /api/health` — health check
- `GET /api/items` — list demo items
- `POST /api/items` — create item
- `PUT /api/items/{id}` — update item
- `DELETE /api/items/{id}` — delete item
- `GET /api/requests` — list collection requests
- `POST /api/requests` — save a collection request
- `PUT /api/requests/{id}/status` — toggle Pending/Completed status
- `POST /api/auth/login` — classroom token-shaped demo only, not secure JWT

## Suggested practical screenshots
1. Trash2Tech frontend with collection request form.
2. Successful request displayed under Saved requests.
3. `/api/requests` JSON response.
4. Database table showing saved request (for persistent PostgreSQL setup).
5. `/api/health` response.
6. GitHub repository and actual deployed URL, if deployment is completed.
