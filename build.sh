#!/bin/sh
tsc --out ./dist/typed.js -d -t ES5 make-framework.ts
tsc --out ./dist/typed.panels.js -d -t ES5 make-stripped.ts
minifyjs -m -i ./dist/typed.js -o ./dist/typed.min.js
minifyjs -m -i ./dist/typed.panels.js -o ./dist/typed.panels.min.js