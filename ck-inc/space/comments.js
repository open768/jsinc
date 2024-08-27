"use strict"
/**************************************************************************
Copyright (C) Chicken Katsu 2013-2024
This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk
// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
/* global cCommonStatus */
// eslint-disable-next-line no-unused-vars
class cSpaceComments {
	static phpBaseURL = null

	static {
		this.phpBaseURL = cAppLocations.rest + "/comments.php"
	}

	//********************************************************************************
	static get(psSol, psInstr, psProduct, pfnCallback) {
		var sUrl = cBrowser.buildUrl(this.phpBaseURL, {
			o: "get",
			s: psSol,
			i: psInstr,
			p: psProduct
		})
		cCommonStatus.set_status("getting comments")
		cHttp.fetch_json(sUrl, pfnCallback)
	}

	//********************************************************************************
	static set(psSol, psInstr, psProduct, psComment, pfnCallback) {
		var sUrl
		sUrl = cBrowser.buildUrl(this.phpBaseURL, {
			o: "set",
			s: psSol,
			p: psProduct,
			i: psInstr,
			v: escape(psComment)
		})
		cCommonStatus.set_status("setting comment ")
		cHttp.fetch_json(sUrl, pfnCallback)
	}
}
