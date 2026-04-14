'use strict'
/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2026
This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

var STATUS_ID = 'status'

//@ts-expect-error
function module(){}

//###############################################################
//# STRINGS
//###############################################################
class cString {
	/**
	 *
	 * @param {string} psText
	 * @param {string} psSearch
	 * @returns {number}
	 */
	static last(psText, psSearch) {
		var sReverseTxt = this.reverse(psText)
		var sReverseSearch = this.reverse(psSearch)

		var iFound = sReverseTxt.search(sReverseSearch)

		if (iFound != -1)
			iFound = psText.length - iFound

		return iFound
	}

	//***************************************************************
	/**
	 *
	 * @param {string} psText
	 * @returns {string}
	 */
	static reverse(psText) {
		return psText.split('').reverse().join('')
	}

	//***************************************************************
	//count common characters from left

	/**
	 *
	 * @param {string} ps1
	 * @param {string} ps2
	 * @returns {number}
	 */
	static count_common_chars(ps1, ps2) {
		var iCheckLen = Math.min(
			ps1.length,
			ps2.length
		)
		var i

		for (i = 0; i < iCheckLen; i++)
			if (ps1[i] !== ps2[i])
				break

		return i
	}

	//***************************************************************

	/**
	 *
	 * @param {string} psText
	 * @returns {boolean}
	 */
	static is_string_empty(psText) {
		return psText === null || psText === ''
	}
}
// @ts-expect-error
if (!String.prototype.padLeft)
	// @ts-expect-error
	String.prototype.padLeft = function (psPad, piSize) {
		var iDiff = piSize - this.length
		if (iDiff > 0)
			return psPad.repeat(iDiff) + this
		else
			return this

	}

//###############################################################
//# static classes
//###############################################################
class cStaticClass {
	constructor() {
		if (this.constructor === cStaticClass)
			throw 'cStaticClass is abstract'
	}
}

//###############################################################
//# common
//###############################################################

class cCommon {
	static SINGLE_WINDOW = true

	/**
	 * Creates a deep copy of an object
	 * @param {any} poThing
	 * @returns
	 */

	static deep_copy(poThing) {
		return JSON.parse(JSON.stringify(poThing))
	}

	/**
	 *
	 * @param {number} piDigits
	 * @returns
	 */
	static random_base2(piDigits){
		if ( !Number.isInteger(piDigits) )
			throw `random_base2: ${piDigits} is not an integer`

		if (piDigits <= 0)
			throw 'random_base2: piDigits must be a positive integer'
		return this.random_int(
			0,
			Math.pow(
				2,
				piDigits+1
			)
		)
	}

	/**
	 *
	 * @param {number} piMin
	 * @param {number} piMax
	 * @returns {number}
	 */
	static random_int(piMin = 0, piMax) {
		if (piMax <= piMin)
			throw 'random_int: Max must be greater than piMin'

		return Math.floor(Math.random() * (piMax - piMin)) + piMin
	}

	//***************************************************************
	/**
	 *
	 * @param {object} poObj
	 * @param {string} psClassName
	 * @returns {boolean}
	 */
	static obj_is(poObj, psClassName) {
		if (poObj == null)
			throw 'obj_is: null param1!'

		if (typeof poObj !== 'object')
			throw 'obj_is: object expected for param1'

		var sObjType = typeof psClassName
		if (sObjType === 'string')
			return poObj.constructor.name === psClassName
		else if (sObjType === 'object')
			return poObj.constructor.name === psClassName.constructor.name
		else
			throw `param2: string expected, got: ${sObjType}`

	}

	//***************************************************************
	//from https://gist.github.com/lanqy/5193417
	/**
	 *
	 * @param {number} piBytes
	 * @returns
	 */
	static bytesToSize(piBytes) {
		const units = ['byte', 'kilobyte', 'megabyte', 'terabyte', 'petabyte']
		const unit = Math.floor(Math.log(piBytes) / Math.log(1024))
		return new Intl.NumberFormat(
			'en',
			{
				style: 'unit',
				unit: units[unit]
			}
		).format(piBytes / 1024 ** unit)
	}

	/**
	 * how many bits are required to store a number of a certain size
	 * @param {number} piNum
	 * @returns
	 */
	static intBitSize(piNum) {
		// copilot generated code
		return Math.ceil(Math.log2(piNum))
	}
	/**
	 * returns the bitlength required to store a value up to piMaxValue,
	 *  adjusted upwards to the nearest of 4, 8 16,32
	 * @param {number} piMaxValue
	 * @returns {number}
	 */

	static get_common_bit_length(piMaxValue){
		var iLength = cCommon.intBitSize(piMaxValue)

		// adjust ilength upwards to the nearest of 4, 8 16,32 etc for more efficient storage
		if (iLength <= 4)
			iLength = 4
		else if (iLength <= 8)
			iLength = 8
		else if (iLength <= 16)
			iLength = 16
		else if (iLength <= 32)
			iLength = 32
		else
			throw `unsupported bit length: ${iLength}`

		return iLength
	}

	//***************************************************************
	/**
	 *
	 * @param {any} psThing
	 * @returns {boolean}
	 */
	static is_numeric(psThing) {
		return !isNaN(psThing)
	}

	//***************************************************************
	/**
	 *
	 * @param {any} psThing
	 * @returns {boolean}
	 */static is_integer(psThing) {
		if (typeof psThing === 'number')
			return Number.isInteger(psThing)

		if (typeof psThing === 'string')
			return /^[0-9]+$/.test(psThing)

		return false
	}

	/**
	 * gets the wraparound number
	 *
	 * @param {number} piValue
	 * @param {number} piMin
	 * @param {number} piMax
	 * @returns number
	 */
	static get_wraparound_value( piValue, piMin, piMax){
		if (piMin >= piMax)
			throw 'get_wraparound_value: piMin must be less than piMax'

		var iValue = piValue
		var iInc = piMax - piMin + 1
		while (iValue < piMin)
			iValue += iInc
		while (iValue > piMax)
			iValue -= iInc
		return iValue
	}
}

//###############################################################
//# BROWSER
//###############################################################
class cBrowser {
	static data = null

	//***************************************************************
	static init() {
		var oResult = {
			},
			aPairs
		//* @type {string}
		var sKey
		//* @type {string}
		var sValue

		aPairs = location.search.slice(1).split('&')
		aPairs.forEach(function (sPair) {
			var aPair = sPair.split('=')
			sKey = aPair[0]
			sValue = decodeURI(aPair[1]).replace(
				/\+/g,
				' '
			)
			oResult[sKey] = sValue || ''
		})

		this.data = oResult
	}

	//***************************************************************
	/**
	 *
	 * @param {string} psUrl
	 * @param {string} psWindow
	 */
	static openWindow(psUrl, psWindow) {
		if (cCommon.SINGLE_WINDOW)
			document.location.href = psUrl
		else
			window.open(
				psUrl,
				psWindow
			)

	}

	//***************************************************************
	/**
	 *
	 * @param {string} psName
	 */
	static get_permissions(psName) {
		/** @type cBrowser */

		navigator.permissions.query({
			name: psName
		}).then(poStatus => {
			this.writeConsoleWarning(`permission for ${psName} is ${poStatus.state}`)
			if (poStatus.state !== 'granted')
				this.writeConsoleWarning('check site permissions')

		})
	}

	//***************************************************************
	/**
	 *
	 * @param {string} psMessage
	 */
	static writeConsole(psMessage) {
		if (console)
			console.log(psMessage)

	}
	//***************************************************************
	/**
	 *
	 * @param {string} psMessage
	 */
	static writeConsoleWarning(psMessage) {
		if (console)
			console.warn(psMessage)
	}
	//***************************************************************
	/**
	 *
	 * @param {string} psMessage
	 */
	static writeConsoleError(psMessage) {
		if (console)
			console.error(psMessage)
	}

	//***************************************************************
	/**
	 *
	 * @param {string} psMessage
	 * @param {string} psStyle
	 */
	static write_p(psMessage, psStyle="") {
		var sp_tag = "<p>"
		if (psStyle)
			sp_tag = `<p style='${psStyle}'>`
		document.writeln(`${sp_tag}${psMessage}</p>`)
	}

	//***************************************************************
	static async getHeapMemoryUsed() {
		//this will be deprecated in favour of
		// @ts-expect-error
		if (performance.measureUserAgentSpecificMemory)
			// @ts-expect-error
			return await performance.measureUserAgentSpecificMemory()
		// @ts-expect-error
		else if (performance.memory)
			// @ts-expect-error
			return performance.memory.usedJSHeapSize
		else
			$.error('unable to get heap memory')

	}

	//***************************************************************
	/**
	 *
	 * @param {number} piWidth
	 */
	static whitespace(piWidth) {
		var sHTML = `<span style='display:inline-block;width:${piWidth}px'></span>`
		return sHTML
	}

	//***************************************************************
	static unbindInputKeyPress() {
		var oWindow = $(window)
		var CBkeypressfn = oWindow.keypress

		// @ts-expect-error
		$(':input').each(function (index, oInput) {
			if ($(oInput).attr('type') === 'text') {
				$(oInput).focus(() => $(window).unbind('keypress'))
				$(oInput).blur(() => $(window).keypress(CBkeypressfn))
			}
		})
	}

	//***************************************************************
	// clipboard
	//***************************************************************
	//read_from_clipboard
	/**
	 *
	 * @param {function} pfnCallBack
	 */
	static paste_from_clipboard(pfnCallBack) {
		if (navigator && navigator.clipboard && navigator.clipboard.readText)
			//async fetch from clipboard, will display a warning to user if permissions not set
			navigator.clipboard.readText().then(text => {
				this.writeConsoleWarning(`pasted from clipboard: ${text}`)
				pfnCallBack(text)
			})
		else
			$.error('browser not compatible for clipboard operation')

	}

	//***************************************************************
	/**
	 *
	 * @param {string} psElementID
	 */

	static async copy_to_clipboard(psElementID) {
		if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
			var sText = psElementID
			if (psElementID.substring(
				0,
				1
			) === '#') {
				var oEl = cJquery.element(psElementID	)
				sText = oEl.text()
			}

			try{
				await (navigator.clipboard.writeText(sText))
				this.writeConsoleWarning(`sent to clipboard: ${sText}`)
			} catch {
				this.writeConsoleWarning('unable to write to clipboard, check site permissions')
			}
		} else
			this.writeConsoleWarning('browser not compatible for copy operation')

	}

	//***************************************************************
	static get_clipboard_permissions(pbWrite = false) {
		var sPermissionsName = 'clipboard-read'
		if (pbWrite)
			sPermissionsName = 'clipboard-write'

		this.get_permissions(sPermissionsName)
	}

	//***************************************************************
	// querystring and URLs
	//***************************************************************
	static pageUrl() {
		return document.URL.split('?')[0]
	}

	//***************************************************************
	static baseUrl() {
		var sUrl, iLast, sBase

		sUrl = this.pageUrl()
		cDebug.write(`page url: ${sUrl}`)
		iLast = cString.last(
			sUrl,
			'/'
		)
		if (iLast == -1)
			sBase = ''
		else
			sBase = sUrl.substring(
				0,
				iLast
			)

		//cDebug.write(`base url is ${sBase}`);
		return sBase
	}

	//***************************************************************
	static pageName() {
		var sPageUrl = this.pageUrl()
		var aParts = sPageUrl.split('/')
		return aParts[aParts.length - 1]
	}

	/**
	 *
	 * @param {string} psTitle
	 * @param {string} psUrl
	 */
	static update_state(psTitle, psUrl) {
		if (history.pushState) {
			history.pushState(
				{
					title: psTitle
				},
				null,
				psUrl
			)
			this.init()
		}
	}

	//***************************************************************
	/**
	 *
	 * @param {string} psPage
	 * @param {Object} poParams
	 * @returns {string}
	 */
	static buildUrl(psPage, poParams) {
		var has_q = (psPage.indexOf('?') !== -1)
		return psPage + ( has_q ? '&':'?') + $.param(
			poParams,
			true
		)
	}

	//***************************************************************
	/**
	 *
	 * @param {string} psName
	 * @returns {string}
	 */
	static get_url_param(psName) {
		var sQueryString = window.location.search
		var oParams = new URLSearchParams(sQueryString)
		return oParams.get(psName)
	}

	//***************************************************************
	/**
	 * @param {string} psKey
	 * @returns {string}
	 */
	static queryString(psKey) {
		return this.data[psKey]
	}
}
cBrowser.init()

//###############################################################
//# MISC
//###############################################################
class cCoordinate{
	x=0
	y=0
	z=0

	/**
	 *
	 * @param {number} piX
	 * @param {number} piY
	 * @param {number} piZ
	 */
	constructor(piX, piY, piZ = null){
		this.x = piX
		this.y = piY
		this.z = piZ
	}
}

class cCommonStatus {
	/**
	 *
	 * @param {string} psStatus
	 */
	static set_error_status(psStatus) {
		cJquery.element(STATUS_ID).html(`<font color='red'>${psStatus}</font>`)
		cDebug.write(`Error: ${psStatus}`)
	}
	//***************************************************************
	/**
	 *
	 * @param {string} psStatus
	 */
	static set_status(psStatus) {
		cJquery.element(STATUS_ID).html(psStatus)
		cDebug.write(`status: ${psStatus}`)
	}
}

//***************************************************************
/**
 *
 * @param {string} psID
 */

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
