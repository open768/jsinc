//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget('ck.slideout', {
	//#################################################################
	//# Definition
	//#################################################################
	options: {
		overlap: 30,
		upperdiv: null,
		lowerdiv: null,
		width: null,
		height: null,
		slideout_width: 70,
		background: 'white',
		padding: 5,
		border_width: 10,
		border_colour: {
			normal: 'black',
			clicked: 'blue'
		},
		left_in: -1
	},

	consts: {
		UPPERID_SUFFIX: 'SLIDEU',
		LOWERID_SUFFIX: 'SLIDEL'
	},

	//#################################################################
	//# Constructor
	//#################################################################`
	_create: function () {
		var oThis, oElement

		//set basic stuff
		oThis = this
		oElement = oThis.element
		oElement.uniqueId()

		//check for required options
		var oOptions = this.options
		if (!oOptions.width) $.error('width missing!')
		if (!oOptions.height) $.error('height missing!')
		if (!oOptions.uppercontent) $.error('uppercontent missing!')
		if (!oOptions.lowercontent) $.error('lowercontent missing!')

		oElement.empty()

		//set the DIV size
		oElement.outerWidth(oOptions.width)
		oElement.outerHeight(oOptions.height)
		oElement.css('max-width', '' + oOptions.width + 'px')

		//create the overlapping divs
		var sUpper = oElement.attr('id') + this.consts.UPPERID_SUFFIX
		var oUpperDiv = $('<div>', { id: sUpper })
		oUpperDiv.css({
			position: 'absolute',
			'z-index': 6,
			width: oOptions.width - oOptions.overlap,
			height: oOptions.height,
			border: '1px solid black',
			background: oOptions.background
		})
		oUpperDiv.append(oOptions.uppercontent)
		oElement.append(oUpperDiv)

		var sLower = oElement.attr('id') + this.consts.LOWERID_SUFFIX
		var oLowerDiv = $('<div>', { id: sLower })
		var iBorderW = oOptions.border_width
		var iLeft = oUpperDiv.position().left + oUpperDiv.width() - oOptions.slideout_width + oOptions.border_width + oOptions.padding
		oLowerDiv.css({
			position: 'absolute',
			'z-index': 5,
			width: oOptions.slideout_width,
			height: oOptions.height,
			padding: oOptions.padding,
			'border-radius': '0px 25px 25px 0px',
			'border-width': '' + iBorderW + 'px ' + iBorderW + 'px ' + iBorderW + 'px 0px',
			'border-style': 'double double double none',
			'border-color': oOptions.border_colour.normal,
			background: oOptions.background,
			left: iLeft,
			cursor: 'pointer'
		})
		oLowerDiv.append(oOptions.lowercontent)
		oElement.append(oLowerDiv)
		oOptions.left_in = oLowerDiv.position().left

		//set up the click handlers
		oLowerDiv.click(function () {
			oThis.onClickSlideout()
		})
	},

	//***************************************************************************
	onClickSlideout: function () {
		var oOptions = this.options
		var oElement = this.element

		var sLower = oElement.attr('id') + this.consts.LOWERID_SUFFIX
		var oLower = cJquery.element(sLower)

		var iLeft = oLower.position().left
		if (iLeft === oOptions.left_in) {
			oLower.css({
				//slide out
				left: oOptions.left_in + oOptions.slideout_width - oOptions.border_width,
				'border-color': oOptions.border_colour.clicked
			})
			//remove everything from ui_front
			cJquery.bringToFront(oElement)
		} else {
			oLower.css({
				left: oOptions.left_in,
				'border-color': oOptions.border_colour.normal
			})
			cJquery.bringToFront(null)
		}
	}
})
