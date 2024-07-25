"use strict"
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//#
//###############################################################################
// eslint-disable-next-line no-unused-vars
class cRender {
  //**************************************************************************
  static messagebox(psMsg) {
    return (
      "<div class='w3-panel w3-blue w3-round-large w3-padding-16 w3-leftbar'>" +
      psMsg +
      "</div>"
    )
  }

  //**************************************************************************
  static button(psCaption, psUrl) {
    var sClass =
      "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
    var sHTML =
      "<button " +
      "class='" +
      sClass +
      "' " +
      "onclick='window.stop();document.location=\"" +
      psUrl +
      "\";return false;'>" +
      psCaption +
      "</button>"
    return sHTML
  }

  //**************************************************************************
  static put_in_wbrs(psInput, piInterval = 20) {
    if (psInput.indexOf(" ") > 0) return psInput
    else {
      var aSplit = psInput.split(piInterval)
      var sJoined = aSplit.join("<wbr>")
      return sJoined
    }
  }

  static format_number(piNum) {
    var sLocale = navigator.language
    var oFormatter = new Intl.NumberFormat(sLocale)
    return oFormatter.format(piNum)
  }

  //**************************************************************************
  static fade_element(poEl) {
    poEl.fadeOut(1000, function () {
      poEl.remove()
    })
  }

  //**************************************************************************
  static hide_menus_and_links() {
    // hide all forms
    $("form").each(function (pi, poEl) {
      $(poEl).hide()
    })
    // hide all buttons
    $("button").each(function (pi, poEl) {
      $(poEl).hide()
    })
    // remove hyperlinks
    $("a[href]").each(function (pi, poEl) {
      $(poEl).removeAttr("href")
    })
    //remove menus
    $("div[type=admenus]").each(function (pi, poEl) {
      $(poEl).hide()
    })

    $("#btn_hider").show()
    return false
  }
}

//###############################################################################
// eslint-disable-next-line no-unused-vars
class cRenderW3 {
  static tag(psTag, psColour = "w3-light-grey") {
    return (
      "<span class='w3-tag " +
      psColour +
      " w3-round w3-border ' style='text-align:left'>" +
      psTag +
      "</span> "
    )
  }
}

//###############################################################################
// eslint-disable-next-line no-unused-vars
class cRenderMDL {
  static cardID = 0

  //**********************************************************
  static title(psTitle) {
    return (
      "<div class='mdl-card__title'><font class='card_::TITLE_QS'>" +
      psTitle +
      "</font></div>"
    )
  }

  //**********************************************************
  static card_start(psTitle = null) {
    this.cardID++
    var sClass = "class='mdl-card mdl-shadow--2dp rapport-card'"

    var sHTML = "<div " + sClass + " id='CARDID_" + this.cardID + "'>"
    if (psTitle !== null) sHTML += this.title(psTitle)
    return sHTML
  }

  static card(psTitle = null, poBody = null) {
    var oParams = {
      class: "mdl-card mdl-shadow--2dp rapport-card",
      id: "CARDID_" + this.cardID,
    }
    var oCardDiv = $("DIV", oParams)
    if (psTitle !== null) oCardDiv.append(this.title(psTitle))
    if (poBody !== null) oCardDiv.append(this.body(poBody))
    return oCardDiv
  }

  //**************************************************************************
  static action_start() {
    return "<div class='mdl-card__actions mdl-card--border'>"
  }

  //**************************************************************************
  static body_start() {
    return "<div class='mdl-card__supporting-text'>"
  }

  static body(poBody = null) {
    var oParams = {
      class: "mdl-card__supporting-text",
    }
    var oDiv = $("DIV", oParams)
    if (poBody !== null) oDiv.append(poBody)
    return oDiv
  }

  //**************************************************************************
  static fade_element_and_hide_card(poEl) {
    poEl.fadeOut(1000, function () {
      poEl.closest(".mdl-card").remove()
    })
  }
}
