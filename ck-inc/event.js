//***************************************************************************
class cBaseEvent {
	base_id = null //base ID allows consumers to listen for a specific event
	action = null
	data = null
	/**
	 * @abstract
	 * @type {string}
	 */
	static event_type_id = null // this is an abstract property

	/**
	 * Creates a new CA event instance.
	 \*	 * @param {string} psBaseId - The base ID associated with the event.
	 * @param {string} psAction - The action type for the event.
	 * @param {*} [poData=null] - Optional payload for the event.
	 * @throws {Error} If required arguments are missing or the class does not override event_type_id.
	 */
	constructor(psBaseId, psAction, poData = null) {
		if (!psBaseId || !psAction) 
			$.error('incorrect number of arguments')
		
		if (typeof bean === 'undefined') 
			$.error('bean library is missing')
		

		if (this.constructor === cBaseEvent) 
			$.error('cBaseEvent is abstract')
		
		// @ts-expect-error
		if (!this.constructor.event_type_id) 
			$.error('event_type_id not overridden in class:' + this.constructor.name)
		

		this.base_id = psBaseId
		this.action = psAction
		this.data = poData
	}

	/**
	 * @return {*}
	 * @memberof cBaseEvent
	 */
	channel_id() {
		// @ts-expect-error
		return this.constructor.event_type_id + this.base_id //creates a unique ID for a specific grid
	}

	async trigger() {
		var sEventName = this.channel_id()
		cDebug.write('event>> grid:"' + this.base_id + '" type:' + this.constructor.name + ' action:' + this.action)
		bean.fire(document, sEventName, this)
	}

	static async fire_event(psGridName, psAction, poData = null) {
		if (this === cBaseEvent) 
			throw new CAException('cBaseEvent is abstract')
		
		if (!psGridName) 
			$.error('grid name is required')
		
		if (!psAction) 
			$.error('grid name is required')
		

		var oEvent = new this(psGridName, psAction, poData) //create specific instance
		oEvent.trigger()
	}

	static async subscribe(psGridName, pfnCallback) {
		if (this === cBaseEvent) 
			$.error('cBaseEvent is abstract')
		
		if (typeof pfnCallback !== 'function') 
			$.error('callback must be a function')
		
		if (!psGridName) 
			$.error('grid name is required')
		

		var oEvent = new this(psGridName, 'dummy') //create an event to get the channel ID
		bean.on(document, oEvent.channel_id(), pfnCallback)
	}
}
