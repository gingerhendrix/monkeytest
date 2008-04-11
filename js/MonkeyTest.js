
var MonkeyTest = {
  Version: '<%= APP_VERSION %>',
};

<%= include 'Test.js' %>
<%= include 'AbstractTestRunner.js' %>
<%= include 'BaseTestRunner.js' %>
<%= include 'SimpleTestRunner.js' %>
<%= include 'GreasemonkeyTestRunner.js' %>
<%= include 'TestManager.js' %>
<%= include 'TestSuite.js' %>


