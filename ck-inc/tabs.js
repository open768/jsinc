'use strict'

/**************************************************************************
Copyright (C) Chicken Katsu 2013-2018
This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk
// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
//from http://jsfiddle.net/syahrasi/us8uc/

// eslint-disable-next-line no-unused-vars
class cAppTabs {
	static onTabClick() {
		cDebug.write("clicked tab")
		event.preventDefault()
		$(this).parent().addClass("current")
		$(this).parent().siblings().removeClass("current")
		var tab = $(this).attr("href")
		$(".tab-content").not(tab).css("display", "none")
		$(tab).fadeIn()
	}

	// eslint-disable-next-line no-unused-vars
	static instrumentTabs() {
		cDebug.write("instrumenting tabs")
		$(".tabs-menu a").click(() => this.onTabClick())
	}
}