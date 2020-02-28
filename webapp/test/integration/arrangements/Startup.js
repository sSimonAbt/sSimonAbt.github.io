sap.ui.define([
	"sap/ui/test/Opa5"
], function(Opa5) {
	"use strict";

	return Opa5.extend("com.sbt.meinerstesprojekt.test.integration.arrangements.Startup", {

		iStartMyApp: function () {
			this.iStartMyUIComponent({
				componentConfig: {
					name: "com.sbt.meinerstesprojekt",
					async: true,
					manifest: true
				}
			});
		}

	});
});
