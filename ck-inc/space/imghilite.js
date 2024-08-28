"use strict"

/**************************************************************************
Copyright (C) Chicken Katsu 2013-2024
This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk
// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
class cImgHilite {
	static templateID = "#box_template"
	static containerID = "#highlight"
	static baseImageID = "#baseimg"
	static baseUrl = null
	static controlsID = "#controls"
	static numberID = "#number"
	static imgTarget = null
	static ID = 0
	static currentBox = null

	static {
		this.baseUrl = cAppLocations.rest + "/img_highlight.php"
	}

	//**************************************************
	static rejectBox(poButton) {
		var oBox = poButton.parentNode.parentNode
		cJquery.element(oBox.id).remove()
		this.currentBox = null
	}

	//**************************************************
	static getBoxFromButton(poButton) {
		//find the parent div and hide
		return poButton.parentNode.parentNode
	}

	//**************************************************
	static makeBox(piX, piY, bDraggable) {
		var oClone
		var oContainer = $(this.containerID)

		if (bDraggable && this.currentBox) oBox = this.currentBox
		else {
			//make a unique ID
			var sID = "box" + this.ID
			this.ID++

			//create a clone of the template and add to container
			var oTemplate = $(this.templateID)
			if (oTemplate.length == 0) throw new Error("no template found")
			oClone = oTemplate.clone(true)
			oClone[0].id = sID
			oClone.appendTo(oContainer)

			//find the offset of the image
			var oImg = $(this.imgTarget)
			if (oImg.length == 0) throw new Error("Oops cant find image")

			//add it to the container and make it visible and draggable
			var oBox, iX, iY
			oBox = cJquery.element(sID)
			oBox.show() //has to be shown otherwise the maths goes scewy as width/height isnt set

			//save it
			if (bDraggable) this.currentBox = oBox
		}

		//position relative to the image
		var oParent = oContainer.parent()[0]
		var iParentTop = oParent.offsetTop
		var iParentLeft = oParent.offsetLeft

		iX = piX - iParentLeft - oBox.width() / 2
		iY = piY - iParentTop - oBox.height() / 2
		oBox.css({ position: "absolute", top: "" + iY + "px", left: "" + iX + "px" })

		//make it draggable to the image
		oBox.draggable({ containment: oImg })

		return oBox
	}

	//**************************************************
	static make_fixed_box(psTop, psLeft) {
		var oBox, oControls, oNumber

		//make and position the box
		oBox = this.makeBox(100, 100, false)
		oBox.css({ position: "absolute", top: psTop, left: psLeft })

		//disable dragging and make it blue
		oBox.draggable("disable")
		oBox.attr("class", "bluebox")

		//find and disable controls
		oControls = oBox.find(this.controlsID)
		$(oControls).hide()

		//find and enable number
		oNumber = oBox.find(this.numberID)
		$(oNumber).show()

		return oBox
	}

	//**************************************************
	static remove_boxes() {
		//remove everything other than the img div from the container
		$(this.containerID).empty()
	}

	//**************************************************
	static save_highlight(psSol, psInstr, psProduct, psID, pfnCallback) {
		var oBox = $(psID)
		var sUrl = cBrowser.buildUrl(this.baseUrl, {
			o: "add",
			s: psSol,
			i: psInstr,
			p: psProduct,
			m: cMission.ID,
			t: oBox.css("top"),
			l: oBox.css("left")
		})
		this.currentBox = null

		var oHttp = new cHttp2()
		bean.on(oHttp, "result", poHttp => pfnCallback(poHttp))
		oHttp.fetch_json(sUrl)
	}

	//**************************************************
	static getHighlights(psSol, psInstr, psProduct, pfnCallBack) {
		var sUrl = cBrowser.buildUrl(this.baseUrl, {
			o: "get",
			s: psSol,
			i: psInstr,
			p: psProduct,
			m: cMission.ID
		})

		var oHttp = new cHttp2()
		bean.on(oHttp, "result", poHttp => pfnCallBack(poHttp))
		oHttp.fetch_json(sUrl)
	}
}
