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
	static phpBaseURL = cLocations.rest + "/tag.php"

	//********************************************************************************
	static getTags(psSol, psInstr, psProduct, pfnCallback) {
		var sUrl, oData
		oData = {
			o: "get",
			s: psSol,
			i: psInstr,
			p: psProduct,
			m: cMission.ID,
		}
		sUrl = cBrowser.buildUrl(this.phpBaseURL, oData)
		cDebug.write("getting tag")
		cHttp.fetch_json(sUrl, pfnCallback)
	}

	//********************************************************************************
	setTag(psSol, psInstr, psProduct, psTagname, pfnCallback) {
		var sUrl, oData
		oData = {
			o: "set",
			s: psSol,
			i: psInstr,
			p: psProduct,
			v: psTagname,
			m: cMission.ID,
		}
		sUrl = cBrowser.buildUrl(this.phpBaseURL, oData)
		cDebug.write("setting tag " + sUrl)
		cHttp.fetch_json(sUrl, pfnCallback)
	}
}
