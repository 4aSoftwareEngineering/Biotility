'use strict';

// Use Applicaion configuration module to register a new module
//For whatever reason this doesn't work... Added ApplicationConfiguration.registerModule('quiz'); to the core.client.js file
ApplicationConfiguration.registerModule('quiz', ['ngFileUpload']);
