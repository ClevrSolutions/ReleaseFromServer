/**
 ReleaseFromServer widget
 ========================

 @file      : ReleaseFromServer.js
 @version   : 1.0
 @author    : Diego Slijkhuis
 @date      : 30-09-2016
 @copyright : Mansystems Nederland B.V.
 @license   : Apache License, Version 2.0, January 2004

 Documentation
 =============
 ExpertDesk 9.6 specific widget for the startpanel to release data
 Change log
 ==========
 1.0 Initial release

 */
// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
	"dojo/_base/declare",
	"mxui/widget/_WidgetBase",
	"dojo/_base/lang"
], function(declare, _WidgetBase, lang){
	"use strict";
	// Declare widget's prototype.
	return declare("ReleaseFromServer.widget.ReleaseFromServer", [_WidgetBase], {
		// Template path
		// Parameters configured in the Modeler.
		doRelease: null,
		doRollback: null,
    
		_contextObj: null,
		_previousObj: null,
		_handles: null,
    constructor: function(){
    },
	
    postCreate: function(){
		  //logger.level(logger.DEBUG);
	    logger.debug(this.id + ".postCreate");
    },
    
    update: function(obj, callback){
	    logger.debug(this.id + ".update");
	    this._previousObj = this._contextObj;
	    this._contextObj = obj;
	    this._resetSubscriptions();
	    if(this.doRollback) this._rollbackNow();
	    else if(this.doRelease) this._releaseNow();
	    callback();
    },
    _updateRendering: function(){
    },
    _checks: function(){
	    return (this._previousObj != null && (this._contextObj == null || (this._contextObj != null && this._contextObj.getGuid() != this._previousObj.getGuid())));
    },
    _releaseNow: function(){
    	if(this._checks()){
    		mx.data.release(this._previousObj);
	    	this._previousObj = null;
	    	logger.debug(this.id + ': released object');
	    }
    },
    _rollbackNow: function(){
    	if(this._checks()){
  			var stored = this._previousObj;
  			mx.data.rollback({
  				mxobj: this._previousObj,
  				callback: function(){
  					mx.data.release(stored);
  				}
  			});
    	}
    },
    uninitialize: function(){
      logger.debug(this.id + ".uninitialize");
	    if(this.doRollback) this._rollbackNow();
	    else if(this.doRelease) this._releaseNow();
    },
	  _resetSubscriptions: function(){
			var objHandle = null, 
				attrHandle = null;

			// Release handles on previous object, if any.
			if (this._handles){
				this._handles.forEach(function(handle, i){
					mx.data.unsubscribe(handle);
				});
			}

			if (this._contextObj){
				objHandle = this.subscribe({
					guid: this._contextObj.getGuid(),
					callback: lang.hitch(this,function(guid){
						this._updateRendering();
					})
				});

				attrHandle = this.subscribe({
					guid: this._contextObj.getGuid(),
					attr: this.messageString,
					callback: lang.hitch(this,function(guid,attr,attrValue){
						this._updateRendering();
					})
				});

				this._handles = [objHandle, attrHandle];
			}
		},
		_toString: function(){
		  // toString results into [Widget <ns+class>, <instanceid>], only want widget class; Could parse the toString() value
		  return "[ReleaseFromServer.widget.ReleaseFromServer]";
		}
	});
});

require(["ReleaseFromServer/widget/ReleaseFromServer"], function(){
    "use strict";
});
