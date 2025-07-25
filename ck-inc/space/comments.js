'use strict'
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
class cComments {
	static phpBaseURL = null

	static {
		this.phpBaseURL = cAppRest.base_url('comments.php')
	}

	//********************************************************************************
	static async get(psSol, psInstr, psProduct, pfnCallback) {
		if (!psSol) cDebug.error('sol is missing')
		if (!psInstr) cDebug.error('instrument is missing')
		if (!psProduct) cDebug.error('product is missing')

		var sUrl = cBrowser.buildUrl(this.phpBaseURL, {
			[cAppUrlParams.OPERATION]: 'get',
			[cSpaceUrlParams.SOL]: psSol,
			[cSpaceUrlParams.INSTRUMENT]: psInstr,
			[cSpaceUrlParams.PRODUCT]: psProduct
		})
		cCommonStatus.set_status('getting comments')
		const oHttp = new cHttp2()
		{
			bean.on(oHttp, 'result', poHttp => pfnCallback(poHttp))
			oHttp.fetch_json(sUrl)
		}
	}

	//********************************************************************************
	static async set(psSol, psInstr, psProduct, psComment, pfnCallback) {
		var sUrl
		sUrl = cBrowser.buildUrl(this.phpBaseURL, {
			[cAppUrlParams.OPERATION]: 'set',
			[cSpaceUrlParams.SOL]: psSol,
			[cSpaceUrlParams.PRODUCT]: psProduct,
			[cSpaceUrlParams.INSTRUMENT]: psInstr,
			[cAppUrlParams.VALUE]: encodeURIComponent(psComment)
		})
		cCommonStatus.set_status('setting comment ')
		const oHttp = new cHttp2()
		{
			bean.on(oHttp, 'result', poHttp => pfnCallback(poHttp))
			oHttp.fetch_json(sUrl)
		}
	}
}
