"use strict"

//###############################################################
//# JQUERY
//###############################################################
/* eslint-disable-next-line no-unused-vars */
class cJquery {
	//***************************************************************
	//https://forum.jquery.com/topic/know-if-a-css-class-exists-in-document
	static styleSheetContains(psClass) {
		var bFound = false,
			iSheet,
			oSheet,
			iClass,
			oClass,
			aClasses,
			sSearch
		var aSheets = document.styleSheets
		sSearch = "." + psClass
		for (iSheet = 0; iSheet < aSheets.length; iSheet++) {
			oSheet = aSheets[iSheet]
			aClasses = null
			try {
				aClasses = oSheet.cssRules
			} catch (e) {
				try {
					aClasses = oSheet.rules
				} catch (e) {
					//do nothing }
				}
				if (aClasses == null) continue

				for (iClass = 0; iClass < aClasses.length; iClass++) {
					oClass = aClasses[iClass]
					if (oClass.selectorText == sSearch) {
						bFound = true
						break
					}
				}
			}
			return bFound
		}
	}

	//***************************************************************
	static bringToFront(poElement) {
		$(".ui-front").each(function () {
			$(this).removeClass("ui-front")
		})

		if (poElement) poElement.addClass("ui-front")
	}

	//***************************************************************
	static setTopZindex(poElement) {
		//var iZindex = $('.ui-dialog').css('z-index');
		var iZindex = $(".ui-front").css("z-index")
		poElement.css({
			"z-index": iZindex + 1,
			position: "relative"
		})
	}

	//***************************************************************
	static child_ID(poElement, psID) {
		return poElement.attr("id") + psID
	}

	//***************************************************************
	static get_padding_width(poElement) {
		return (poElement.outerWidth() - poElement.width()) / 2
	}

	//***************************************************************
	static get_padding_height(poElement) {
		return (poElement.outerHeight() - poElement.height()) / 2
	}

	/**
	 * Description
	 * @param {Element} poElement
	 * @param {Boolean} pbEnabled=true
	 */
	static enable_element(poElement, pbEnabled = true) {
		var oElement
		oElement = poElement
		if (typeof poElement == "string") oElement = cJquery.element(poElement)

		if (pbEnabled) oElement.removeAttr("disabled")
		else oElement.attr("disabled", true)
	}

	//***************************************************************
	static disable_element(poElement) {
		this.enable_element(poElement, false)
	}

	//***************************************************************
	static element(psSelector) {
		var oElement = $("#" + psSelector)
		return oElement
	}
}
