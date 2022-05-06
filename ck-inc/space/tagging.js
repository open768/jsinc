/**************************************************************************
Copyright (C) Chicken Katsu 2013-2018
This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk
// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
var cTagging = {
	phpBaseURL: cLocations.rest + "/tag.php",
	
	//********************************************************************************
	getTags: function(psSol,psInstr, psProduct, pfnCallback){
		sUrl = cBrowser.buildUrl(this.phpBaseURL , {o:"get",s:psSol,i:psInstr,p:psProduct,m:cMission.ID});
		cDebug.write("getting tag");
		cHttp.fetch_json(sUrl, pfnCallback);
	},

	//********************************************************************************
	setTag: function(psSol,psInstr, psProduct, psTagname, pfnCallback){
		var sUrl;
		sUrl = cBrowser.buildUrl(this.phpBaseURL , {o:"set",s:psSol,i:psInstr,p:psProduct,v:psTagname,m:cMission.ID});
		cDebug.write("setting tag " + sUrl);
		cHttp.fetch_json(sUrl, pfnCallback);
	}
}