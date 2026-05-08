# Google Hub Git

Google Hub Git is a lightweight custom Git instance. It stores bare repositories on disk, serves real Git smart HTTP for `git clone`, `git fetch`, and `git push`, and exposes a small forge-style web UI for browsing repositories, branches, files, commits, contributors, and language stats.

It is intentionally smaller than Forgejo: no database, no background workers, no CI, no federation, and no pull request engine. The core Git hosting path is first-party and does not depend on Forgejo, Gitea, or GitHub.

## Features

- Create local repositories from the web UI or REST API.
- Clone and push over standard Git HTTPS endpoints: `https://host/owner/repo.git`.
- Browse local repositories through a Gitea/GitHub-like REST API.
- Persist repositories as bare Git directories under `GIT_ROOT`.
- Protect repository creation and pushes with one `ADMIN_TOKEN`.
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

For local writes, set `ADMIN_TOKEN` before starting:

```bash
ADMIN_TOKEN="$(openssl rand -base64 32)" npm run dev
```

## Docker Compose

```bash
cp .env.example .env
# edit ADMIN_TOKEN before starting
docker compose up --build -d
```

Local Caddy defaults to `http://localhost`. For production:

```env
ADMIN_TOKEN=replace-with-a-long-random-secret
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

Push authentication uses HTTP Basic auth. Use any username and `ADMIN_TOKEN` as the password. A non-interactive push URL also works:

```bash
git remote set-url origin http://admin:YOUR_ADMIN_TOKEN@localhost/main/project.git
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
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
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
