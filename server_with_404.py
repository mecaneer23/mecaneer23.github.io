#!/usr/bin/env python3
"""
Run a local web server which supports 404 responses
"""

import http.server
import socketserver
from pathlib import Path

PORT = 5500


class Handler404(http.server.SimpleHTTPRequestHandler):
    """
    SimpleHTTPRequestHandler that handles a 404 response
    using a `404.html` file in the root site directory
    """
    def do_GET(self) -> None:  # noqa: N802
        if Path(self.translate_path(self.path)).exists():
            super().do_GET()
            return
        self.send_response(404)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        try:
            with Path("404.html").open("rb") as file:
                self.wfile.write(file.read())
        except FileNotFoundError:
            self.wfile.write(b"404 - 404 File Not Found")


with socketserver.TCPServer(("", PORT), Handler404) as httpd:
    print(f"Server running at http://localhost:{PORT}")  # noqa: T201
    httpd.serve_forever()
