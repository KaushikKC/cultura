# First, create/update .gitignore
cat > .gitignore << 'EOL'
# Dependencies
/node_modules
/node_modules/
package-lock.json
yarn.lock

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
/dist
/build
/out

# Logs
/logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE and editor files
.idea/
.vscode/
*.swp
*.swo
.DS_Store

# Testing
/coverage

# Runtime data
/pids
*.pid
*.seed
*.pid.lock

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# Temporary files
/tmp
/temp
EOL

# Remove cached node_modules from git
git rm -r --cached node_modules
git rm -r --cached .env

# Stage and commit the changes
git add .gitignore
git commit -m "chore: update gitignore and remove node_modules"

# Optional: Clean and reinstall dependencies
rm -rf node_modules
npm install