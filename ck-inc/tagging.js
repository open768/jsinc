var cTagging = {
	phpBaseURL:"php/rest/tag.php",
	
	//********************************************************************************
	getTags: function(psSol,psInstr, psProduct, pfnCallback){
		sUrl = cBrowser.buildUrl(this.phpBaseURL , {o:"get",s:psSol,i:psInstr,p:psProduct});
		cDebug.write("getting tag");
		cHttp.fetch_json(sUrl, pfnCallback);
	},

	//********************************************************************************
	setTag: function(psSol,psInstr, psProduct, psTagname, pfnCallback){
		var sUrl;
		sUrl = cBrowser.buildUrl(this.phpBaseURL , {o:"set",s:psSol,i:psInstr,p:psProduct,v:psTagname});
		cDebug.write("setting tag " + sUrl);
		cHttp.fetch_json(sUrl, pfnCallback);
	}
}