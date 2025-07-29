@echo off
ffmpeg\bin\ffmpeg.exe -i rtmp://localhost/live/stream ^
-c:v libx264 -preset veryfast -crf 23 ^
-f hls -hls_time 2 -hls_list_size 5 -hls_flags delete_segments ^
nginx/html/hls/stream.m3u8 ^
-c copy recordings/output.mp4
