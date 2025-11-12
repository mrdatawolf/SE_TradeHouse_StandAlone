@echo off
echo ================================================================
echo   SE TradeHouse Standalone - Local Server (Windows)
echo ================================================================
echo.
echo Starting local web server...
echo.

REM Try Python 3 first
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python 3...
    python server.py
    goto :end
)

REM Try Python 2
python2 --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python 2...
    python2 -m SimpleHTTPServer 8000
    goto :end
)

REM Try py launcher
py --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using py launcher...
    py server.py
    goto :end
)

REM No Python found
echo ERROR: Python is not installed or not in PATH
echo.
echo Please install Python from https://www.python.org/downloads/
echo Or use one of the alternative methods in TROUBLESHOOTING.md
echo.
pause

:end
