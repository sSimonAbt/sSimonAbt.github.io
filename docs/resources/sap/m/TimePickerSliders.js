/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library","sap/ui/core/Control","sap/ui/model/type/Date","sap/ui/model/odata/type/ODataType","sap/ui/core/format/DateFormat","./TimePickerSlidersRenderer","./TimePickerSlider","./VisibleItem","sap/ui/core/LocaleData","sap/ui/Device","sap/ui/core/Locale","./TimePickerSlidersRenderer","sap/ui/thirdparty/jquery"],function(e,t,i,r,s,n,o,a,l,u,d,p,g){"use strict";var h=1,f=e.CalendarType;var c=t.extend("sap.m.TimePickerSliders",{metadata:{library:"sap.m",properties:{localeId:{type:"string",group:"Data"},displayFormat:{name:"displayFormat",type:"string",group:"Appearance"},labelText:{name:"labelText",type:"string"},minutesStep:{type:"int",group:"Misc",defaultValue:h},secondsStep:{type:"int",group:"Misc",defaultValue:h},width:{type:"sap.ui.core.CSSSize",group:"Appearance"},height:{type:"sap.ui.core.CSSSize",group:"Appearance"},value:{type:"string",group:"Data",defaultValue:null},valueFormat:{type:"string",group:"Data",defaultValue:null},support2400:{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{_columns:{type:"sap.m.TimePickerSlider",multiple:true,visibility:"hidden"}},events:{change:{parameters:{value:{type:"string"}}}}}});c.prototype.init=function(){var e=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale(),t=l.getInstance(e),i=t.getDayPeriods("abbreviated"),r=t.getTimePattern("medium");this._fnLayoutChanged=g.proxy(this._onOrientationChanged,this);u.resize.attachHandler(this._fnLayoutChanged);this._sAM=i[0];this._sPM=i[1];this._onSliderExpanded=this._onSliderExpanded.bind(this);this._onSliderCollapsed=this._onSliderCollapsed.bind(this);this.setDisplayFormat(r);this._setTimeValues();this._iMinutes;this._iSeconds};c.prototype.exit=function(){this.$().off(!!u.browser.firefox?"DOMMouseScroll":"mousewheel",this._onmousewheel);u.resize.detachHandler(this._fnOrientationChanged)};c.prototype.onAfterRendering=function(){this.$().off(!!u.browser.firefox?"DOMMouseScroll":"mousewheel",this._onmousewheel);this.$().on(!!u.browser.firefox?"DOMMouseScroll":"mousewheel",g.proxy(this._onmousewheel,this));this.$().on("selectstart",S);if(this._getShouldOpenSliderAfterRendering()){if(u.system.desktop){this._getFirstSlider().setIsExpanded(true)}}};c.prototype.setLocaleId=function(e){var t,i;e=this.validateProperty("localeId",e);this.setProperty("localeId",e,true);if(e){t=new d(e);i=l.getInstance(t).getDayPeriods("abbreviated");this._sAM=i[0];this._sPM=i[1];this._destroyColumns();this._setupLists()}return this};c.prototype.setSupport2400=function(e){this.setProperty("support2400",e,true);this._destroyColumns();this._setupLists();return this};c.prototype.setDisplayFormat=function(e){this.setProperty("displayFormat",e,true);this._destroyColumns();this._setupLists();return this};c.prototype.setMinutesStep=function(e){e=Math.max(h,e||h);this.setProperty("minutesStep",e,true);this._destroyColumns();this._setupLists();return this};c.prototype.setSecondsStep=function(e){e=Math.max(h,e||h);this.setProperty("secondsStep",e,true);this._destroyColumns();this._setupLists();return this};c.prototype.setValue=function(e){var t=this._getHoursSlider(),i=this._getValueFormatPattern(),r=i.indexOf("HH"),s=i.indexOf("H"),n=t&&t.getSelectedValue()==="24",o=c._isHoursValue24(e,r,s);if(n&&this._isFormatSupport24()&&!o){e=c._replaceZeroHoursWith24(e,r,s)}e=this.validateProperty("value",e);this.setProperty("value",e,true);var a;if(e){a=this._parseValue(o?c._replace24HoursWithZero(e,r,s):e)}if(a){this._setTimeValues(a,o)}return this};c.prototype.getTimeValues=function(){var e=this._getHoursSlider(),t=this._getMinutesSlider(),i=this._getSecondsSlider(),r=this._getFormatSlider(),s=null,n=null,o=new Date;if(e){s=parseInt(e.getSelectedValue())}if(r){n=r.getSelectedValue()}if(n==="am"&&s===12){s=0}else if(n==="pm"&&s!==12){s+=12}if(s!==null){o.setHours(s.toString())}if(t){o.setMinutes(t.getSelectedValue())}if(i){o.setSeconds(i.getSelectedValue())}return o};c.prototype.collapseAll=function(){var e=this.getAggregation("_columns");if(e){for(var t=0;t<e.length;t++){if(e[t].getIsExpanded()){e[t].setIsExpanded(false)}}}return this};c.prototype.openFirstSlider=function(){var e=this._getFirstSlider();e.setIsExpanded(true);e.focus();return this};c.prototype._setTimeValues=function(e,t){var i=this._getHoursSlider(),r=this._getMinutesSlider(),s=this._getSecondsSlider(),n=this._getFormatSlider(),o,a=null;e=e||new Date;if(e&&g.type(e)!=="date"){throw new Error("Date must be a JavaScript date object; "+this)}if(!t){var l=this._formatValue(e,true);this.setProperty("value",l,true);o=e.getHours()}else{o=24}if(n){a=o>=12?"pm":"am";o=o>12?o-12:o;o=o===0?12:o}i&&i.setSelectedValue(o.toString());r&&r._updateStepAndValue(e.getMinutes(),this.getMinutesStep());s&&s._updateStepAndValue(e.getSeconds(),this.getSecondsStep());n&&n.setSelectedValue(a);if(t){this._disableSlider(r);r&&r.setSelectedValue("0");this._disableSlider(s);s&&s.setSelectedValue("0")}else{this._enableSlider(r);this._enableSlider(s)}};c.prototype._updateSlidersValues=function(){var e=this.getAggregation("_columns");if(e){for(var t=0;t<e.length;t++){e[t]._updateScroll()}}};c.prototype.onsaphome=function(e){var t=this._getFirstSlider(),i=this._getCurrentSlider();if(i&&document.activeElement===i.getDomRef()&&this._isSliderEnabled(t)){t.focus()}};c.prototype.onsapend=function(e){var t=this._getLastSlider(),i=this._getCurrentSlider();if(i&&document.activeElement===i.getDomRef()&&this._isSliderEnabled(t)){t.focus()}};c.prototype.onsapleft=function(e){var t,i=this._getCurrentSlider(),r=-1,s=-1,n=this.getAggregation("_columns");if(i&&document.activeElement===i.getDomRef()){r=n.indexOf(i);s=r>0?r-1:n.length-1;t=n[s];if(this._isSliderEnabled(t)){t.focus()}}};c.prototype.onsapright=function(e){var t,i=this._getCurrentSlider(),r=-1,s=-1,n=this.getAggregation("_columns");if(i&&document.activeElement===i.getDomRef()){r=n.indexOf(i);s=r<n.length-1?r+1:0;t=n[s];if(this._isSliderEnabled(t)){t.focus()}}};c.prototype._onmousewheel=function(e){var t=this._getCurrentSlider();if(t){t._onmousewheel(e)}};c.prototype._onOrientationChanged=function(){var e=this.getAggregation("_columns");if(!e){return}for(var t=0;t<e.length;t++){if(e[t].getIsExpanded()){e[t]._updateSelectionFrameLayout()}}};c.prototype._generatePickerListValues=function(e,t,i,r){var s=[],n;for(var o=e;o<=t;o+=1){if(o<10&&r){n="0"+o.toString()}else{n=o.toString()}var l=new a({key:o.toString(),text:n});if(o%i!==0){l.setVisible(false)}s.push(l)}return s};c.prototype._checkStyle=function(e){return e==="short"||e==="medium"||e==="long"||e==="full"};c.prototype._getDisplayFormatPattern=function(){var e=this.getDisplayFormat();if(this._checkStyle(e)){e=this._getLocaleBasedPattern(e)}return e};c.prototype._getValueFormatPattern=function(){var e=this._getBoundValueTypePattern()||this.getValueFormat()||"medium";if(this._checkStyle(e)){e=this._getLocaleBasedPattern(e)}return e};c.prototype._getLocaleBasedPattern=function(e){return l.getInstance(sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale()).getTimePattern(e)};c.prototype._destroyColumns=function(){var e=this.getAggregation("_columns");if(e){this.destroyAggregation("_columns")}};c.prototype._setupLists=function(){var e=sap.ui.getCore().getLibraryResourceBundle("sap.m"),t=e.getText("TIMEPICKER_LBL_HOURS"),i=e.getText("TIMEPICKER_LBL_MINUTES"),r=e.getText("TIMEPICKER_LBL_SECONDS"),s=e.getText("TIMEPICKER_LBL_AMPM"),n=this.getMinutesStep(),a=this.getSecondsStep(),l=this._getDisplayFormatPattern();if(l===undefined){return}var u=false,d=false,p,g;if(l.indexOf("HH")!==-1){u=true;p=0;g=this.getSupport2400()?24:23;d=true}else if(l.indexOf("H")!==-1){u=true;p=0;g=this.getSupport2400()?24:23}else if(l.indexOf("hh")!==-1){u=true;p=1;g=12;d=true}else if(l.indexOf("h")!==-1){u=true;p=1;g=12}if(u){this.addAggregation("_columns",new o(this.getId()+"-listHours",{items:this._generatePickerListValues(p,g,1,d),expanded:this._onSliderExpanded,collapsed:this._onSliderCollapsed,label:t}).attachEvent("_selectedValueChange",this._handleHoursChange,this))}if(l.indexOf("m")!==-1){var h=this._generatePickerListValues(0,59,n,true);this.addAggregation("_columns",new o(this.getId()+"-listMins",{items:h,expanded:this._onSliderExpanded,collapsed:this._onSliderCollapsed,label:i}))}if(l.indexOf("s")!==-1){var h=this._generatePickerListValues(0,59,a,true);this.addAggregation("_columns",new o(this.getId()+"-listSecs",{items:h,expanded:this._onSliderExpanded,collapsed:this._onSliderCollapsed,label:r}))}if(l.indexOf("a")!==-1){this.addAggregation("_columns",new o(this.getId()+"-listFormat",{items:[{key:"am",text:this._sAM},{key:"pm",text:this._sPM}],expanded:this._onSliderExpanded,collapsed:this._onSliderCollapsed,label:s,isCyclic:false}).addStyleClass("sapMTimePickerSliderShort"))}var f,c=this.getValue();if(c){f=this._parseValue(c)}if(f){this._setTimeValues(f)}};c.prototype._getCurrentSlider=function(){var e=this.getAggregation("_columns");if(e){for(var t=0;t<e.length;t++){if(e[t].getIsExpanded()){return e[t]}}}return null};c.prototype._getHoursSlider=function(){return sap.ui.getCore().byId(this.getId()+"-listHours")||null};c.prototype._getMinutesSlider=function(){return sap.ui.getCore().byId(this.getId()+"-listMins")||null};c.prototype._getSecondsSlider=function(){return sap.ui.getCore().byId(this.getId()+"-listSecs")||null};c.prototype._getFormatSlider=function(){return sap.ui.getCore().byId(this.getId()+"-listFormat")||null};c.prototype._getFirstSlider=function(){return this.getAggregation("_columns")[0]||null};c.prototype._getLastSlider=function(){var e=this.getAggregation("_columns");return e[e.length-1]||null};c.prototype._parseValue=function(e){return this._getFormatter().parse(e)};c.prototype._isSliderEnabled=function(e){return e._getEnabled()};c.prototype._getFormatter=function(){var e=this._getBoundValueTypePattern(),t=false,i=this.getBinding("value"),r;if(i&&i.oType&&i.oType.oOutputFormat){t=!!i.oType.oOutputFormat.oFormatOptions.relative;r=i.oType.oOutputFormat.oFormatOptions.calendarType}if(!e){e=this.getValueFormat()||"medium";r=f.Gregorian}if(!r){r=sap.ui.getCore().getConfiguration().getCalendarType()}return this._getFormatterInstance(e,t,r)};c.prototype._getBoundValueTypePattern=function(){var e=this.getBinding("value"),t=e&&e.getType&&e.getType();if(t instanceof i){return t.getOutputPattern()}if(t instanceof r&&t.oFormat){return t.oFormat.oFormatOptions.pattern}return undefined};c.prototype._getFormatterInstance=function(e,t,i,r){var s;if(this._checkStyle(e)){s=this._getFormatInstance({style:e,strictParsing:true,relative:t,calendarType:i})}else{s=this._getFormatInstance({pattern:e,strictParsing:true,relative:t,calendarType:i})}return s};c.prototype._getFormatInstance=function(e,t){return s.getTimeInstance(e)};c.prototype._formatValue=function(e){if(e){return this._getFormatter().format(e)}return""};c.prototype._onSliderExpanded=function(e){var t=this.getAggregation("_columns");for(var i=0;i<t.length;i++){if(t[i]!==e.oSource&&t[i].getIsExpanded()){t[i].setIsExpanded(false)}}};c.prototype._onSliderCollapsed=function(e){var t=this.getTimeValues();this.setValue(this._formatValue(t,true));this.fireChange({value:this.getValue()})};c.prototype._getShouldOpenSliderAfterRendering=function(){return this._shouldOpenSliderAfterRendering};c.prototype._setShouldOpenSliderAfterRendering=function(e){this._shouldOpenSliderAfterRendering=e;return this};c.prototype._isFormatSupport24=function(){var e=this._getDisplayFormatPattern();return e.indexOf("HH")!==-1||e.indexOf("H")!==-1};c.prototype._disableSlider=function(e){if(e){e._setEnabled(false)}return this};c.prototype._enableSlider=function(e){if(e){e._setEnabled(true)}return this};c.prototype._handleHoursChange=function(e){var t=e.getParameter("value"),i=this._getMinutesSlider(),r=this._getSecondsSlider();if(this.getSupport2400()){if(t==="24"){if(i&&i._getEnabled()){this._iMinutes=i.getSelectedValue();this._disableSlider(i);i.setSelectedValue("0")}if(r&&r._getEnabled()){this._iSeconds=r.getSelectedValue();this._disableSlider(r);r.setSelectedValue("0")}}else{if(i&&!i._getEnabled()){this._enableSlider(i);i.setSelectedValue(this._iMinutes)}if(r&&!r._getEnabled()){this._enableSlider(r);r.setSelectedValue(this._iSeconds)}}}};c._replaceZeroHoursWith24=function(e,t,i){var r=2,s=t;if(t===-1){r=1;s=i}return e.substr(0,s)+"24"+e.substr(s+r)};c._replace24HoursWithZero=function(e,t,i){var r=2,s=t;if(t===-1){r=1;s=i}return e.substr(0,s)+_(0,r)+e.substr(s+2)};c._isHoursValue24=function(e,t,i){if(t===-1&&i===-1){return false}var r=t;if(t===-1){r=i}return e.substr(r,2)==="24"};function _(e,t){var i="";for(var r=0;r<t;r++){i+=e}return i}function S(){return false}return c});