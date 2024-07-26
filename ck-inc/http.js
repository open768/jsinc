"use strict"
/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024
This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
/* global cCommonStatus */

//###############################################################
//# add functions to Jquery
//###############################################################
$(function () {
	$.postJSON = (psUrl, poData, pfFunc) => {
		return $.post(psUrl, poData, pfFunc, "json")
	}
})

//###############################################################
//# HTTP
//###############################################################
class cHttpFailer {
	//TODO when this fails its not graceful, should call the caller and tell them theres an error
	url = null
	fail(jqxhr, textStatus, error) {
		cCommonStatus.set_error_status("call failed: check console")
		cDebug.write("ERROR: " + textStatus + "," + error + " : " + this.url)
	}
}

//###############################################################
//###############################################################
// eslint-disable-next-line no-unused-vars
class cHttp {
	//@todo make this OO not a singleton

	static fetch_json(psUrl, pfnCallBack) {
		var oFailer
		//if the url doesnt contain http
		if (psUrl.search("http:") == -1)
			cDebug.write(cBrowser.baseUrl() + psUrl)
		else cDebug.write(psUrl)
		oFailer = new cHttpFailer()
		oFailer.url = psUrl
		$.getJSON(psUrl, pfnCallBack).fail(oFailer.fail)
	}

	//***************************************************************
	static post(psUrl, poData, pfnCallBack) {
		if (psUrl.search("http:") == -1)
			cDebug.write(cBrowser.baseUrl() + psUrl)
		else cDebug.write(psUrl)
		var oFailer = new cHttpFailer()
		oFailer.url = psUrl

		//- - - - - make the call
		$.post(psUrl, poData, pfnCallBack).fail(oFailer.fail)
	}
}

//###############################################################
//# use
//#    success_callback = function(poHttp){ ... do something here with poHttp.response ... })
//#    error_callback = function(poHttp){ ... do something here with pohttp.error... })
//#		ohttp = new cHttp2();
//# 	bean.on(ohttp,"result",		function(po){ success_callback(po.u, po.d)}	);
//# 	bean.on(ohttp,"error",		function(poHttp) {error_callback()}			);
//#		ohttp.fetch_json("http:..","something");

//###############################################################
// eslint-disable-next-line no-unused-vars
class cHttp2 {
	url = null
	data = null
	error = null
	errorStatus = null
	response = null
	event = null
	stopping = false
	oXHR = null //holds the XHR request object

	//**************************************************************
	fetch_json(psUrl, poData) {
		var oThis = this

		this.url = psUrl
		this.correct_url()
		this.data = poData //never used
		cDebug.write("fetching url: " + this.url)
		if (poData)
			this.oXHR = $.postJSON(this.url, this.data, function (pResult) {
				oThis.onResult(pResult)
			}).fail(function (pEv, pSt, pEr) {
				oThis.onError(pEv, pSt, pEr)
			})
		else
			this.oXHR = $.getJSON(this.url, function (pResult) {
				oThis.onResult(pResult)
			}).fail(function (pEv, pSt, pEr) {
				oThis.onError(pEv, pSt, pEr)
			})
	}

	//**************************************************************
	post(psUrl, poData) {
		var oThis = this
		this.url = psUrl
		this.correct_url()
		this.data = poData

		this.oXHR = $.post(this.url, poData, (pResult) =>
			oThis.onResult(pResult)
		).fail((pEv, pSt, pEr) => oThis.onError(pEv, pSt, pEr))
	}

	correct_url() {
		if (this.url.match(/^http/) == null) {
			this.url = cBrowser.baseUrl() + this.url
		}
	}

	//***************************************************************
	stop() {
		this.stopping = true
		if (this.oXHR) {
			try {
				this.oXHR.abort()
			} catch (e) {
				cDebug.write("cant stop while getting it on!")
			}
			this.oXHR = null
		}
	}

	//################################################################
	//# Events
	//################################################################
	onResult(poResponse) {
		if (this.stopping) return

		this.response = poResponse
		bean.fire(this, "result", this) //notify subscriber
	}

	//**************************************************************
	onError(poEvent, psStatus, poError) {
		if (this.stopping) return
		this.event = poEvent
		this.error = poError
		this.errorStatus = psStatus
		cDebug.write_err("URL error: " + this.url)
		bean.fire(this, "error", this) //notify subscriber
	}
}
