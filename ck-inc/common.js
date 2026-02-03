'use strict'
/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024
This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

var STATUS_ID = 'status'

//###############################################################
//# STRINGS
//###############################################################
class cString {
	static last(psText, psSearch) {
		var sReverseTxt = this.reverse(psText)
		var sReverseSearch = this.reverse(psSearch)

		var iFound = sReverseTxt.search(sReverseSearch)

		if (iFound != -1) iFound = psText.length - iFound
		return iFound
	}

	//***************************************************************
	static reverse(psText) {
		return psText.split('').reverse().join('')
	}

	//***************************************************************
	//count common characters from left
	static count_common_chars(ps1, ps2) {
		var iCheckLen = Math.min(ps1.length, ps2.length)
		var i

		for (i = 0; i < iCheckLen; i++) if (ps1[i] !== ps2[i]) break
		return i
	}

	//***************************************************************
	static is_string_empty(psText) {
		return psText === null || psText === ''
	}
}

if (!String.prototype.padLeft)
	String.prototype.padLeft =
		function (psPad, piSize) {
			var iDiff = piSize - this.length
			if (iDiff > 0) return psPad.repeat(iDiff) + this
			else return this
		}

//###############################################################
//# common
//###############################################################
/* eslint-disable-next-line no-unused-vars */
class cCommon {
	static SINGLE_WINDOW = true

	static deep_copy(poThing) {
		return JSON.parse(JSON.stringify(poThing))
	}

	//***************************************************************
	static obj_is(poObj, psClassName) {
		if (poObj == null) throw 'obj_is: null param1!'
		if (typeof poObj !== 'object') throw 'obj_is: object expected for param1'

		var sObjType = typeof psClassName
		if (sObjType === 'string') return poObj.constructor.name === psClassName
		else if (sObjType === 'object') return poObj.constructor.name === psClassName.constructor.name
		else throw 'param2: string expected, got: ' + sObjType
	}

	//***************************************************************
	//from https://gist.github.com/lanqy/5193417
	static bytesToSize(bytes) {
		const units = ['byte', 'kilobyte', 'megabyte', 'terabyte', 'petabyte']
		const unit = Math.floor(Math.log(bytes) / Math.log(1024))
		return new Intl.NumberFormat('en', {
			style: 'unit',
			unit: units[unit]
		}).format(bytes / 1024 ** unit)
	}

	static is_numeric(psThing) {
		return !isNaN(psThing)
	}
}

//###############################################################
//# BROWSER
//###############################################################
class cBrowser {
	static data = null

	//***************************************************************
	static init() {
		var oResult = {},
			aPairs
		var sKey, sValue

		aPairs = location.search.slice(1).split('&')
		aPairs.forEach(function (sPair) {
			var aPair = sPair.split('=')
			sKey = aPair[0]
			sValue = decodeURI(aPair[1]).replace(/\+/g, ' ')
			oResult[sKey] = sValue || ''
		})

		this.data = oResult
	}

	//***************************************************************
	static pageUrl() {
		return document.URL.split('?')[0]
	}

	//***************************************************************
	static baseUrl() {
		var sUrl, iLast, sBase

		sUrl = this.pageUrl()
		cDebug.write('page url: ' + sUrl)
		iLast = cString.last(sUrl, '/')
		if (iLast == -1) sBase = ''
		else sBase = sUrl.substring(0, iLast)

		//cDebug.write("base url is "+ sBase);
		return sBase
	}

	static pageName() {
		var sPageUrl = this.pageUrl()
		var aParts = sPageUrl.split('/')
		return aParts[aParts.length - 1]
	}

	//***************************************************************
	static update_state(psTitle, psUrl) {
		if (history.pushState) {
			history.pushState({ title: psTitle }, null, psUrl)
			this.init()
		}
	}

	//***************************************************************
	static openWindow(psUrl, psWindow) {
		if (this.SINGLE_WINDOW) document.location.href = psUrl
		else window.open(psUrl, psWindow)
	}

	//***************************************************************
	static buildUrl(psPage, poParams) {
		if (psPage.search(/\?/) == -1) return psPage + '?' + $.param(poParams, true)
		else return psPage + '&' + $.param(poParams, true)
	}

	//***************************************************************
	//read_from_clipboard
	static paste_from_clipboard(pfnCallBack) {
		const oThis = this	/** @type cBrowser */
		if (navigator && navigator.clipboard && navigator.clipboard.readText)
			navigator.clipboard.readText().then(
				function (text) {
					oThis.writeConsoleWarning('pasted from clipboard: ' + text)
					pfnCallBack(text)
				})
		//async fetch from clipboard, will display a warning to user if permissions not set
		else $.error('browser not compatible for clipboard operation')
	}

	//***************************************************************
	static copy_to_clipboard(psID) {
		if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
			var sText = psID
			if (psID.substring(0, 1) === '#') {
				var oEl = cJquery.element(psID)
				sText = oEl.text()
			}
			navigator.clipboard.writeText(psID)
			this.writeConsoleWarning('sent to clipboard: ' + sText)
		} else this.writeConsoleWarning('browser not compatible for copy operation')
	}

	//***************************************************************
	static get_clipboard_permissions(pbWrite = false) {
		var sPermissionsName = 'clipboard-read'
		if (pbWrite) sPermissionsName = 'clipboard-write'
		this.get_permissions(sPermissionsName)
	}

	//***************************************************************
	static get_permissions(psName) {
		const oThis = this	/** @type cBrowser */

		navigator.permissions.query({ name: psName }).then(function (poStatus) {
			oThis.writeConsoleWarning('permission for ' + psName + ' is ' + poStatus.state)
			if (poStatus.state !== 'granted') oThis.writeConsoleWarning('check site permissions')
		})
	}

	//***************************************************************
	static writeConsole(psMessage) {
		if (console) console.log(psMessage)
	}
	//***************************************************************
	static writeConsoleWarning(psMessage) {
		if (console) console.warn(psMessage)
	}

	//***************************************************************
	static get_url_param(psName) {
		var sQueryString = window.location.search
		var oParams = new URLSearchParams(sQueryString)
		return oParams.get(psName)
	}

	//***************************************************************
	static async getHeapMemoryUsed() {
		//this will be deprecated in favour of
		// @ts-expect-error
		if (performance.measureUserAgentSpecificMemory) return await performance.measureUserAgentSpecificMemory()
		// @ts-expect-error
		else if (performance.memory) return performance.memory.usedJSHeapSize
		else $.error('unable to get heap memory')
	}

	//***************************************************************
	static whitespace(piWidth) {
		var sHTML = "<span style='display:inline-block;width:" + piWidth + "px'></span>"
		return sHTML
	}

	//***************************************************************
	static unbindInputKeyPress() {
		var oWindow = $(window)
		window.CBkeypressfn = oWindow.keypress

		$(':input').each(function (index, oInput) {
			if ($(oInput).attr('type') === 'text') {
				$(oInput).focus(() => $(window).unbind('keypress'))
				$(oInput).blur(() => $(window).keypress(window.CBkeypressfn))
			}
		})
	}

	static queryString(psKey) {
		return this.data[psKey]
	}
}
cBrowser.init()

//###############################################################
//# MISC
//###############################################################
/* eslint-disable-next-line no-unused-vars */
class cCommonStatus {
	static set_error_status(psStatus) {
		cJquery.element(STATUS_ID).html("<font color='red'>" + psStatus + '</font>')
		cDebug.write('Error: ' + psStatus)
	}
	//***************************************************************
	static set_status(psStatus) {
		cJquery.element(STATUS_ID).html(psStatus)
		cDebug.write('status: ' + psStatus)
	}
}

//***************************************************************
/* eslint-disable-next-line no-unused-vars */
function getRadioButtonValue(psID) {
	var oRadios = document.getElementsByName(psID)
	var sValue = null
	var oRadio

	for (var i = 0; i < oRadios.length; i++) {
		oRadio = oRadios[i]
		if (oRadio.checked) {
			cDebug.write('found a checked radio')
			sValue = oRadio.value
			break
		}
	}

	return sValue
}
