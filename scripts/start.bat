@echo off
echo === Starting NGINX RTMP...
start nginx\nginx.exe

@REM echo === Starting backend (Java Servlet)...
@REM start scripts\run-backend.bat

echo === Starting FFmpeg to generate HLS and record MP4...
start scripts\runffmpeg.bat

echo === DONE. Open browser at http://localhost:8080/