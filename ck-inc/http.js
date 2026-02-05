'use strict'
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
//# HTTP
//###############################################################
class cHttpFailer {
	//TODO when this fails its not graceful, should call the caller and tell them theres an error
	url = null
	fail(jqxhr, textStatus, error) {
		cCommonStatus.set_error_status('call failed: check console')
		cDebug.write('ERROR: ' + textStatus + ',' + error + ' : ' + this.url)
	}
}

//###############################################################
//###############################################################
// eslint-disable-next-line no-unused-vars
class cHttp {
	//@todo make this OO not a singleton

	static async fetch_json(psUrl, pfnCallBack) {
		cDebug.write_err('cHttp is deprecated')
		var oFailer
		//if the url doesnt contain http
		if (psUrl.search('http:') == -1) cDebug.write(cBrowser.baseUrl() + psUrl)
		else cDebug.write(psUrl)
		oFailer = new cHttpFailer()
		oFailer.url = psUrl
		$.getJSON(psUrl, pfnCallBack).fail(oFailer.fail)
	}

	//***************************************************************
	static async post(psUrl, poData, pfnCallBack) {
		cDebug.write_err('cHttp is deprecated')
		if (psUrl.search('http:') == -1) cDebug.write(cBrowser.baseUrl() + psUrl)
		else cDebug.write(psUrl)
		var oFailer = new cHttpFailer()
		oFailer.url = psUrl

		//- - - - - make the call
		$.post(psUrl, poData, pfnCallBack).fail(oFailer.fail)
	}
}

//###############################################################
//# use
//#		ohttp = new cHttp2();
//# 	bean.on(ohttp,"result",		(poResult)=>{ do something}	);
//# 	bean.on(ohttp,"error",		(poHttp) => { do something}		);
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

	/**
	 * wrapper for jquery post
	 *
	 * @param {*} psUrl url to fetch from
	 * @param {*} poData data to send
	 * @param {*} pfFunc callback
	 * @returns
	 */
	postJSON(psUrl, poData, pfFunc) {
		return $.post(psUrl, poData, pfFunc, 'json')
	}

	//**************************************************************
	async fetch_json(psUrl, poData) {
		this.url = psUrl
		this.correct_url()
		this.data = poData

		cDebug.write('fetching url: ' + this.url)
		if (poData)
			this.oXHR = this.postJSON(this.url, this.data, pResult => {
				this.onResult(pResult)
			}).fail((pEv, pSt, pEr) => {
				this.onError(pEv, pSt, pEr)
			})
		else
			this.oXHR = $.getJSON(this.url, pResult => {
				this.onResult(pResult)
			}).fail((pEv, pSt, pEr) => {
				this.onError(pEv, pSt, pEr)
			})
	}

	//**************************************************************
	async post(psUrl, poData) {
		this.url = psUrl
		this.correct_url()
		this.data = poData

		var fnCallBack = pResult => this.onResult(pResult)
		if (cDebug.is_debugging()) {
			var sGetUrl = cBrowser.buildUrl(this.url, poData)
			cDebug.write('posting url: ' + sGetUrl)
			this.oXHR = $.get(sGetUrl, null, fnCallBack)
		} else {
			this.oXHR = $.post(this.url, poData, fnCallBack)
		}
		this.oXHR.fail((pEv, pSt, pEr) => this.onError(pEv, pSt, pEr))
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
				cDebug.write('cant stop while getting it on!')
			}
			this.oXHR = null
		}
	}

	//################################################################
	//# Events
	//################################################################
	async onResult(poResponse) {
		if (this.stopping) return

		this.response = poResponse
		bean.fire(this, 'result', this) //notify subscriber
	}

	//**************************************************************
	async onError(poEvent, psStatus, poError) {
		if (this.stopping) return
		this.event = poEvent
		this.error = poError
		this.errorStatus = psStatus
		cDebug.write_err('URL error: ' + this.url)
		cDebug.write_err(poError)
		bean.fire(this, 'error', this) //notify subscriber
	}
}
