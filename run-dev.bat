@echo off
echo Fixing Next.js permissions issue...

REM Kill any running processes
taskkill /f /im node.exe /fi "windowtitle eq *" 2>nul

REM Remove .next directory
if exist .next rmdir /s /q .next 2>nul

REM Set environment variables to disable telemetry
set NEXT_TELEMETRY_DISABLED=1
set NODE_OPTIONS=--max_old_space_size=4096

REM Start development server
echo Starting development server...
npm run dev

pause