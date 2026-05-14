# pg_dashboard

A desktop PostgreSQL administration tool built with [Wails](https://wails.io/), [Preact](https://preactjs.com/), and TypeScript.

---

## Features

- **Database connection** — Connect to any PostgreSQL instance with host, port, user, and password
- **Database browser** — List databases with size, owner, and table count
- **SQL editor** — Execute arbitrary queries and display results in a table
- **Log analyzer** — Analyze PostgreSQL log files with [pglogalyze](https://github.com/dalibo/pglogalyze), locally or over SSH
- **SSH support** — Connect to remote servers via SSH (password or private key)
- **Persistent config** — Connection and log settings are saved locally in the OS config directory

---

## Prerequisites

### Go & Wails

- [Go](https://golang.org/dl/) >= 1.21
- [Wails CLI](https://wails.io/docs/gettingstarted/installation)

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

### Node.js

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9

### System dependencies

- [pglogalyze](https://github.com/dalibo/pglogalyze) — must be installed and available in PATH (locally or on the remote server for SSH mode)

Verify your environment:

```bash
wails doctor
```

---

## Installation

```bash
git clone https://github.com/Antoine256/pg_dashboard.git
cd pg_dashboard
```

Install Go dependencies:

```bash
go mod tidy
```

Install frontend dependencies:

```bash
cd frontend
npm install
cd ..
```

---

## Development

Start the development server with hot reload:

```bash
wails dev
```

The app window will open automatically. The frontend hot-reloads on file changes; Go changes require a restart.

---

## Build

Build a production binary for the current platform:

```bash
wails build
```

The output binary is placed in `build/bin/`.

To build with a specific platform target:

```bash
# Windows
wails build -platform windows/amd64

# macOS
wails build -platform darwin/amd64

# Linux
wails build -platform linux/amd64
```

---

## Project structure

```
pg_dashboard/
├── app.go                  # App struct, Go backend logic
├── main.go                 # Wails entry point
├── go.mod
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Reusable UI components
│   │   │   ├── Dashboard.tsx
│   │   │   └── ...
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
└── wailsjs/                # Auto-generated Wails bindings (do not edit)
    └── go/
        └── app/
            ├── App.js
            └── App.d.ts
```

> **Note:** Never edit files inside `wailsjs/` manually — they are regenerated automatically by Wails on each `wails dev` or `wails build`.

---

## Configuration

The app saves its configuration automatically in the OS standard config directory:

| OS      | Path                                              |
|---------|---------------------------------------------------|
| Windows | `%APPDATA%\pg_dashboard\config.json`              |
| macOS   | `~/Library/Application Support/pg_dashboard/config.json` |
| Linux   | `~/.config/pg_dashboard/config.json`             |

The config stores the last used connection parameters and log file path.

---


## Tech stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Runtime  | [Wails v2](https://wails.io/)       |
| Backend  | Go + `database/sql` + `lib/pq`      |
| Frontend | Preact + TypeScript + Vite          |
| UI       | Tailwind CSS + Radix UI Themes      |
| Icons    | lucide-react                        |
| SSH      | `golang.org/x/crypto/ssh`           |
| Logs     | pglogalyze + ansi-to-html           |

---

## Regenerating Wails bindings

If you add or rename exported methods in `app.go`, regenerate the TypeScript bindings:

```bash
wails generate module
```

---

## License

MIT
