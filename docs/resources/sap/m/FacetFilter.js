/*!
* OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(["./NavContainer","./library","sap/ui/core/Control","sap/ui/core/IconPool","sap/ui/core/delegate/ItemNavigation","sap/ui/core/InvisibleText","sap/ui/core/IntervalTrigger","sap/ui/Device","sap/ui/base/ManagedObject","sap/ui/core/Icon","sap/ui/model/Filter","./FacetFilterRenderer","sap/ui/events/KeyCodes","sap/base/assert","sap/base/Log","sap/ui/events/jquery/EventSimulation","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/scrollRightRTL","sap/ui/dom/jquery/scrollLeftRTL","sap/ui/dom/jquery/Selectors"],function(e,t,i,a,s,r,o,n,l,g,u,p,h,d,c,f,v){"use strict";var _=t.ToolbarDesign;var m=t.ListType;var y=t.ListMode;var F=t.FacetFilterListDataType;var T=t.ButtonType;var I=t.PlacementType;var L=t.FacetFilterType;var b=i.extend("sap.m.FacetFilter",{metadata:{interfaces:["sap.ui.core.IShrinkable"],library:"sap.m",properties:{showPersonalization:{type:"boolean",group:"Appearance",defaultValue:false},type:{type:"sap.m.FacetFilterType",group:"Appearance",defaultValue:L.Simple},liveSearch:{type:"boolean",group:"Behavior",defaultValue:true},showSummaryBar:{type:"boolean",group:"Behavior",defaultValue:false},showReset:{type:"boolean",group:"Behavior",defaultValue:true},showPopoverOKButton:{type:"boolean",group:"Appearance",defaultValue:false}},defaultAggregation:"lists",aggregations:{lists:{type:"sap.m.FacetFilterList",multiple:true,singularName:"list"},buttons:{type:"sap.m.Button",multiple:true,singularName:"button",visibility:"hidden"},removeFacetIcons:{type:"sap.ui.core.Icon",multiple:true,singularName:"removeFacetIcon",visibility:"hidden"},popover:{type:"sap.m.Popover",multiple:false,visibility:"hidden"},addFacetButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"},dialog:{type:"sap.m.Dialog",multiple:false,visibility:"hidden"},summaryBar:{type:"sap.m.Toolbar",multiple:false,visibility:"hidden"},resetButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"},arrowLeft:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"},arrowRight:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}},events:{reset:{},confirm:{}}}});b.SCROLL_STEP=264;b.prototype.setType=function(e){var t=this.getAggregation("summaryBar");if(n.system.phone){this.setProperty("type",L.Light);t.setActive(true)}else{this.setProperty("type",e);t.setActive(e===L.Light)}if(e===L.Light){if(this.getShowReset()){this._addResetToSummary(t)}else{this._removeResetFromSummary(t)}}return this};b.prototype.setShowReset=function(e){this.setProperty("showReset",e);var t=this.getAggregation("summaryBar");if(e){if(this.getShowSummaryBar()||this.getType()===L.Light){this._addResetToSummary(t)}}else{if(this.getShowSummaryBar()||this.getType()===L.Light){this._removeResetFromSummary(t)}}return this};b.prototype.setShowSummaryBar=function(e){this.setProperty("showSummaryBar",e);if(e){var t=this.getAggregation("summaryBar");if(this.getShowReset()){this._addResetToSummary(t)}else{this._removeResetFromSummary(t)}t.setActive(this.getType()===L.Light)}return this};b.prototype.setLiveSearch=function(e){this.setProperty("liveSearch",e);if(this._displayedList){var t=this._displayedList;var i=sap.ui.getCore().byId(t.getAssociation("search"));i.detachLiveChange(t._handleSearchEvent,t);if(e){i.attachLiveChange(t._handleSearchEvent,t)}}return this};b.prototype.getLists=function(){var e=this.getAggregation("lists");if(!e){e=[]}if(this._displayedList){e.splice(this._listAggrIndex,0,this._displayedList)}return e};b.prototype.removeList=function(e){var t=l.prototype.removeAggregation.call(this,"lists",e);this._removeList(t);return t};b.prototype.removeAggregation=function(){var e=l.prototype.removeAggregation.apply(this,arguments);if(arguments[0]==="lists"){this._removeList(e)}return e};b.prototype.openFilterDialog=function(){var e=this._getFacetDialog();var t=this._getFacetDialogNavContainer();e.addContent(t);this.getLists().forEach(function(e){if(e.getMode()===y.MultiSelect){e._preserveOriginalActiveState()}});e.setInitialFocus(t.getPages()[0].getContent()[0].getItems()[0]);e.open();return this};b.prototype.init=function(){this._pageSize=5;this._addDelegateFlag=false;this._invalidateFlag=false;this._lastCategoryFocusIndex=0;this._aDomRefs=null;this._previousTarget=null;this._addTarget=null;this._aRows=null;this._bundle=sap.ui.getCore().getLibraryResourceBundle("sap.m");this.data("sap-ui-fastnavgroup","true",true);this._buttons={};this._aOwnedLabels=[];this._removeFacetIcons={};this._listAggrIndex=-1;this._displayedList=null;this._lastScrolling=false;this._bPreviousScrollForward=false;this._bPreviousScrollBack=false;this._getAddFacetButton();this._getSummaryBar();this.setAggregation("resetButton",this._createResetButton());if(f.touchEventMode==="ON"&&!n.system.phone){this._enableTouchSupport()}if(n.system.phone){this.setType(L.Light)}};b.prototype.exit=function(){var e;o.removeListener(this._checkOverflow,this);if(this.oItemNavigation){this.removeDelegate(this.oItemNavigation);this.oItemNavigation.destroy()}if(this._aOwnedLabels){this._aOwnedLabels.forEach(function(t){e=sap.ui.getCore().byId(t);if(e){e.destroy()}});this._aOwnedLabels=null}};b.prototype.onBeforeRendering=function(){if(this.getShowSummaryBar()||this.getType()===L.Light){var e=this.getAggregation("summaryBar");var t=e.getContent()[0];t.setText(this._getSummaryText())}o.removeListener(this._checkOverflow,this)};b.prototype.onAfterRendering=function(){if(this.getType()!==L.Light&&!n.system.phone){o.addListener(this._checkOverflow,this)}if(this.getType()!==L.Light){this._startItemNavigation()}};b.prototype._startItemNavigation=function(){var e=this.getDomRef(),t=e.getElementsByClassName("sapMFFHead"),i=[];if(t.length>0){for(var a=0;a<t[0].childNodes.length;a++){if(t[0].childNodes[a].id.indexOf("ff")<0&&t[0].childNodes[a].id.indexOf("icon")<0&&t[0].childNodes[a].id.indexOf("add")<0){i.push(t[0].childNodes[a])}if(t[0].childNodes[a].id.indexOf("add")>=0){i.push(t[0].childNodes[a])}}}if(i!=""){this._aDomRefs=i}if(!this.oItemNavigation||this._addDelegateFlag==true){this.oItemNavigation=new s;this.addDelegate(this.oItemNavigation);this._addDelegateFlag=false}this._aRows=t;for(var a=0;a<this.$().find(":sapTabbable").length;a++){if(this.$().find(":sapTabbable")[a].id.indexOf("add")>=0){this._addTarget=this.$().find(":sapTabbable")[a];break}}this.oItemNavigation.setRootDomRef(e);this.oItemNavigation.setItemDomRefs(i);this.oItemNavigation.setCycling(false);this.oItemNavigation.setPageSize(this._pageSize)};b.prototype.onsapdelete=function(e){var t,i;if(this.getType()===L.Light){return}if(!this.getShowPersonalization()){return}t=sap.ui.getCore().byId(e.target.id);if(!t){return}i=sap.ui.getCore().byId(t.getAssociation("list"));if(!i){return}if(!i.getShowRemoveFacetIcon()){return}i.removeSelections(true);i.setSelectedKeys();i.setProperty("active",false,true);this.invalidate();var a=this.$().find(":sapTabbable");v(a[a.length-1]).focus();var s=this.oItemNavigation.getFocusedIndex();v(e.target).blur();this.oItemNavigation.setFocusedIndex(s+1);this.focus();if(this.oItemNavigation.getFocusedIndex()==0){for(var r=0;r<this.$().find(":sapTabbable").length-1;r++){if(a[r].id.indexOf("add")>=0){v(a[r]).focus()}}}};b.prototype.onsaptabnext=function(e){if(this.getType()===L.Light){return}this._previousTarget=e.target;if(e.target.parentNode.className=="sapMFFHead"){for(var t=0;t<this.$().find(":sapTabbable").length;t++){if(this.$().find(":sapTabbable")[t].parentNode.className=="sapMFFResetDiv"){v(this.$().find(":sapTabbable")[t]).focus();this._invalidateFlag=false;e.preventDefault();e.setMarked();return}}}this._lastCategoryFocusIndex=this.oItemNavigation.getFocusedIndex();if(this._invalidateFlag==true){this.oItemNavigation.setFocusedIndex(-1);this.focus();this._invalidateFlag=false}};b.prototype.onsaptabprevious=function(e){if(this.getType()===L.Light){return}if(e.target.parentNode.className=="sapMFFResetDiv"&&this._previousTarget==null){v(this.$().find(":sapTabbable")[0]).focus();e.preventDefault();e.setMarked();return}if(e.target.parentNode.className=="sapMFFResetDiv"&&this._previousTarget!=null&&this._previousTarget.id!=e.target.id){v(this._previousTarget).focus();e.preventDefault();e.setMarked();return}if(e.target.id.indexOf("add")>=0||e.target.parentNode.className=="sapMFFHead"){this._previousTarget=e.target;v(this.$().find(":sapTabbable")[0]).focus()}};b.prototype.onsapend=function(e){if(this.getType()===L.Light){return}if(this._addTarget!=null){v(this._addTarget).focus();e.preventDefault();e.setMarked()}else{v(this._aRows[this._aRows.length-1]).focus();e.preventDefault();e.setMarked()}this._previousTarget=e.target};b.prototype.onsaphome=function(e){if(this.getType()===L.Light){return}v(this._aRows[0]).focus();e.preventDefault();e.setMarked();this._previousTarget=e.target};b.prototype.onsappageup=function(e){this._previousTarget=e.target};b.prototype.onsappagedown=function(e){this._previousTarget=e.target};b.prototype.onsapincreasemodifiers=function(e){if(this.getType()===L.Light){return}if(e.which==h.ARROW_RIGHT){this._previousTarget=e.target;var t=this.oItemNavigation.getFocusedIndex()-1;var i=t+this._pageSize;v(e.target).blur();this.oItemNavigation.setFocusedIndex(i);this.focus()}};b.prototype.onsapdecreasemodifiers=function(e){if(this.getType()===L.Light){return}var t=0;if(e.which==h.ARROW_LEFT){this._previousTarget=e.target;t=this.oItemNavigation.getFocusedIndex()+1;var i=t-this._pageSize;v(e.target).blur();this.oItemNavigation.setFocusedIndex(i);this.focus()}};b.prototype.onsapdownmodifiers=function(e){if(this.getType()===L.Light){return}this._previousTarget=e.target;var t=0;t=this.oItemNavigation.getFocusedIndex()-1;var i=t+this._pageSize;v(e.target).blur();this.oItemNavigation.setFocusedIndex(i);this.focus()};b.prototype.onsapupmodifiers=function(e){if(this.getType()===L.Light){return}this._previousTarget=e.target;var t=0;t=this.oItemNavigation.getFocusedIndex();if(t!=0){t=t+1}var i=t-this._pageSize;v(e.target).blur();this.oItemNavigation.setFocusedIndex(i);this.focus()};b.prototype.onsapexpand=function(e){if(this.getType()===L.Light){return}this._previousTarget=e.target;var t=this.oItemNavigation.getFocusedIndex()+1;v(e.target).blur();this.oItemNavigation.setFocusedIndex(t);this.focus()};b.prototype.onsapcollapse=function(e){if(this.getType()===L.Light){return}this._previousTarget=e.target;var t=this.oItemNavigation.getFocusedIndex()-1;v(e.target).blur();this.oItemNavigation.setFocusedIndex(t);this.focus()};b.prototype.onsapdown=function(e){if(this.getType()===L.Light){return}this._previousTarget=e.target;if(e.target.parentNode.className=="sapMFFResetDiv"){v(e.target).focus();e.preventDefault();e.setMarked();return}};b.prototype.onsapup=function(e){if(this.getType()===L.Light){return}this._previousTarget=e.target;if(e.target.parentNode.className=="sapMFFResetDiv"){v(e.target).focus();e.preventDefault();e.setMarked()}};b.prototype.onsapleft=function(e){if(this.getType()===L.Light){return}this._previousTarget=e.target;if(e.target.parentNode.className=="sapMFFResetDiv"){v(e.target).focus();e.preventDefault();e.setMarked()}};b.prototype.onsapright=function(e){if(this.getType()===L.Light){return}this._previousTarget=e.target;if(e.target.parentNode.className=="sapMFFResetDiv"){v(e.target).focus();e.preventDefault();e.setMarked()}};b.prototype.onsapescape=function(e){if(this.getType()===L.Light){return}if(e.target.parentNode.className=="sapMFFResetDiv"){return}var t=this._lastCategoryFocusIndex;v(e.target).blur();this.oItemNavigation.setFocusedIndex(t);this.focus()};b.prototype._getPopover=function(){var e=this.getAggregation("popover");if(!e){var t=this;e=new sap.m.Popover({placement:I.Bottom,beforeOpen:function(e){if(t._displayedList){t._displayedList._setSearchValue("")}this.setCustomHeader(t._createFilterItemsSearchFieldBar(t._displayedList));var a=this.getSubHeader();if(!a){this.setSubHeader(t._createSelectAllCheckboxBar(t._displayedList))}i(t._displayedList)},afterClose:function(e){t._addDelegateFlag=true;t._handlePopoverAfterClose()},horizontalScrolling:false});this.setAggregation("popover",e,true);e.setContentWidth("30%");e.addStyleClass("sapMFFPop");var i=function(e){if(!e){return}var i=t._getFacetRemoveIcon(e);if(i){i._bTouchStarted=false}}}if(this.getShowPopoverOKButton()){this._addOKButtonToPopover(e)}else{e.destroyAggregation("footer")}return e};b.prototype._handlePopoverAfterClose=function(){var e=this.getAggregation("popover"),t=this._displayedList;if(!e){return}var i=this._getFacetRemoveIcon(t);if(i&&i._bTouchStarted){return}this._restoreListFromDisplayContainer(e);this._displayRemoveIcon(false,t);t._fireListCloseEvent();this._fireConfirmEvent();this.destroyAggregation("popover");if(this._oOpenPopoverDeferred){setTimeout(function(){this._oOpenPopoverDeferred.resolve();this._oOpenPopoverDeferred=undefined}.bind(this),0)}};b.prototype._fireConfirmEvent=function(){this.fireEvent("confirm")};b.prototype._openPopover=function(e,t){if(!e.isOpen()){var i=sap.ui.getCore().byId(t.getAssociation("list"));d(i,"The facet filter button should be associated with a list.");i.fireListOpen({});this._moveListToDisplayContainer(i,e);e.openBy(t);if(i.getShowRemoveFacetIcon()){this._displayRemoveIcon(true,i)}if(i.getWordWrap()){e.setContentWidth("30%")}i._applySearch()}return this};b.prototype._getAddFacetButton=function(){var e=this.getAggregation("addFacetButton");if(!e){var t=this;var e=new sap.m.Button(this.getId()+"-add",{icon:a.getIconURI("add-filter"),type:T.Transparent,tooltip:this._bundle.getText("FACETFILTER_ADDFACET"),press:function(e){t.openFilterDialog()}});this.setAggregation("addFacetButton",e,true)}return e};b.prototype._getButtonForList=function(e){if(this._buttons[e.getId()]){this._setButtonText(e);return this._buttons[e.getId()]}var t=this;var i=new sap.m.Button({type:T.Transparent,press:function(i){var a=this;var s=function(){var e=t._getPopover();t._openPopover(e,a)};if(e.getMode()===y.MultiSelect){e._preserveOriginalActiveState()}var r=t._getPopover();if(r.isOpen()){setTimeout(function(){if(r.isOpen()){return}t._oOpenPopoverDeferred=v.Deferred();t._oOpenPopoverDeferred.promise().done(s)},100)}else{setTimeout(s.bind(this),100)}}});this._buttons[e.getId()]=i;this.addAggregation("buttons",i);i.setAssociation("list",e.getId(),true);this._setButtonText(e);return i};b.prototype._setButtonText=function(e){var t=this._buttons[e.getId()];if(e._iAllItemsCount===undefined&&e.getMaxItemsCount()){e._iAllItemsCount=e.getMaxItemsCount()}if(t){var i="";var a=Object.getOwnPropertyNames(e._oSelectedKeys);var s=a.length;if(s===1){var r=e._oSelectedKeys[a[0]];i=this._bundle.getText("FACETFILTER_ITEM_SELECTION",[e.getTitle(),r])}else if(s>0&&s===(e._iAllItemsCount?e._iAllItemsCount:0)){i=this._bundle.getText("FACETFILTER_ALL_SELECTED",[e.getTitle()])}else if(s>0){i=this._bundle.getText("FACETFILTER_ITEM_SELECTION",[e.getTitle(),s])}else{i=e.getTitle()}t.setText(i)}};b.prototype._getFacetRemoveIcon=function(e){var t=this,i=this._removeFacetIcons[e.getId()];if(!i){i=new g({src:a.getIconURI("sys-cancel"),tooltip:this._bundle.getText("FACETFILTER_REMOVE"),press:function(){i._bPressed=true}});i.addDelegate({ontouchstart:function(){i._bTouchStarted=true;i._bPressed=false},ontouchend:function(){t._displayRemoveIcon(false,e);i._bTouchStarted=false;setTimeout(s.bind(this),100)}},true);var s=function(){if(i._bPressed){e.removeSelections(true);e.setSelectedKeys();e.setProperty("active",false,true)}t._handlePopoverAfterClose()};i.setAssociation("list",e.getId(),true);i.addStyleClass("sapMFFLRemoveIcon");this._removeFacetIcons[e.getId()]=i;this.addAggregation("removeFacetIcons",i);this._displayRemoveIcon(false,e)}return i};b.prototype._displayRemoveIcon=function(e,t){if(this.getShowPersonalization()){var i=this._removeFacetIcons[t.getId()];if(e){i.removeStyleClass("sapMFFLHiddenRemoveIcon");i.addStyleClass("sapMFFLVisibleRemoveIcon")}else{i.removeStyleClass("sapMFFLVisibleRemoveIcon");i.addStyleClass("sapMFFLHiddenRemoveIcon")}}};b.prototype._getFacetDialogNavContainer=function(){var t=new e({autoFocus:false});var i=this._createFacetPage();t.addPage(i);t.setInitialPage(i);var a=this;t.attachAfterNavigate(function(e){var t=e.getParameters()["to"];var s=e.getParameters()["from"];if(s===i){var r=a._displayedList.getMode()===y.MultiSelect?t.getContent(0)[1].getItems()[0]:t.getContent(0)[0].getItems()[0];if(r){r.focus()}}if(t===i){s.destroySubHeader();d(a._displayedList===null,"Filter items list should have been placed back in the FacetFilter aggregation before page content is destroyed.");s.destroyContent();a._selectedFacetItem.invalidate();t.invalidate();a._selectedFacetItem.focus();a._selectedFacetItem=null}});return t};b.prototype._createFacetPage=function(){var e=this._createFacetList();var t=new sap.m.SearchField({width:"100%",tooltip:this._bundle.getText("FACETFILTER_SEARCH"),liveChange:function(t){var i=e.getBinding("items");if(i){var a=new u("text",sap.ui.model.FilterOperator.Contains,t.getParameters()["newValue"]);i.filter([a])}}});var i=new sap.m.Page({enableScrolling:true,title:this._bundle.getText("FACETFILTER_TITLE"),subHeader:new sap.m.Bar({contentMiddle:t}),content:[e]});return i};b.prototype._createFilterItemsPage=function(){var e=this;var t=new sap.m.Page({showNavButton:true,enableScrolling:true,navButtonPress:function(t){var i=t.getSource().getParent();e._navFromFilterItemsPage(i)}});return t};b.prototype._getFilterItemsPage=function(e){var t=e.getPages()[1];if(t){e.removePage(t);t.destroy()}var i=this._createFilterItemsPage();e.addPage(i);return i};b.prototype._createFilterItemsSearchFieldBar=function(e){var t=this;var i=true;if(e.getDataType()!=F.String){i=false}var a=new sap.m.SearchField({value:e._getSearchValue(),width:"100%",enabled:i,tooltip:this._bundle.getText("FACETFILTER_SEARCH"),search:function(e){t._displayedList._handleSearchEvent(e)}});if(this.getLiveSearch()){a.attachLiveChange(e._handleSearchEvent,e)}var s=new sap.m.Bar({contentMiddle:a});e.setAssociation("search",a);return s};b.prototype._getFacetDialog=function(){var e=this.getAggregation("dialog");if(!e){var t=this;e=new sap.m.Dialog({showHeader:false,stretch:n.system.phone?true:false,afterClose:function(){t._addDelegateFlag=true;t._invalidateFlag=true;var e=this.getContent()[0];var i=e.getPages()[1];if(e.getCurrentPage()===i){var a=t._restoreListFromDisplayContainer(i);if(a.getMode()===y.MultiSelect){a._updateActiveState();t._bCheckForAddListBtn=true}a._fireListCloseEvent();a._search("")}this.destroyAggregation("content",true);t.invalidate()},beginButton:new sap.m.Button({text:this._bundle.getText("FACETFILTER_ACCEPT"),tooltip:this._bundle.getText("FACETFILTER_ACCEPT"),press:function(){t._closeDialog()}}),contentHeight:"500px",ariaLabelledBy:[r.getStaticId("sap.m","FACETFILTER_AVAILABLE_FILTER_NAMES")]});e.addStyleClass("sapMFFDialog");e.onsapentermodifiers=function(e){if(e.shiftKey&&!e.ctrlKey&&!e.altKey){var i=this.getContent()[0];t._navFromFilterItemsPage(i)}};this.setAggregation("dialog",e,true)}return e};b.prototype._closeDialog=function(){var e=this.getAggregation("dialog");if(e&&e.isOpen()){e.close();this._fireConfirmEvent()}};b.prototype._closePopover=function(){var e=this.getAggregation("popover");if(e&&e.isOpen()){e.close()}};b.prototype._createFacetList=function(){var e=this._oFacetList=new sap.m.List({mode:y.None,items:{path:"/items",template:new sap.m.StandardListItem({title:"{text}",counter:"{count}",type:m.Navigation,customData:[new sap.ui.core.CustomData({key:"index",value:"{index}"})]})}});var t=this._getMapFacetLists();var i=new sap.ui.model.json.JSONModel({items:t});if(t.length>100){i.setSizeLimit(t.length)}var a=this;e.attachUpdateFinished(function(){for(var t=0;t<e.getItems().length;t++){var i=this.getItems()[t];i.detachPress(a._handleFacetListItemPress,a);i.attachPress(a._handleFacetListItemPress,a)}});e.setModel(i);return e};b.prototype.refreshFacetList=function(){this._oFacetList.getModel().setData({items:this._getMapFacetLists()});return this};b.prototype._getMapFacetLists=function(){return this.getLists().map(function(e,t){return{text:e.getTitle(),count:e.getAllCount(),index:t}})};b.prototype._createSelectAllCheckboxBar=function(e){if(!e.getMultiSelect()){return null}var t=e.getActive()&&e.getItems().length>0&&Object.getOwnPropertyNames(e._oSelectedKeys).length===e.getItems().length;var i=new sap.m.CheckBox(e.getId()+"-selectAll",{text:this._bundle.getText("FACETFILTER_CHECKBOX_ALL"),tooltip:this._bundle.getText("FACETFILTER_CHECKBOX_ALL"),selected:t,select:function(t){i.setSelected(t.getParameter("selected"));e._handleSelectAllClick(t.getParameter("selected"))}});e.setAssociation("allcheckbox",i);var a=new sap.m.Bar;a.addEventDelegate({ontap:function(t){if(t.srcControl===this){e._handleSelectAllClick(i.getSelected())}}},a);a.addContentLeft(i);a.addStyleClass("sapMFFCheckbar");return a};b.prototype._handleFacetListItemPress=function(e){this._navToFilterItemsPage(e.getSource())};b.prototype._navToFilterItemsPage=function(e){this._selectedFacetItem=e;var t=this.getAggregation("dialog").getContent()[0];var i=e.getCustomData();d(i.length===1,"There should be exactly one custom data for the original facet list item index");var a=i[0].getValue();var s=this.getLists()[a];this._listIndexAgg=this.indexOfAggregation("lists",s);if(this._listIndexAgg==a){var r=this._getFilterItemsPage(t);s.fireListOpen({});this._moveListToDisplayContainer(s,r);r.setSubHeader(this._createFilterItemsSearchFieldBar(s));var o=this._createSelectAllCheckboxBar(s);if(o){r.insertContent(o,0)}r.setTitle(s.getTitle());t.to(r)}};b.prototype._navFromFilterItemsPage=function(e){var t=e.getPages()[1];var i=this._restoreListFromDisplayContainer(t);if(i.getMode()===y.MultiSelect){i._updateActiveState()}i._fireListCloseEvent();i._search("");this._selectedFacetItem.setCounter(i.getAllCount());e.backToTop()};b.prototype._moveListToDisplayContainer=function(e,t){this._listAggrIndex=this.indexOfAggregation("lists",e);d(this._listAggrIndex>-1,"The lists index should be valid.");l.prototype.removeAggregation.call(this,"lists",e,true);t.addAggregation("content",e,false);e.setAssociation("facetFilter",this,true);this._displayedList=e};b.prototype._restoreListFromDisplayContainer=function(e){var t=e.removeAggregation("content",this._displayedList,true);this.insertAggregation("lists",t,this._listAggrIndex,t.getActive());this._listAggrIndex=-1;this._displayedList=null;return t};b.prototype._getSequencedLists=function(){var e=-1;var t=[];var i=this.getLists();if(i.length>0){for(var a=0;a<i.length;a++){if(i[a].getActive()){if(i[a].getSequence()<-1){i[a].setSequence(-1)}else if(i[a].getSequence()>e){e=i[a].getSequence()}t.push(i[a])}else if(!i[a].getRetainListSequence()){i[a].setSequence(-1)}}for(var s=0;s<t.length;s++){if(t[s].getSequence()<=-1){e+=1;t[s].setSequence(e)}}if(t.length>1){t.sort(function(e,t){return e.getSequence()-t.getSequence()})}}return t};b.prototype._getSummaryBar=function(){var e=this.getAggregation("summaryBar");if(!e){var t=new sap.m.Text({maxLines:1});var i=this;e=new sap.m.Toolbar({content:[t],active:this.getType()===L.Light?true:false,design:_.Info,ariaLabelledBy:[r.getStaticId("sap.m","FACETFILTER_TITLE"),t],press:function(e){i.openFilterDialog()}});e._setRootAccessibilityRole("button");this.setAggregation("summaryBar",e)}return e};b.prototype._createResetButton=function(){var e=this;var t=new sap.m.Button({type:T.Transparent,icon:a.getIconURI("undo"),tooltip:this._bundle.getText("FACETFILTER_RESET"),press:function(t){e._addDelegateFlag=true;e._invalidateFlag=true;e.fireReset();var i=e.getLists();for(var a=0;a<i.length;a++){i[a]._searchValue="";i[a]._applySearch();var s=i[a].getItems()[0];if(s){s.focus()}}e.invalidate()}});return t};b.prototype._addOKButtonToPopover=function(e){var t=e.getFooter();if(!t){var i=this;var t=new sap.m.Button({text:this._bundle.getText("FACETFILTER_ACCEPT"),tooltip:this._bundle.getText("FACETFILTER_ACCEPT"),width:"100%",press:function(){i._closePopover()}});e.setFooter(t)}return t};b.prototype._getSummaryText=function(){var e=", ";var t=" ";var i="";var a=true;var s=this.getLists();if(s.length>0){for(var r=0;r<s.length;r++){var o=s[r];if(o.getActive()){var n=this._getSelectedItemsText(o);var l="";for(var g=0;g<n.length;g++){l=l+n[g]+e}if(l){l=l.substring(0,l.lastIndexOf(e)).trim();if(a){i=this._bundle.getText("FACETFILTER_INFOBAR_FILTERED_BY",[o.getTitle(),l]);a=false}else{i=i+t+this._bundle.getText("FACETFILTER_INFOBAR_AND")+t+this._bundle.getText("FACETFILTER_INFOBAR_AFTER_AND",[o.getTitle(),l])}}}}}if(!i){i=this._bundle.getText("FACETFILTER_INFOBAR_NO_FILTERS")}return i};b.prototype._getSelectedItemsText=function(e){var t=e.getSelectedItems().map(function(e){return e.getText()});e._oSelectedKeys&&Object.getOwnPropertyNames(e._oSelectedKeys).forEach(function(i){t.indexOf(e._oSelectedKeys[i])===-1&&t.push(e._oSelectedKeys[i])});return t};b.prototype._addResetToSummary=function(e){if(e.getContent().length===1){e.addContent(new sap.m.ToolbarSpacer({width:""}));var t=this._createResetButton();e.addContent(t);t.addStyleClass("sapUiSizeCompact");t.addStyleClass("sapMFFRefresh");t.addStyleClass("sapMFFBtnHoverable")}};b.prototype._removeResetFromSummary=function(e){if(e.getContent().length===3){var t=e.removeAggregation("content",1);t.destroy();var i=e.removeAggregation("content",1);i.destroy()}};b.prototype._removeList=function(e){if(e){var t=this._buttons[e.getId()];if(t){this.removeAggregation("buttons",t);t.destroy()}var i=this._removeFacetIcons[e.getId()];if(i){this.removeAggregation("removeIcons",i);i.destroy()}delete this._buttons[e.getId()];delete this._removeFacetIcons[e.getId()]}};b.prototype._getScrollingArrow=function(e){var t=null;var i={src:"sap-icon://navigation-"+e+"-arrow"};if(e==="left"){t=this.getAggregation("arrowLeft");if(!t){i.id=this.getId()+"-arrowScrollLeft";t=a.createControlByURI(i);var s=["sapMPointer","sapMFFArrowScroll","sapMFFArrowScrollLeft"];for(var r=0;r<s.length;r++){t.addStyleClass(s[r]);t.setTooltip(this._bundle.getText("FACETFILTER_PREVIOUS"))}this.setAggregation("arrowLeft",t)}}else if(e==="right"){t=this.getAggregation("arrowRight");if(!t){i.id=this.getId()+"-arrowScrollRight";t=a.createControlByURI(i);var o=["sapMPointer","sapMFFArrowScroll","sapMFFArrowScrollRight"];for(var r=0;r<o.length;r++){t.addStyleClass(o[r]);t.setTooltip(this._bundle.getText("FACETFILTER_NEXT"))}this.setAggregation("arrowRight",t)}}else{c.error("Scrolling arrow name "+e+" is not valid")}return t};b.prototype._checkOverflow=function(){var e=this.getDomRef("head"),t=v(e),i=this.$(),a=false,s=false,r=false,o=null,n=null,l=null;if(e){o=e.scrollLeft;n=e.scrollWidth;l=e.clientWidth;if(n>l){if(n-l==1){n=l}else{r=true}}i.toggleClass("sapMFFScrolling",r);i.toggleClass("sapMFFNoScrolling",!r);this._lastScrolling=r;if(!this._bRtl){a=o>0;s=n>l&&n>o+l}else{s=t.scrollLeftRTL()>0;a=t.scrollRightRTL()>0}if(s!=this._bPreviousScrollForward||a!=this._bPreviousScrollBack){i.toggleClass("sapMFFNoScrollBack",!a);i.toggleClass("sapMFFNoScrollForward",!s)}}};b.prototype.onclick=function(e){var t=e.target.id;if(t){var i=this.getId(),a=e.target;e.preventDefault();if(t==i+"-arrowScrollLeft"){a.tabIndex=-1;a.focus();this._scroll(-b.SCROLL_STEP,500)}else if(t==i+"-arrowScrollRight"){a.tabIndex=-1;a.focus();this._scroll(b.SCROLL_STEP,500)}}};b.prototype._scroll=function(e,t){var i=this.getDomRef("head");var a=i.scrollLeft;if(!n.browser.internet_explorer&&this._bRtl){e=-e}var s=a+e;v(i).stop(true,true).animate({scrollLeft:s},t)};b.prototype._enableTouchSupport=function(){var e=this;var t=function(t){var i=e.getType();if(i===L.Light){return}t.preventDefault();if(e._iInertiaIntervalId){window.clearInterval(e._iInertiaIntervalId)}e.startScrollX=e.getDomRef("head").scrollLeft;e.startTouchX=t.touches[0].pageX;e._bTouchNotMoved=true;e._lastMoveTime=(new Date).getTime()};var i=function(t){var i=e.getType();if(i===L.Light){return}var a=t.touches[0].pageX-e.startTouchX;var s=e.getDomRef("head");var r=s.scrollLeft;var o=e.startScrollX-a;s.scrollLeft=o;e._bTouchNotMoved=false;var n=(new Date).getTime()-e._lastMoveTime;e._lastMoveTime=(new Date).getTime();if(n>0){e._velocity=(o-r)/n}t.preventDefault()};var a=function(t){var i=e.getType();if(i===L.Light){return}if(e._bTouchNotMoved===false){t.preventDefault();var a=e.getDomRef("head");var s=50;var r=Math.abs(e._velocity/10);e._iInertiaIntervalId=window.setInterval(function(){e._velocity=e._velocity*.8;var t=e._velocity*s;a.scrollLeft=a.scrollLeft+t;if(Math.abs(e._velocity)<r){window.clearInterval(e._iInertiaIntervalId);e._iInertiaIntervalId=undefined}},s)}else if(e._bTouchNotMoved===true){e.onclick(t);t.preventDefault()}e._bTouchNotMoved=undefined;e._lastMoveTime=undefined};this.addEventDelegate({ontouchstart:t},this);this.addEventDelegate({ontouchend:a},this);this.addEventDelegate({ontouchmove:i},this)};return b});