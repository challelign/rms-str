@REM start pm2 start C:\NODEJS\backend_api\backend_api\server.js --max-memory-restart 100M --restart-delay=3000 --node-args="--max-old-space-size=16384" --watch --name Warp1
@REM pm2 start C:\NODEJS\legalPersonShareholder\server.js --max-memory-restart 100M --restart-delay=3000 --node-args="--max-old-space-size=16384" --watch --name Warp2


start abay-rms start D:\projects\rms\abay-rms\backend\NODEJS\backend_api\backend_api\server.js --max-memory-restart 100M --restart-delay=3000 --node-args="--max-old-space-size=16384" --watch --name Warp1
abay-rms start D:\projects\rms\abay-rms\backend\NODEJS\legalPersonShareholder\server.js --max-memory-restart 100M --restart-delay=3000 --node-args="--max-old-space-size=16384" --watch --name Warp2


