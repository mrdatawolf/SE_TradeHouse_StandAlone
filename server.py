#!/usr/bin/env python3
"""
Simple HTTP server for SE TradeHouse Standalone
Run this to serve the app locally and avoid CORS issues
"""

import http.server
import socketserver
import os

PORT = 8000

# Change to the directory containing this script
os.chdir(os.path.dirname(os.path.abspath(__file__)))

Handler = http.server.SimpleHTTPRequestHandler

print(f"""
╔══════════════════════════════════════════════════════════╗
║         SE TradeHouse Standalone - Local Server         ║
╚══════════════════════════════════════════════════════════╝

Server running at: http://localhost:{PORT}

Open your browser and go to:
  → http://localhost:{PORT}

Press Ctrl+C to stop the server.
""")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServer stopped.")
