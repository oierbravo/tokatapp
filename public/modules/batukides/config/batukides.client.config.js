'use strict';

// Configuring the Articles module
angular.module('batukides').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Batukides', 'batukides', 'dropdown', '/batukides(/create)?');
		Menus.addSubMenuItem('topbar', 'batukides', 'List Batukides', 'batukides');
		Menus.addSubMenuItem('topbar', 'batukides', 'New Batukide', 'batukides/create');
	}
]);