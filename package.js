Package.describe({
	name: 'rocketchat:tandem',
	version: '0.0.1',
	summary: '',
	git: '',
	documentation: 'README.md',
});

Package.onUse(function(api) {
	api.use([
		// '@material-ui',
		'ecmascript',
		'gadicc:blaze-react-component',
		// 'history',
		// 'prop-types',
		'mongo',
		// 'events',
		// 'object-path',
		'rocketchat:settings',
		'rocketchat:models',
		// 'react',
		// 'react-dom',
		'tap:i18n',
		'templating',
	]);
	api.mainModule('client/index.js', 'client');
	api.mainModule('server/index.js', 'server');
});
