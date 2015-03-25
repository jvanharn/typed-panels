@echo off

echo Build example: simple-panels
call tsc --out samples/simple-panels/js/app.js -t ES5 samples/simple-panels/application/application.ts

echo Build example: composed-panels
call tsc --out samples/composed-panels/js/app.js -t ES5 samples/composed-panels/application/application.ts

echo Done!
pause