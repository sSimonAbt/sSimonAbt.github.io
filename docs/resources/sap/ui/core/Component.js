/*
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./Manifest","./ComponentMetadata","./Element","sap/base/util/merge","sap/ui/base/ManagedObject","sap/ui/base/ManagedObjectRegistry","sap/ui/thirdparty/URI","sap/ui/performance/trace/Interaction","sap/base/assert","sap/base/Log","sap/base/util/ObjectPath","sap/base/util/UriParameters","sap/base/util/isPlainObject","sap/base/util/LoaderExtensions","sap/ui/VersionInfo"],function(e,t,n,a,r,i,o,s,u,f,c,p,d,l,g,m){"use strict";var y={JSON:"JSON",XML:"XML",HTML:"HTML",JS:"JS",Template:"Template"};var h={lazy:"lazy",eager:"eager",waitFor:"waitFor"};function v(e){["sap-client","sap-server"].forEach(function(t){if(!e.hasSearch(t)){var n=sap.ui.getCore().getConfiguration().getSAPParam(t);if(n){e.addSearch(t,n)}}})}function M(e,t,n,a){if(n){for(var r in e){if(!t[r]&&n[r]&&n[r].uri){t[r]=a}}}}function w(t,a,r,i){var o=a.getEntry(r);if(o!==undefined&&!l(o)){return o}var s,u;if(i&&(s=t.getParent())instanceof n){u=s.getManifestEntry(r,i)}if(u||o){o=e.extend(true,{},u,o)}return o}function _(e,t){var n=Object.create(Object.getPrototypeOf(e));n._oMetadata=e;n._oManifest=t;for(var a in e){if(!/^(getManifest|getManifestObject|getManifestEntry|getMetadataVersion)$/.test(a)&&typeof e[a]==="function"){n[a]=e[a].bind(e)}}n.getManifest=function(){return t&&t.getJson()};n.getManifestObject=function(){return t};n.getManifestEntry=function(n,a){return w(e,t,n,a)};n.getMetadataVersion=function(){return 2};return n}function S(e,t,n){f(typeof e==="function","fn must be a function");var a=i._sOwnerId;try{i._sOwnerId=t;return e.call(n)}finally{i._sOwnerId=a}}var C=i.extend("sap.ui.core.Component",{constructor:function(e,t){var n=Array.prototype.slice.call(arguments);if(typeof e!=="string"){t=e;e=undefined}if(t&&typeof t._metadataProxy==="object"){this._oMetadataProxy=t._metadataProxy;this._oManifest=t._metadataProxy._oManifest;delete t._metadataProxy;this.getMetadata=function(){return this._oMetadataProxy}}if(t&&typeof t._cacheTokens==="object"){this._mCacheTokens=t._cacheTokens;delete t._cacheTokens}if(t&&typeof t._manifestModels==="object"){this._mManifestModels=t._manifestModels;delete t._manifestModels}else{this._mManifestModels={}}this._mServices={};i.apply(this,n)},metadata:{stereotype:"component",abstract:true,specialSettings:{componentData:"any"},version:"0.0",includes:[],dependencies:{libs:[],components:[],ui5version:""},config:{},customizing:{},library:"sap.ui.core"}},n);o.apply(C,{onDeregister:function(e){a.registry.forEach(function(t){if(t._sapui_candidateForDestroy&&t._sOwnerId===e&&!t.getParent()){c.debug("destroying dangling template "+t+" when destroying the owner component");t.destroy()}})}});C.prototype.getManifest=function(){if(!this._oManifest){return this.getMetadata().getManifest()}else{return this._oManifest.getJson()}};C.prototype.getManifestEntry=function(e){return this._getManifestEntry(e)};C.prototype._getManifestEntry=function(e,t){if(!this._oManifest){return this.getMetadata().getManifestEntry(e,t)}else{return w(this.getMetadata(),this._oManifest,e,t)}};C.prototype.getManifestObject=function(){if(!this._oManifest){return this.getMetadata().getManifestObject()}else{return this._oManifest}};C.prototype._isVariant=function(){if(this._oManifest){var e=this.getManifestEntry("/sap.ui5/componentName");return e&&e!==this.getManifestEntry("/sap.app/id")}else{return false}};C.activateCustomizing=function(e){};C.deactivateCustomizing=function(e){};C.getOwnerIdFor=function(e){f(e instanceof i,"oObject must be given and must be a ManagedObject");var t=e instanceof i&&e._sOwnerId;return t||undefined};C.getOwnerComponentFor=function(e){return C.get(C.getOwnerIdFor(e))};C.prototype.runAsOwner=function(e){return S(e,this.getId())};C.prototype.getInterface=function(){return this};C.prototype._initCompositeSupport=function(t){this.oComponentData=t&&t.componentData;if(!this._isVariant()){this.getMetadata().init()}else{this._oManifest.init(this);var n=this._oManifest.getEntry("/sap.app/id");if(n){E(n,this._oManifest.resolveUri("./","manifest"))}}this.initComponentModels();if(this.onWindowError){this._fnWindowErrorHandler=e.proxy(function(e){var t=e.originalEvent;this.onWindowError(t.message,t.filename,t.lineno)},this);e(window).bind("error",this._fnWindowErrorHandler)}if(this.onWindowBeforeUnload){this._fnWindowBeforeUnloadHandler=e.proxy(this.onWindowBeforeUnload,this);e(window).bind("beforeunload",this._fnWindowBeforeUnloadHandler)}if(this.onWindowUnload){this._fnWindowUnloadHandler=e.proxy(this.onWindowUnload,this);e(window).bind("unload",this._fnWindowUnloadHandler)}};C.prototype.destroy=function(){for(var t in this._mServices){if(this._mServices[t].instance){this._mServices[t].instance.destroy()}}delete this._mServices;for(var n in this._mManifestModels){this._mManifestModels[n].destroy()}delete this._mManifestModels;if(this._fnWindowErrorHandler){e(window).unbind("error",this._fnWindowErrorHandler);delete this._fnWindowErrorHandler}if(this._fnWindowBeforeUnloadHandler){e(window).unbind("beforeunload",this._fnWindowBeforeUnloadHandler);delete this._fnWindowBeforeUnloadHandler}if(this._fnWindowUnloadHandler){e(window).unbind("unload",this._fnWindowUnloadHandler);delete this._fnWindowUnloadHandler}if(this._oEventBus){this._oEventBus.destroy();delete this._oEventBus}i.prototype.destroy.apply(this,arguments);sap.ui.getCore().getMessageManager().unregisterObject(this);if(!this._isVariant()){this.getMetadata().exit()}else{this._oManifest.exit(this);delete this._oManifest}};C.prototype.getComponentData=function(){return this.oComponentData};C.prototype.getEventBus=function(){if(!this._oEventBus){var e=this.getMetadata().getName();c.warning("Synchronous loading of EventBus, due to #getEventBus() call on Component '"+e+"'.","SyncXHR",null,function(){return{type:"SyncXHR",name:e}});var t=sap.ui.requireSync("sap/ui/core/EventBus");this._oEventBus=new t}return this._oEventBus};C.prototype.initComponentModels=function(){var e=this.getMetadata();if(e.isBaseClass()){return}var t=this._getManifestEntry("/sap.app/dataSources",true)||{};var n=this._getManifestEntry("/sap.ui5/models",true)||{};this._initComponentModels(n,t,this._mCacheTokens)};C.prototype._initComponentModels=function(e,t,n){var a=C._createManifestModelConfigurations({models:e,dataSources:t,component:this,mergeParent:true,cacheTokens:n});if(!a){return}var r={};for(var i in a){if(!this._mManifestModels[i]){r[i]=a[i]}}var o=C._createManifestModels(r,this.toString());for(var i in o){this._mManifestModels[i]=o[i]}for(var i in this._mManifestModels){var s=this._mManifestModels[i];this.setModel(s,i||undefined)}};C.prototype.getService=function(e){if(!this._mServices[e]){this._mServices[e]={};this._mServices[e].promise=new Promise(function(t,n){sap.ui.require(["sap/ui/core/service/ServiceFactoryRegistry"],function(a){var r=this._getManifestEntry("/sap.ui5/services/"+e,true);var i=r&&r.factoryName;if(!i){n(new Error("Service "+e+" not declared!"));return}var o=a.get(i);if(o){o.createInstance({scopeObject:this,scopeType:"component",settings:r.settings||{}}).then(function(a){if(!this.bIsDestroyed){this._mServices[e].instance=a;this._mServices[e].interface=a.getInterface();t(this._mServices[e].interface)}else{n(new Error("Service "+e+" could not be loaded as its Component was destroyed."))}}.bind(this)).catch(n)}else{var s="The ServiceFactory "+i+" for Service "+e+" not found in ServiceFactoryRegistry!";var u=this._getManifestEntry("/sap.ui5/services/"+e+"/optional",true);if(!u){c.error(s)}n(new Error(s))}}.bind(this),n)}.bind(this))}return this._mServices[e].promise};function b(e,t){var n=e._getManifestEntry("/sap.ui5/services",true);var a=t?[]:null;if(!n){return a}var r=Object.keys(n);if(!t&&r.some(function(e){return n[e].startup===h.waitFor})){throw new Error('The specified component "'+e.getMetadata().getName()+'" cannot be loaded in sync mode since it has some services declared with "startup" set to "waitFor"')}return r.reduce(function(t,a){if(n[a].lazy===false||n[a].startup===h.waitFor||n[a].startup===h.eager){var r=e.getService(a);if(n[a].startup===h.waitFor){t.push(r)}}return t},a)}C.prototype.createComponent=function(e){f(typeof e==="string"&&e||typeof e==="object"&&typeof e.usage==="string"&&e.usage,"vUsage either must be a non-empty string or an object with a non-empty usage id");var t={async:true};if(e){var n;if(typeof e==="object"){n=e.usage;["id","async","settings","componentData"].forEach(function(n){if(e[n]!==undefined){t[n]=e[n]}})}else if(typeof e==="string"){n=e}t=this._enhanceWithUsageConfig(n,t)}return C._createComponent(t,this)};C.prototype._enhanceWithUsageConfig=function(t,n){var a=this.getManifestEntry("/sap.ui5/componentUsages/"+t);if(!a){throw new Error('Component usage "'+t+'" not declared in Component "'+this.getManifestObject().getComponentName()+'"!')}return e.extend(true,a,n)};C._createComponent=function(e,t){function n(){if(e.async===true){return C.create(e)}else{return sap.ui.component(e)}}if(t){return t.runAsOwner(n)}else{return n()}};C._createManifestModelConfigurations=function(e){var t=e.component;var a=e.manifest||t.getManifestObject();var r=e.mergeParent;var i=e.cacheTokens||{};var o=t?t.toString():a.getComponentName();var u=sap.ui.getCore().getConfiguration();if(!e.models){return null}var f={models:e.models,dataSources:e.dataSources||{},origin:{dataSources:{},models:{}}};if(t&&r){var p=t.getMetadata();while(p instanceof n){var d=p.getManifestObject();var l=p.getManifestEntry("/sap.app/dataSources");M(f.dataSources,f.origin.dataSources,l,d);var g=p.getManifestEntry("/sap.ui5/models");M(f.models,f.origin.models,g,d);p=p.getParent()}}var m={};for(var y in f.models){var h=f.models[y];var w=false;var _=null;if(typeof h==="string"){h={dataSource:h}}if(h.dataSource){var S=f.dataSources&&f.dataSources[h.dataSource];if(typeof S==="object"){if(S.type===undefined){S.type="OData"}var C;if(!h.type){switch(S.type){case"OData":C=S.settings&&S.settings.odataVersion;if(C==="4.0"){h.type="sap.ui.model.odata.v4.ODataModel"}else if(!C||C==="2.0"){h.type="sap.ui.model.odata.v2.ODataModel"}else{c.error('Component Manifest: Provided OData version "'+C+'" in '+'dataSource "'+h.dataSource+'" for model "'+y+'" is unknown. '+'Falling back to default model type "sap.ui.model.odata.v2.ODataModel".','["sap.app"]["dataSources"]["'+h.dataSource+'"]',o);h.type="sap.ui.model.odata.v2.ODataModel"}break;case"JSON":h.type="sap.ui.model.json.JSONModel";break;case"XML":h.type="sap.ui.model.xml.XMLModel";break;default:}}if(h.type==="sap.ui.model.odata.v4.ODataModel"&&S.settings&&S.settings.odataVersion){h.settings=h.settings||{};h.settings.odataVersion=S.settings.odataVersion}if(!h.uri){h.uri=S.uri;w=true}if(S.type==="OData"&&S.settings&&typeof S.settings.maxAge==="number"){h.settings=h.settings||{};h.settings.headers=h.settings.headers||{};h.settings.headers["Cache-Control"]="max-age="+S.settings.maxAge}if(S.type==="OData"&&S.settings&&S.settings.annotations){var b=S.settings.annotations;for(var O=0;O<b.length;O++){var P=f.dataSources[b[O]];if(!P){c.error('Component Manifest: ODataAnnotation "'+b[O]+'" for dataSource "'+h.dataSource+'" could not be found in manifest','["sap.app"]["dataSources"]["'+b[O]+'"]',o);continue}if(P.type!=="ODataAnnotation"){c.error('Component Manifest: dataSource "'+b[O]+'" was expected to have type "ODataAnnotation" but was "'+P.type+'"','["sap.app"]["dataSources"]["'+b[O]+'"]',o);continue}if(!P.uri){c.error('Component Manifest: Missing "uri" for ODataAnnotation "'+b[O]+'"','["sap.app"]["dataSources"]["'+b[O]+'"]',o);continue}var E=new s(P.uri);if(h.type==="sap.ui.model.odata.v2.ODataModel"){["sap-language","sap-client"].forEach(function(e){if(!E.hasQuery(e)&&u.getSAPParam(e)){E.setQuery(e,u.getSAPParam(e))}});var U=i.dataSources&&i.dataSources[P.uri];if(U){var x=function(){if(!E.hasQuery("sap-language")){c.warning('Component Manifest: Ignoring provided "sap-context-token='+U+'" for ODataAnnotation "'+b[O]+'" ('+E.toString()+"). "+'Missing "sap-language" URI parameter','["sap.app"]["dataSources"]["'+b[O]+'"]',o);return}if(!E.hasQuery("sap-client")){c.warning('Component Manifest: Ignoring provided "sap-context-token='+U+'" for ODataAnnotation "'+b[O]+'" ('+E.toString()+"). "+'Missing "sap-client" URI parameter','["sap.app"]["dataSources"]["'+b[O]+'"]',o);return}if(!E.hasQuery("sap-client",u.getSAPParam("sap-client"))){c.warning('Component Manifest: Ignoring provided "sap-context-token='+U+'" for ODataAnnotation "'+b[O]+'" ('+E.toString()+"). "+'URI parameter "sap-client='+E.query(true)["sap-client"]+'" must be identical with configuration "sap-client='+u.getSAPParam("sap-client")+'"','["sap.app"]["dataSources"]["'+b[O]+'"]',o);return}if(E.hasQuery("sap-context-token")&&!E.hasQuery("sap-context-token",U)){var e=E.query(true)["sap-context-token"];c.warning('Component Manifest: Overriding existing "sap-context-token='+e+'" with provided value "'+U+'" for ODataAnnotation "'+b[O]+'" ('+E.toString()+").",'["sap.app"]["dataSources"]["'+b[O]+'"]',o)}E.setQuery("sap-context-token",U)};x()}}var j=f.origin.dataSources[b[O]]||a;var k=j._resolveUri(E).toString();h.settings=h.settings||{};h.settings.annotationURI=h.settings.annotationURI||[];h.settings.annotationURI.push(k)}}}else{c.error('Component Manifest: dataSource "'+h.dataSource+'" for model "'+y+'" not found or invalid','["sap.app"]["dataSources"]["'+h.dataSource+'"]',o)}}if(!h.type){c.error('Component Manifest: Missing "type" for model "'+y+'"','["sap.ui5"]["models"]["'+y+'"]',o);continue}if(h.type==="sap.ui.model.odata.ODataModel"&&(!h.settings||h.settings.json===undefined)){h.settings=h.settings||{};h.settings.json=true}if(h.uri){var D=new s(h.uri);var A=(w?f.origin.dataSources[h.dataSource]:f.origin.models[y])||a;D=A._resolveUri(D);if(h.dataSource){v(D);if(h.type==="sap.ui.model.odata.v2.ODataModel"){_=h.settings&&h.settings.metadataUrlParams;if((!_||typeof _["sap-language"]==="undefined")&&!D.hasQuery("sap-language")&&u.getSAPParam("sap-language")){h.settings=h.settings||{};_=h.settings.metadataUrlParams=h.settings.metadataUrlParams||{};_["sap-language"]=u.getSAPParam("sap-language")}if(i.dataSources){var U=i.dataSources[S.uri];if(U){var N=function(){if(D.hasQuery("sap-context-token")){c.warning('Component Manifest: Ignoring provided "sap-context-token='+U+'" for model "'+y+'" ('+D.toString()+"). "+'Model URI already contains parameter "sap-context-token='+D.query(true)["sap-context-token"]+'"','["sap.ui5"]["models"]["'+y+'"]',o);return}if((!_||typeof _["sap-language"]==="undefined")&&!D.hasQuery("sap-language")){c.warning('Component Manifest: Ignoring provided "sap-context-token='+U+'" for model "'+y+'" ('+D.toString()+"). "+'Missing "sap-language" parameter','["sap.ui5"]["models"]["'+y+'"]',o);return}if(!D.hasQuery("sap-client")){c.warning('Component Manifest: Ignoring provided "sap-context-token='+U+'" for model "'+y+'" ('+D.toString()+"). "+'Missing "sap-client" parameter','["sap.ui5"]["models"]["'+y+'"]',o);return}if(!D.hasQuery("sap-client",u.getSAPParam("sap-client"))){c.warning('Component Manifest: Ignoring provided "sap-context-token='+U+'" for model "'+y+'" ('+D.toString()+"). "+'URI parameter "sap-client='+D.query(true)["sap-client"]+'" must be identical with configuration "sap-client='+u.getSAPParam("sap-client")+'"','["sap.ui5"]["models"]["'+y+'"]',o);return}if(_&&typeof _["sap-client"]!=="undefined"){if(_["sap-client"]!==u.getSAPParam("sap-client")){c.warning('Component Manifest: Ignoring provided "sap-context-token='+U+'" for model "'+y+'" ('+D.toString()+"). "+'Parameter metadataUrlParams["sap-client"] = "'+_["sap-client"]+'" must be identical with configuration "sap-client='+u.getSAPParam("sap-client")+'"','["sap.ui5"]["models"]["'+y+'"]',o);return}}if(_&&_["sap-context-token"]&&_["sap-context-token"]!==U){c.warning('Component Manifest: Overriding existing "sap-context-token='+_["sap-context-token"]+'" with provided value "'+U+'" for model "'+y+'" ('+D.toString()+").",'["sap.ui5"]["models"]["'+y+'"]',o)}if(!_){h.settings=h.settings||{};_=h.settings.metadataUrlParams=h.settings.metadataUrlParams||{}}_["sap-context-token"]=U};N()}}}}h.uri=D.toString()}if(h.uriSettingName===undefined){switch(h.type){case"sap.ui.model.odata.ODataModel":case"sap.ui.model.odata.v2.ODataModel":case"sap.ui.model.odata.v4.ODataModel":h.uriSettingName="serviceUrl";break;case"sap.ui.model.resource.ResourceModel":h.uriSettingName="bundleUrl";break;default:}}var I;var R;if(t){R=t.getComponentData()}else{R=e.componentData}I=R&&R.startupParameters&&R.startupParameters["sap-system"];if(!I){I=u.getSAPParam("sap-system")}var T=false;var H;if(I&&["sap.ui.model.odata.ODataModel","sap.ui.model.odata.v2.ODataModel"].indexOf(h.type)!=-1){T=true;H=sap.ui.requireSync("sap/ui/model/odata/ODataUtils")}if(h.uri){if(T){h.preOriginBaseUri=h.uri.split("?")[0];h.uri=H.setOrigin(h.uri,{alias:I});h.postOriginBaseUri=h.uri.split("?")[0]}if(h.uriSettingName!==undefined){h.settings=h.settings||{};if(!h.settings[h.uriSettingName]){h.settings[h.uriSettingName]=h.uri}}else if(h.settings){h.settings=[h.uri,h.settings]}else{h.settings=[h.uri]}}else{if(T&&h.uriSettingName!==undefined&&h.settings&&h.settings[h.uriSettingName]){h.preOriginBaseUri=h.settings[h.uriSettingName].split("?")[0];h.settings[h.uriSettingName]=H.setOrigin(h.settings[h.uriSettingName],{alias:I});h.postOriginUri=h.settings[h.uriSettingName].split("?")[0]}}if(T&&h.settings&&h.settings.annotationURI){var B=[].concat(h.settings.annotationURI);var W=[];for(var O=0;O<B.length;O++){W.push(H.setAnnotationOrigin(B[O],{alias:I,preOriginBaseUri:h.preOriginBaseUri,postOriginBaseUri:h.postOriginBaseUri}))}h.settings.annotationURI=W}if(h.type==="sap.ui.model.resource.ResourceModel"&&h.settings&&Array.isArray(h.settings.enhanceWith)){h.settings.enhanceWith.forEach(function(e){if(e.bundleUrl){e.bundleUrl=a.resolveUri(e.bundleUrl,e.bundleUrlRelativeTo)}})}if(h.settings&&!Array.isArray(h.settings)){h.settings=[h.settings]}m[y]=h}if(a.getEntry("/sap.ui5/commands")||t&&t._getManifestEntry("/sap.ui5/commands",true)){m["$cmd"]={type:"sap.ui.model.json.JSONModel"}}return m};C._createManifestModels=function(e,t){var n={};for(var a in e){var r=e[a];try{sap.ui.requireSync(r.type.replace(/\./g,"/"))}catch(e){c.error('Component Manifest: Class "'+r.type+'" for model "'+a+'" could not be loaded. '+e,'["sap.ui5"]["models"]["'+a+'"]',t);continue}var i=p.get(r.type);if(!i){c.error('Component Manifest: Class "'+r.type+'" for model "'+a+'" could not be found','["sap.ui5"]["models"]["'+a+'"]',t);continue}var o=[null].concat(r.settings||[]);var s=i.bind.apply(i,o);var u=new s;n[a]=u}return n};function O(t,n,a){var r={afterManifest:{},afterPreload:{}};var i=e.extend(true,{},t.getEntry("/sap.app/dataSources"));var o=e.extend(true,{},t.getEntry("/sap.ui5/models"));var s=C._createManifestModelConfigurations({models:o,dataSources:i,manifest:t,componentData:n,cacheTokens:a});var u=d.fromQuery(window.location.search).get("sap-ui-xx-preload-component-models-"+t.getComponentName());var f=u&&u.split(",");for(var p in s){var l=s[p];if(!l.preload&&f&&f.indexOf(p)>-1){l.preload=true;c.warning('FOR TESTING ONLY!!! Activating preload for model "'+p+'" ('+l.type+")",t.getComponentName(),"sap.ui.core.Component")}if(l.type==="sap.ui.model.resource.ResourceModel"&&Array.isArray(l.settings)&&l.settings.length>0&&l.settings[0].async!==true){r.afterPreload[p]=l}else if(l.preload){if(sap.ui.loader._.getModuleState(l.type.replace(/\./g,"/")+".js")){r.afterManifest[p]=l}else{c.warning('Can not preload model "'+p+'" as required class has not been loaded: "'+l.type+'"',t.getComponentName(),"sap.ui.core.Component")}}}return r}function P(e){return sap.ui.require.toUrl(e.replace(/\./g,"/")+"/manifest.json")}function E(e,t){g.registerResourcePath(e.replace(/\./g,"/"),t)}function U(e){var t=[];var a=[];function r(e){if(!e._oManifest){var i=e.getComponentName();var o=P(i);var s=g.loadResource({url:o,dataType:"json",async:true}).catch(function(e){c.error('Failed to load component manifest from "'+o+'" (component '+i+")! Reason: "+e);return{}});t.push(s);a.push(e)}var u=e.getParent();if(u&&u instanceof n&&!u.isBaseClass()){r(u)}}r(e);return Promise.all(t).then(function(e){for(var t=0;t<e.length;t++){if(e[t]){a[t]._applyManifest(e[t])}}})}C._fnLoadComponentCallback=null;C._fnOnInstanceCreated=null;C._fnPreprocessManifest=null;C.create=function(e){if(e==null||typeof e!=="object"){throw new TypeError("Component.create() must be called with a configuration object.")}var t=r({},e);t.async=true;if(t.manifest===undefined){t.manifest=true}return x(t)};sap.ui.component=function(e){if(!e){throw new Error("sap.ui.component cannot be called without parameter!")}var t=function(e){return{type:"sap.ui.component",name:e}};if(typeof e==="string"){c.warning("Do not use deprecated function 'sap.ui.component' ("+e+") + for Component instance lookup. "+"Use 'Component.get' instead","sap.ui.component",null,t.bind(null,e));return sap.ui.getCore().getComponent(e)}if(e.async){c.info("Do not use deprecated factory function 'sap.ui.component' ("+e["name"]+"). "+"Use 'Component.create' instead","sap.ui.component",null,t.bind(null,e["name"]))}else{c.warning("Do not use synchronous component creation ("+e["name"]+")! "+"Use the new asynchronous factory 'Component.create' instead","sap.ui.component",null,t.bind(null,e["name"]))}return x(e)};function x(t){if(!t.asyncHints||!t.asyncHints.cacheTokens){var n=C.get(i._sOwnerId);var a=n&&n._mCacheTokens;if(typeof a==="object"){t.asyncHints=t.asyncHints||{};t.asyncHints.cacheTokens=a}}function r(e,t){if(typeof C._fnOnInstanceCreated==="function"){var n=C._fnOnInstanceCreated(e,t);if(t.async&&n instanceof Promise){return n}}if(t.async){return Promise.resolve(e)}return e}function o(n){var a=t.name,i=t.id,o=t.componentData,s=a+".Component",u=t.settings;var p=new n(e.extend({},u,{id:i,componentData:o,_cacheTokens:t.asyncHints&&t.asyncHints.cacheTokens}));f(p instanceof C,'The specified component "'+s+'" must be an instance of sap.ui.core.Component!');c.info("Component instance Id = "+p.getId());var d=p.getMetadata().handleValidation()!==undefined||t.handleValidation;if(d){if(p.getMetadata().handleValidation()!==undefined){d=p.getMetadata().handleValidation()}else{d=t.handleValidation}sap.ui.getCore().getMessageManager().registerObject(p,d)}var l=b(p,t.async);if(t.async){return r(p,t).then(function(){return Promise.all(l)}).then(function(){return p})}else{r(p,t);return p}}var s=j(t,{failOnError:true,createModels:true,waitFor:t.asyncHints&&t.asyncHints.waitFor});if(t.async){var u=i._sOwnerId;return s.then(function(e){return S(function(){return o(e)},u)})}else{return o(s)}}C.load=function(e){var t=r({},e);t.async=true;if(t.manifest===undefined){t.manifest=true}return j(t,{preloadOnly:t.asyncHints&&t.asyncHints.preloadOnly})};C.get=function(e){return sap.ui.getCore().getComponent(e)};sap.ui.component.load=function(e,t){c.warning("Do not use deprecated function 'sap.ui.component.load'! Use 'Component.load' instead");return j(e,{failOnError:t,preloadOnly:e.asyncHints&&e.asyncHints.preloadOnly})};function j(n,a){var r=n.name,i=n.url,o=sap.ui.getCore().getConfiguration(),s=/^(sync|async)$/.test(o.getComponentPreload()),p=n.manifest,d,l,g,h,v,M;function w(e,a){var r=JSON.parse(JSON.stringify(e));if(n.async){return S(r).then(function(e){return new t(e,a)})}else{return new t(r,a)}}function S(t){if(typeof C._fnPreprocessManifest==="function"&&t!=null){try{var a=e.extend(true,{},n);return C._fnPreprocessManifest(t,a)}catch(e){c.error("Failed to execute flexibility hook for manifest preprocessing.",e);return Promise.reject(e)}}else{return Promise.resolve(t)}}f(!i||typeof i==="string","sUrl must be a string or undefined");if(r&&typeof i==="string"){E(r,i)}u.setStepComponent(r);if(p===undefined){d=n.manifestFirst===undefined?o.getManifestFirst():!!n.manifestFirst;l=n.manifestUrl}else{if(n.async===undefined){n.async=true}d=!!p;l=p&&typeof p==="string"?p:undefined;g=p&&typeof p==="object"?w(p,{url:n&&n.altManifestUrl}):undefined}if(!g&&l){g=t.load({manifestUrl:l,componentName:r,processJson:S,async:n.async,failOnError:true})}if(g&&!n.async){r=g.getComponentName();if(r&&typeof i==="string"){E(r,i)}}if(!(g&&n.async)){if(!r){throw new Error("The name of the component is undefined.")}f(typeof r==="string","sName must be a string")}if(d&&!g){g=t.load({manifestUrl:P(r),componentName:r,async:n.async,processJson:S,failOnError:false})}function b(){return(r+".Component").replace(/\./g,"/")}function x(e){var t=r+".Component";if(!e){var n="The specified component controller '"+t+"' could not be found!";if(a.failOnError){throw new Error(n)}else{c.warning(n)}}if(g){var i=_(e.getMetadata(),g);var o=function(){var t=Array.prototype.slice.call(arguments);var n;if(t.length===0||typeof t[0]==="object"){n=t[0]=t[0]||{}}else if(typeof t[0]==="string"){n=t[1]=t[1]||{}}n._metadataProxy=i;if(h){n._manifestModels=h}var a=Object.create(e.prototype);e.apply(a,t);return a};o.getMetadata=function(){return i};o.extend=function(){throw new Error("Extending Components created by Manifest is not supported!")};return o}else{return e}}function j(e,t){f(typeof e==="string"&&e||typeof e==="object"&&typeof e.name==="string"&&e.name,"reference either must be a non-empty string or an object with a non-empty 'name' and an optional 'url' property");if(typeof e==="object"){if(e.url){E(e.name,e.url)}return e.lazy&&t!==true?undefined:e.name}return e}function k(e,t){var n=e+".Component",a=sap.ui.getCore().getConfiguration().getDepCache(),r,i,o;if(s&&e!=null&&!sap.ui.loader._.getModuleState(n.replace(/\./g,"/")+".js")){if(t){i=m._getTransitiveDependencyForComponent(e);if(i){o=[i.library];Array.prototype.push.apply(o,i.dependencies);return sap.ui.getCore().loadLibraries(o,{preloadOnly:true})}else{r=n.replace(/\./g,"/")+(a?"-h2-preload.js":"-preload.js");return sap.ui.loader._.loadJSResourceAsync(r,true)}}try{r=n+"-preload";sap.ui.requireSync(r.replace(/\./g,"/"))}catch(e){c.warning("couldn't preload component from "+r+": "+(e&&e.message||e))}}else if(t){return Promise.resolve()}}function D(e,t,n){var a=[];var r=n?function(e){a.push(e)}:function(){};t.defineResourceRoots();var i=t.getEntry("/sap.ui5/dependencies/libs");if(i){var o=[];for(var s in i){if(!i[s].lazy){o.push(s)}}if(o.length>0){c.info('Component "'+e+'" is loading libraries: "'+o.join(", ")+'"');r(sap.ui.getCore().loadLibraries(o,{async:n}))}}var u=t.getEntry("/sap.ui5/extends/component");if(u){r(k(u,n))}var f=[];var p=t.getEntry("/sap.ui5/dependencies/components");if(p){for(var e in p){if(!p[e].lazy){f.push(e)}}}var d=t.getEntry("/sap.ui5/componentUsages");if(d){for(var l in d){if(d[l].lazy===false&&f.indexOf(d[l].name)===-1){f.push(d[l].name)}}}if(f.length>0){f.forEach(function(e){r(k(e,n))})}return n?Promise.all(a):undefined}if(n.async){var A=n.asyncHints||{},N=[],I=function(e){e=e.then(function(e){return{result:e,rejected:false}},function(e){return{result:e,rejected:true}});return e},R=function(e){if(e){N.push(I(e))}},T=function(e){return e},H,B;if(g&&a.createModels){R(g.then(function(e){v=O(e,n.componentData,A.cacheTokens);return e}).then(function(e){if(Object.keys(v.afterManifest).length>0){h=C._createManifestModels(v.afterManifest,e.getComponentName())}return e}))}H=[];if(Array.isArray(A.preloadBundles)){A.preloadBundles.forEach(function(e){H.push(sap.ui.loader._.loadJSResourceAsync(j(e,true),true))})}if(Array.isArray(A.libs)){B=A.libs.map(j).filter(T);H.push(sap.ui.getCore().loadLibraries(B,{preloadOnly:true}))}H=Promise.all(H);if(B&&!a.preloadOnly){H=H.then(function(){return sap.ui.getCore().loadLibraries(B)})}R(H);if(!g){R(k(r,true))}else{R(g.then(function(e){var t=e.getComponentName();if(typeof i==="string"){E(t,i)}return k(t,true).then(function(){return e._processI18n(true)}).then(function(){if(!a.createModels){return null}var n=Object.keys(v.afterPreload);if(n.length===0){return null}return new Promise(function(e,t){sap.ui.require(["sap/ui/model/resource/ResourceModel"],function(t){e(t)},t)}).then(function(a){function r(e){var n=v.afterPreload[e];if(Array.isArray(n.settings)&&n.settings.length>0){var r=n.settings[0];return a.loadResourceBundle(r,true).then(function(e){r.bundle=e},function(n){c.error("Component Manifest: Could not preload ResourceBundle for ResourceModel. "+"The model will be skipped here and tried to be created on Component initialization.",'["sap.ui5"]["models"]["'+e+'"]',t);c.error(n);delete v.afterPreload[e]})}else{return Promise.resolve()}}return Promise.all(n.map(r)).then(function(){if(Object.keys(v.afterPreload).length>0){var t=C._createManifestModels(v.afterPreload,e.getComponentName());if(!h){h={}}for(var n in t){h[n]=t[n]}}})})})}));M=function(t){if(typeof C._fnLoadComponentCallback==="function"){var a=e.extend(true,{},n);var r=e.extend(true,{},t);try{C._fnLoadComponentCallback(a,r)}catch(e){c.error('Callback for loading the component "'+t.getComponentName()+'" run into an error. The callback was skipped and the component loading resumed.',e,"sap.ui.core.Component")}}}}if(A.components){e.each(A.components,function(e,t){R(k(j(t),true))})}return Promise.all(N).then(function(e){var t=[],n=false,a;n=e.some(function(e){if(e&&e.rejected){a=e.result;return true}t.push(e.result)});if(n){return Promise.reject(a)}return t}).then(function(e){if(g&&M){g.then(M)}return e}).then(function(e){c.debug("Component.load: all promises fulfilled, then "+e);if(g){return g.then(function(e){g=e;r=g.getComponentName();return D(r,g,true)})}else{return e}}).then(function(){if(a.preloadOnly){return true}return new Promise(function(e,t){sap.ui.require([b()],function(t){e(t)},t)}).then(function(e){var t=e.getMetadata();var n=t.getComponentName();var a=P(n);var r;if(g&&typeof p!=="object"&&(typeof l==="undefined"||l===a)){t._applyManifest(JSON.parse(JSON.stringify(g.getRawJson())))}r=U(t);return r.then(function(){return x(e)})})}).then(function(t){if(!g){return t}var n=[];var a;var r=g.getEntry("/sap.ui5/rootView");if(typeof r==="string"){a="XML"}else if(r&&typeof r==="object"&&r.type){a=r.type}if(a&&y[a]){var i="sap/ui/core/mvc/"+y[a]+"View";n.push(i)}var o=g.getEntry("/sap.ui5/routing");if(o&&o.routes){var s=g.getEntry("/sap.ui5/routing/config/routerClass")||"sap.ui.core.routing.Router";var u=s.replace(/\./g,"/");n.push(u)}var f=e.extend(true,{},g.getEntry("/sap.ui5/models"));var p=e.extend(true,{},g.getEntry("/sap.app/dataSources"));var d=C._createManifestModelConfigurations({models:f,dataSources:p,manifest:g,cacheTokens:A.cacheTokens});for(var l in d){if(!d.hasOwnProperty(l)){continue}var m=d[l];if(!m.type){continue}var h=m.type.replace(/\./g,"/");if(n.indexOf(h)===-1){n.push(h)}}if(n.length>0){return Promise.all(n.map(function(e){return new Promise(function(t,n){var a=false;function r(n){if(a){return}c.warning('Can not preload module "'+e+'". '+"This will most probably cause an error once the module is used later on.",g.getComponentName(),"sap.ui.core.Component");c.warning(n);a=true;t()}sap.ui.require([e],t,r)})})).then(function(){return t})}else{return t}}).then(function(e){var t=a.waitFor;if(t){var n=Array.isArray(t)?t:[t];return Promise.all(n).then(function(){return e})}return e}).catch(function(e){if(h){for(var t in h){var n=h[t];if(n&&typeof n.destroy==="function"){n.destroy()}}}throw e})}if(g){D(r,g)}k(r);return x(sap.ui.requireSync(b()))}if(Math.sqrt(2)<1){sap.ui.require(["sap/ui/core/Core"],function(){})}C.prototype.getCommand=function(e){var t,n=this._getManifestEntry("/sap.ui5/commands",true);if(n&&e){t=n[e]}return e?t:n};return C});