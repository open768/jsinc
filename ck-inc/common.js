'use strict';
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

var STATUS_ID = "status";
var SINGLE_WINDOW =true;


//###############################################################
//# STRINGS
//###############################################################
var cString = {
	last:function (psText, psSearch){
		var sReverseTxt = this.reverse(psText);
		var sReverseSearch = this.reverse(psSearch);
		
		var iFound = sReverseTxt.search(sReverseSearch);
		
		if (iFound != -1)
			iFound = psText.length - iFound;
		return iFound;
	},
	
	//***************************************************************
	reverse:function reverse(psText){
		return psText.split("").reverse().join("");
	},
}

if (!String.prototype.padLeft)
	String.prototype.padLeft = function(psPad, piSize) { 
		var iDiff = piSize - this.length;
		if (iDiff >0)
			return psPad.repeat(iDiff) + this;
		else
			return this;
	}


//###############################################################
//# BROWSER
//###############################################################
var cJquery = {
	//***************************************************************
	//https://forum.jquery.com/topic/know-if-a-css-class-exists-in-document
	styleSheetContains:function (psClass) {
	   var bFound = false, iSheet, oSheet, iClass, oClass, aClasses, sSearch;
       var aSheets = document.styleSheets;	   
	   sSearch = "."+psClass;
       for (iSheet = 0; iSheet < aSheets.length; iSheet++) {
			oSheet = aSheets[iSheet];
			aClasses = null;
			try{
				aClasses = oSheet.cssRules ;
			}catch (e){
				try{
					aClasses = oSheet.rules ;
				}catch (e){}
			}
			if (aClasses == null) continue;
			
            for ( iClass = 0; iClass < aClasses.length; iClass++) {
                oClass = aClasses[iClass];
				if (oClass.selectorText == sSearch) {
                    bFound = true; 
					break;
                }
            }
        }
        return bFound;
    },
	
	//***************************************************************
	bringToFront:function(poElement){
		$(".ui-front").each( 
			function(piIndex){
				$(this).removeClass("ui-front"); 
			}
		);
		
		if (poElement) poElement.addClass("ui-front");
	},
	
	//***************************************************************
	setTopZindex: function(poElement){
		//var iZindex = $('.ui-dialog').css('z-index');
		var iZindex = $('.ui-front').css('z-index');
		poElement.css({
			'z-index': iZindex + 1,
			position: "relative"
			
		});
	}
}

//###############################################################
//# BROWSER
//###############################################################
var cBrowser = {
	data:null,
	
	//***************************************************************
	init:function (){
		var oResult = {}, aPairs;
		var sKey, sValue;

		aPairs = location.search.slice(1).split('&');
		aPairs.forEach(function(sPair) {
			var aPair = sPair.split('=');
			sKey = aPair[0];
			sValue = decodeURI(aPair[1]).replace(/\+/g, ' ');
			oResult[sKey] =  sValue || '';
		});

		this.data = oResult;
	},
	
	//***************************************************************
	pageUrl:function(){
		return document.URL.split("?")[0];
	},
	
	//***************************************************************
	baseUrl:function(){
		var sUrl, iLast, sBase;
		
		sUrl = this.pageUrl();
		cDebug.write("page url: "+ sUrl);
		iLast = cString.last(sUrl, "/");
		if (iLast == -1)
			sBase = "";
		else
			sBase = sUrl.substring(0,iLast);
		
		//cDebug.write("base url is "+ sBase);
		return sBase;
	},
	
	//***************************************************************
	pushState:function(psTitle, psUrl){
		if (window.history.pushState){
			window.history.pushState("", psTitle, psUrl);
			this.init();
		}
	},
	
	//***************************************************************
	openWindow:function(psUrl, psWindow){
		if (SINGLE_WINDOW)
			document.location.href = psUrl;
		else
			window.open(psUrl, psWindow);
	},
	
	//***************************************************************
	buildUrl:function (psPage, poParams){
		if (psPage.search(/\?/) == -1)
			return  psPage + "?" + $.param(poParams,true);
		else
			return  psPage + "&" + $.param(poParams,true);
	},
	
	//***************************************************************
	writeConsole:function(psMessage){
		if (console) console.log(psMessage);
	}
//	this.isMobile = function(a) {(/android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a))}(navigator.userAgent||navigator.vendor||window.opera);
}
cBrowser.init();


//###############################################################
//# MISC
//###############################################################
function set_error_status(psStatus){
	$("#"+STATUS_ID).html("<font color='red'>" + psStatus + "</font>");
	cDebug.write("Error: " + psStatus );
}
//***************************************************************
function set_status(psStatus){
	var oElement;
	$("#"+STATUS_ID).html(psStatus);
	cDebug.write("status: " + psStatus);
}

//***************************************************************
function getRadioButtonValue(psID){
	var oRadios = document.getElementsByName(psID);
	var sValue = null;
	var oRadio;
	
	for (var i = 0; i<oRadios.length; i++){
		oRadio = oRadios[i];
		if (oRadio.checked) {
			cDebug.write("found a checked radio");
			sValue = oRadio.value;
			break;
		}
	}
		
	return sValue;
}
