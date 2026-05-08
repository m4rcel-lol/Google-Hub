# Google Hub Git

Google Hub Git is a lightweight custom Git instance. It stores bare repositories on disk, serves real Git smart HTTP for `git clone`, `git fetch`, and `git push`, and exposes a small forge-style web UI for browsing repositories, branches, files, commits, contributors, and language stats.

It is intentionally smaller than Forgejo: no database, no background workers, no CI, no federation, and no pull request engine. The core Git hosting path is first-party and does not depend on Forgejo, Gitea, or GitHub.

## Features

- Create local repositories from the web UI or REST API.
- Clone and push over standard Git HTTPS endpoints: `https://host/owner/repo.git`.
- Browse local repositories through a Gitea/GitHub-like REST API.
- Persist repositories as bare Git directories under `GIT_ROOT`.
- Start with no admin account; create the first admin from inside the container.
- Protect repository creation and pushes with admin username/password auth.
- Deploy with Docker Compose and Caddy.
- Optionally browse GitHub/Gitea/Forgejo/Codeberg repositories in read-only mode.

## Local Development

Prerequisites:

- Node.js 22 or newer
- Git

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`.

Create the first local admin user before creating repositories:

```bash
ADMIN_USERNAME=admin ADMIN_PASSWORD="$(openssl rand -base64 24)" npm run admin:create
```

## Docker Compose

```bash
cp .env.example .env
docker compose up --build -d
```

The instance starts without any write-capable account. Create the first admin user with `docker compose exec`:

```bash
docker compose exec \
  -e ADMIN_USERNAME=admin \
  -e ADMIN_PASSWORD="$(openssl rand -base64 24)" \
  google-hub npm run admin:create
```

Local Caddy defaults to `http://localhost`. For production:

```env
SITE_ADDRESS=git.example.com
PUBLIC_BASE_URL=https://git.example.com
```

Caddy will terminate HTTPS for real domains and reverse proxy the app.

## Git Usage

Create a repository in the UI, then use the clone URL shown in the Code menu.

```bash
git clone http://localhost/main/project.git
cd project
echo "# project" > README.md
git add README.md
git commit -m "Initial commit"
git push origin main
```

Push authentication uses HTTP Basic auth with the admin username and password created by `npm run admin:create`. A non-interactive push URL also works:

```bash
git remote set-url origin http://admin:YOUR_ADMIN_PASSWORD@localhost/main/project.git
git push origin main
```

## API

Health:

```bash
curl http://localhost/api/v1/health
```

Create a repository:

```bash
curl -X POST http://localhost/api/v1/repos \
  -u admin:YOUR_ADMIN_PASSWORD \
  -H "Content-Type: application/json" \
  -d '{"owner":"main","name":"project","description":"Example repo"}'
```

List repositories:

```bash
curl http://localhost/api/v1/repos
```

Browse contents:

```bash
curl http://localhost/api/v1/repos/main/project/contents
curl http://localhost/api/v1/repos/main/project/contents/README.md
```

## Verification

```bash
npm run lint
npm run build
npm run test:smoke
```

The smoke test starts a temporary instance, creates a repository, pushes a commit over Git HTTP, verifies the REST browsing API, and performs a public clone.
