"use strict"
/**************************************************************************
Copyright (C) Chicken Katsu 2013-2024
This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk
// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
class cTagging {
	static phpBaseURL = null

	static {
		this.phpBaseURL = cAppLocations.rest + "/tag.php"
	}

	//********************************************************************************
	static getTags(psSol, psInstr, psProduct, pfnCallback) {
		if (cDetail.sol == null) cDebug.error("no sol set")
		if (cDetail.instrument == null) cDebug.error("no instrument set")
		if (cDetail.product == null) cDebug.error("no product set")

		var sUrl, oData
		oData = {
			o: "get",
			s: psSol,
			i: psInstr,
			p: psProduct,
			m: cMission.ID
		}
		sUrl = cBrowser.buildUrl(this.phpBaseURL, oData)
		cDebug.write("getting tag")

		const oHttp = new cHttp2()
		bean.on(oHttp, "result", poHttp => pfnCallback(poHttp))
		oHttp.fetch_json(sUrl)
	}

	//********************************************************************************
	static setTag(psSol, psInstr, psProduct, psTagname, pfnCallback) {
		var sUrl, oData
		oData = {
			o: "set",
			s: psSol,
			i: psInstr,
			p: psProduct,
			v: psTagname,
			m: cMission.ID
		}
		sUrl = cBrowser.buildUrl(this.phpBaseURL, oData)

		cDebug.write("setting tag " + sUrl)
		const oHttp = new cHttp2()
		bean.on(oHttp, "result", poHttp => pfnCallback(poHttp))
		oHttp.fetch_json(sUrl)
	}

	//********************************************************************************
	static searchTags(psPartial, pfnCallBack) {
		var sUrl = cBrowser.buildUrl(cAppLocations.rest + "/" + this.REST_TAGS_URL, {
			o: "search",
			v: psPartial
		})
		var oHttp = new cHttp2()
		bean.on(oHttp, "result", pfnCallBack)
		oHttp.fetch_json(sUrl)
	}
}
