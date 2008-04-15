// ==UserScript==
// @name GoogleTest
// @namespace http://gandrew.com/projects/MonkeyTest
// @description Tests for 'Google' greasemonkey library
// @include http://www.google.com/
//
// @require ../../dist/MonkeyTest.js
// @require Google.js
// @require GoogleTest.js
// ==/UserScript==

TestManager.runner = new SimpleTestRunner();
TestManager.runner.testInNewWindow = true;

TestManager.run();
