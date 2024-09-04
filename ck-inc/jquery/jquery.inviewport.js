;(function ($) {
	/**************************************************************************
	Copyright (C) Chicken Katsu 2013-2024
	 * Licensed under the MIT license.
	 
	based on http://opensource.teamdf.com/visible/jquery.visible.js
	 * Copyright 2012, Digital Fusion
	 * Licensed under the MIT license.

	// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
	**************************************************************************/
	class cCoordinate {
		x = 0
		y = 0
	}

	class cRectangle {
		C1 = new cCoordinate() //top left
		C2 = new cCoordinate() //bottom right

		rect_intersect(poRect) {
			//classic square in square
			//see https://silentmatt.com/rectangle-intersection/

			return this.C1.x <= poRect.C2.x && this.C2.x >= poRect.C1.x && this.C1.y <= poRect.C2.y && this.C2.y >= poRect.C1.y
		}
	}

	$.fn.inViewport = () => {
		var oWindow = $(window)
		var oThis = $(this)

		var oViewPort = new cRectangle()
		oViewPort.C1.x = oWindow.scrollLeft()
		oViewPort.C1.y = oWindow.scrollTop()
		oViewPort.C2.x = oViewPort.C1.x + oWindow.width()
		oViewPort.C2.y = oViewPort.C1.y + oWindow.height()

		var oRect = new cRectangle()
		oRect.C1.x = oThis.offset().left
		oRect.C1.y = oThis.offset().top
		oRect.C2.x = oRect.C1.x + oThis.width()
		oRect.C2.y = oRect.C1.y + oThis.height()

		return oViewPort.rect_intersect(oRect)
	}

	cBrowser.writeConsole('***** Loaded jQuery inViewport plugin *****')
})(jQuery)
