/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

//###############################################################
//# HTTP
//###############################################################
function cHttpFailer(){
	//TODO when this fails its not graceful, should call the caller and tell them theres an error
	this.url = null;
	this.fail = function( jqxhr, textStatus, error ){
		set_error_status("call failed: check console" );
		cDebug.write("ERROR: " + textStatus + "," + error + " : " + this.url);		
	}
}

//###############################################################
//###############################################################
var cHttp = {
	//TODO make this OO not a singleton
	
	fetch_json:function(psUrl, pfnCallBack){	
		var oFailer;
		//if the url doesnt contain http
		if (psUrl.search("http:") == -1)
			cDebug.write(cBrowser.baseUrl() + psUrl);
		else
			cDebug.write(psUrl);
		oFailer = new cHttpFailer;
		oFailer.url = psUrl;
		$.getJSON(psUrl, pfnCallBack).fail(oFailer.fail);
	},
	
	//***************************************************************
	post:function(psUrl, poData, pfnCallBack){
		if (psUrl.search("http:") == -1)
			cDebug.write(cBrowser.baseUrl() + psUrl);
		else
			cDebug.write(psUrl);
		oFailer = new cHttpFailer;
		oFailer.url = psUrl;
		
		//- - - - - make the call
		$.post(psUrl, poData, pfnCallBack).fail(oFailer.fail);
	}
}

//###############################################################
//# use 
//#    success_callback = function(poHttp){ ... do something here ... })
//#    error_callback = function(poHttp){ ... do something here ... })
//#		ohttp = new cHttp2();
//# 	bean.on(ohttp,"result",		function(po){ success_callback(po.u, po.d)}	);
//# 	bean.on(ohttp,"error",		function(poHttp) {error_callback()}			);
//#		ohttp.fetch_json("http:..","something");

//###############################################################
function cHttp2(){
	this.url = null;
	this.data = null;
	this.error = null;
	this.errorStatus = null;
	this.response = null;
	this.event = null;
		
	//**************************************************************
	this.fetch_json = function(psUrl, pvData){
		var oThis = this;

		this.url = psUrl;
		this.correct_url();
		this.data = pvData;
		cDebug.write("fetching url: " + this.url);
		$.getJSON(
			this.url, 
			function(rs){oThis.onResult(rs)}
		).fail(
			function(ev,st,er){oThis.onError(ev,st,er)}
		);
	};
	
	//**************************************************************
	this.post = function(psUrl, poData){
		var oThis = this;
		this.url = psUrl;
		this.correct_url();
		this.data = poData;
		
		$.post(
			this.url, 
			function(rs){oThis.onResult(rs)}
		).fail(
			function(ev,st,er){oThis.onError(ev,st,er)}
		);
	};
	
	this.correct_url = function(){
		if (this.url.search("http:") == -1){
			this.url = cBrowser.baseUrl() + this.url;
			cDebug.write("correct url is:" + this.url);
		}
		
	};
	
	//################################################################
	//# Events
	//################################################################
	this.onResult = function(poResponse){
		this.response = poResponse;
		bean.fire(this,"result", this); //notify subscriber 
	};
	
	//**************************************************************
	this.onError = function(poEvent, psStatus, poError){
		this.event = poEvent;
		this.error = poError;
		this.errorStatus = psStatus;
		cDebug.write_err("URL error: " + this.url);
		bean.fire(this,"error", this); //notify subscriber 
	}
}
