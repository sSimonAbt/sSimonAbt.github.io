sap.ui.require(["sap/ui/test/Opa5","sap/ui/test/matchers/AggregationLengthEquals"],function(e,t){"use strict";var s="com.sbt.meinerstesprojekt.view.Main";var a="idAppControl";e.createPageObjects({onTheAppPage:{assertions:{iShouldSeePageCount:function(n){return this.waitFor({id:a,viewName:s,matchers:[new t({name:"pages",length:n})],success:function(){e.assert.ok(true,"The app contains one page")},errorMessage:"App does not have expected number of pages '"+n+"'."})}}}})});