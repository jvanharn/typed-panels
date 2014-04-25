@echo off

echo Build framework
call tsc --out dist/typed.js -d -t ES5 make-framework.ts
call ajaxmin dist/typed.js -o dist/typed.min.js -clobber

echo Build lightweight (basic panels only) version
call tsc --out dist/typed.panels.js -d -t ES5 make-panels.ts
call ajaxmin dist/typed.panels.js -o dist/typed.panels.min.js -clobber

echo  
echo Done!
pause