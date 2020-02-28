sap.ui.define([
	"sap/ui/test/Opa5",
	"com/sbt/meinerstesprojekt/test/integration/arrangements/Startup",
	"com/sbt/meinerstesprojekt/test/integration/BasicJourney"
], function(Opa5, Startup) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Startup(),
		pollingInterval: 1
	});

});
