# PostgreSQL Client Installation Guide

## Windows Installation

### Option 1: Chocolatey (Recommended)

```bash
# Install Chocolatey if not already installed
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -Tls12; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install PostgreSQL
choco install postgresql
```

### Option 2: Official Installer

1. Download PostgreSQL installer: https://www.postgresql.org/download/windows/
2. Run installer
3. Select components: Command Line Tools
4. Complete installation

### Option 3: Portable Version

1. Download portable PostgreSQL: https://www.enterprisedb.com/download-postgresql-binaries
2. Extract to folder
3. Add to PATH

---

## Linux Installation

```bash
sudo apt update
sudo apt install postgresql-client
```

---

## macOS Installation

```bash
brew install postgresql
```

---

## Verify Installation

```bash
# Check psql version
psql --version

# Test connection (after Supabase setup)
psql -h db.xxx.supabase.co -U postgres -d postgres
```

---

## Notes

- **Windows:** Chocolatey is recommended for easy installation
- **Linux:** Use apt package manager
- **macOS:** Use Homebrew
- **Verification:** Run `psql --version` to confirm installation

---

**Status:** Manual action required
**Time:** 5-10 minutes
