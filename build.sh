#!/bin/sh
tsc --out ./dist/typed.js -d -t ES5 make-framework.ts
tsc --out ./dist/typed.panels.js -d -t ES5 make-panels.ts