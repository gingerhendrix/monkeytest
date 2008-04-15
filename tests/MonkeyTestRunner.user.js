// ==UserScript==
//
// @name MonkeyTestRunner
// @description Unit tests for MonkeyTest
// @namespace http://www.gandrew.com/projects/MonkeyTest/
// @include http://localhost/workspace/monkeytest/tests/test.html
//
// @require lib/MonkeyTestNoExport.js
// @require ../dist/MonkeyTest.js
// @require lib/GreasemonkeyAdapter.js
//
// @require ../js/Test.js
// @require ../js/TestSuite.js
// @require ../js/AbstractTestRunner.js
// @require ../js/BaseTestRunner.js
// @require ../js/SimpleTestRunner.js
// @require ../js/TestManager.js
//
// @require lib/jsmock/jsmock.js
//
// @require unit/TestTest.js
// @require unit/TestSuiteTest.js
// @require unit/SimpleTestRunnerTest.js
// @require unit/BaseTestRunnerTest.js
//
// ==/UserScript==

MonkeyTestDist.TestManager.run();
