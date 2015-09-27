'use strict';

// Configuring the Articles module
angular.module('tokatas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tokatas', 'tokatas', 'dropdown', '/tokatas(/create)?');
		Menus.addSubMenuItem('topbar', 'tokatas', 'List Tokatas', 'tokatas');
		Menus.addSubMenuItem('topbar', 'tokatas', 'New Tokata', 'tokatas/create');
	}
]);