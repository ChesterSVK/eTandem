Package.describe({
	name: 'rocketchat:tandem',
	version: '0.0.1',
	summary: '',
	git: 'https://github.com/ChesterSVK/eTandem/tree/rocketchat-tandem-package',
	documentation: 'README.md',
});

Package.onUse(function(api) {
	api.use([
		'ecmascript',
		'gadicc:blaze-react-component',
		'rocketchat:mailer',
		'rocketchat:authorization',
		'mongo',
		'rocketchat:settings',
		'rocketchat:models',
		'rocketchat:utils',
        'rocketchat:ui-utils',
		'tap:i18n',
		'templating',
        'jquery',
	]);
	api.mainModule('client/index.js', 'client');
	api.mainModule('server/index.js', 'server');
});

Package.onTest(function (api) {
	// api.use('rocketchat:tandem');

    api.use([
        // "babel-eslint",
        // "babel-mocha-es6-compiler",
    	'ecmascript',
		'random',
		'tinytest',
		'meteortesting:mocha',
	]);

    // Add any files with mocha tests.
    api.addFiles('tests/server/startup.tests.js');
    api.addFiles('tests/client/startup.tests.js');
    api.addFiles('tests/both/enum.tests.js');
    api.addFiles('tests/both/checkers.tests.js');
});