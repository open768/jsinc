class cBaseEventException extends Error {}

//***************************************************************************
class cBaseEvent {
	base_id = null //allows consumers to listen for events associated with a common base_id
	action = null
	data = null

	/**
	 * Creates a new CA event instance.
	 * @param {string} psBaseId - The base ID associated with the event.
	 * @param {string} psAction - The action type for the event.
	 * @param {*} [poData=null] - Optional payload for the event.
	 * @throws {Error} If required arguments are missing .
	 */
	constructor(psBaseId, psAction, poData = null) {
		if (typeof bean === 'undefined')
			throw new cBaseEventException('bean library is missing')
		if (this.constructor === cBaseEvent)
			throw new cBaseEventException('cBaseEvent is abstract - instances are not allowed')

		if (!psBaseId )
			throw new cBaseEventException('base ID missing')
		if (!psAction)
			throw new cBaseEventException('action missing')


		this.base_id = psBaseId
		this.action = psAction
		this.data = poData
	}

	/**
	 * @return {*}
	 * @memberof cBaseEvent
	 */
	channel_id() {
		return this.constructor.name + this.base_id //creates a unique ID for a specific event and base
	}

	async trigger() {
		var sEventName = this.channel_id()
		cDebug.write('event>> base:"' + this.base_id + '" type:' + this.constructor.name + ' action:' + this.action)
		bean.fire(document, sEventName, this)
	}

	static async fire_event(psBaseId, psAction, poData = null) {
		if (this === cBaseEvent)
			throw new CAException('cBaseEvent is abstract')

		if (!psBaseId)
			throw new cBaseEventException('base ID is required')

		if (!psAction)
			throw new cBaseEventException('action is required')


		var oEvent = new this(psBaseId, psAction, poData) //create specific instance
		oEvent.trigger()
	}

	static async subscribe(psBaseId, pfnCallback) {
		if (this === cBaseEvent)
			throw new cBaseEventException('cBaseEvent is abstract')

		if (typeof pfnCallback !== 'function')
			throw new cBaseEventException('callback must be a function')

		if (!psBaseId)
			throw new cBaseEventException('base ID is required')

		var oEvent = new this(psBaseId, 'dummy') //create an event to get the channel ID
		bean.on(document, oEvent.channel_id(), pfnCallback)
	}
}
