#!/usr/bin/env python3

import http.server
import socketserver
import os

PORT = 5500


class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if os.path.exists(self.translate_path(self.path)):
            super().do_GET()
            return
        self.send_response(404)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        try:
            with open("404.html", "rb") as file:
                self.wfile.write(file.read())
        except FileNotFoundError:
            self.wfile.write(b"404 - 404 File Not Found")


with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print(f"Server running at http://localhost:{PORT}")
    httpd.serve_forever()
