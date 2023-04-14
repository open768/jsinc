'use strict'
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//#
//###############################################################################
// eslint-disable-next-line no-unused-vars
var cRender={

	//**************************************************************************
	messagebox: function(psMsg){
		return "<div class='w3-panel w3-blue w3-round-large w3-padding-16 w3-leftbar'>"+psMsg+"</div>"
	},

	//**************************************************************************
	button: function(psCaption, psUrl){
		var sClass = "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
		var sHTML =
			"<button "+
				"class='" + sClass + "' " +
				"onclick='window.stop();document.location=\"" +psUrl + "\";return false;'>" +
					psCaption +
			"</button>"
		return sHTML
	},


	//**************************************************************************
	put_in_wbrs:function(psInput, piInterval=20){
		if (psInput.indexOf(" ") > 0)
			return psInput
		else{
			var aSplit = psInput.split(piInterval)
			var sJoined = aSplit.join("<wbr>")
			return sJoined
		}
	},

	format_number: function (piNum){
		var sLocale = navigator.language
		var oFormatter = new Intl.NumberFormat(sLocale)
		return oFormatter.format(piNum)
	},

	//**************************************************************************
	fade_element: function(poEl){
		poEl.fadeOut(1000,function(){poEl.remove()})
	},
	
	//**************************************************************************
	hide_menus_and_links: function(){
		// hide all forms
		$("form").each( function (pi, poEl){ $(poEl).hide() })
		// hide all buttons
		$("button").each( function (pi, poEl){$(poEl).hide() })
		// remove hyperlinks
		$("a[href]").each( function (pi, poEl){ $(poEl).removeAttr("href") })
		//remove menus
		$("div[type=admenus]").each( function (pi, poEl){ $(poEl).hide() })
		
		$('#btn_hider').show()
		return false
	}
}

//###############################################################################
// eslint-disable-next-line no-unused-vars
var cRenderW3={

	//**********************************************************
	tag:function(psTag, psColour="w3-light-grey"){
		return  "<span class='w3-tag "+ psColour + " w3-round w3-border ' style='text-align:left'>"+psTag+"</span> "
	}
}

//###############################################################################
// eslint-disable-next-line no-unused-vars
var cRenderMDL={
	cardID:0,

	//**********************************************************
	title:function(psTitle){
		return "<div class='mdl-card__title'><font class='card_::TITLE_QS'>"+psTitle+"</font></div>"
	},

	//**********************************************************
	card_start:function(psTitle=null){
		this.cardID++
		var sClass = "class='mdl-card mdl-shadow--2dp rapport-card'"

		var sHTML = "<div "+ sClass + " id='CARDID_" + this.cardID + "'>"
		if (psTitle !== null)	sHTML += this.title(psTitle)
		return sHTML
	},

	//**************************************************************************
	action_start:function(){
		return "<div class='mdl-card__actions mdl-card--border'>"
	},

	//**************************************************************************
	body_start:function(){
		return "<div class='mdl-card__supporting-text'>"
	},

	//**************************************************************************
	fade_element_and_hide_card(poEl){
		poEl.fadeOut(1000,function(){poEl.closest(".mdl-card").remove()})
	}
}