var cTagging = {
	phpBaseURL:"php/rest/tag.php",
	
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