@echo off

echo Build test suite...
call tsc --out specs.js -t ES5 make-specs.ts

echo Done!