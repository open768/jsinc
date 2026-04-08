//***************************************************************************
class cEventSubscriber {

	/** @type {boolean} */ active = true
	unsubscribe() {
		this.active = false
	}
}

//***************************************************************************
class cBaseEvent {
	base_id = null //allows consumers to listen for events associated with a common base_id
	action = null
	data = null
	static _subscriber_counts = {}
	static _subscribers = new Map() // TODO: store anonymous functions here so we can unsubscribe if needed


	static base_actions= {
		notify_subscription: "BENS"
	}
	/**
	 * Creates a new CA event instance.
	 * @param {string} psBaseId - The base ID associated with the event.
	 * @param {string} psAction - The action type for the event.
	 * @param {*} [poData=null] - Optional payload for the event.
	 * @throws {Error} If required arguments are missing .
	 */
	constructor(psBaseId, psAction, poData = null) {
		if (typeof bean === 'undefined')
			cDebug.error('bean library is missing')
		if (this.constructor === cBaseEvent)
			cDebug.error('cBaseEvent is abstract - instances are not allowed')

		if (!psBaseId )
			cDebug.error(`${this.name}: base ID missing`)
		if (typeof psAction === 'undefined')
			cDebug.error(`${this.name}: invalid action`)
		if ( !psAction )
			cDebug.error(`${this.name}: action required`)


		this.base_id = psBaseId
		this.action = psAction
		this.data = poData
	}

	//********************************************************************
	channel_id() {
		return this.constructor.name + this.base_id + this.action //creates a unique ID for a specific event and action
	}

	//********************************************************************
	async trigger() {
		var sEventName = this.channel_id()
		var bSuppress
		if (cDebug.is_debugging()){
			if (typeof cSuppressMessage === 'undefined')
				bSuppress = false
			else
				bSuppress = cSuppressMessage.should_suppress(sEventName)

			if (!bSuppress)
				cDebug.extra_debug(`${this.constructor.name}: base:"${this.base_id}" action:"${this.action}"`)
		}

		bean.fire(document, sEventName, this)
	}

	//********************************************************************
	static async fire_event(psBaseId, psAction, poData = null) {
		if (this === cBaseEvent)
			cDebug.error('cBaseEvent is abstract')

		if (!psBaseId)
			cDebug.error(`${this.name}: base ID is required`)

		if ( typeof psAction === 'undefined' || !psAction )
			cDebug.error(`${this.name}: action is required`)

		var oEvent = new this(psBaseId, psAction, poData) //create specific instance
		oEvent.trigger()
	}

	//********************************************************************
	//* subscribe
	//********************************************************************
	/**
	 *
	 * @param {string} psBaseId
	 * @param {Array<string>} paSubscribedActions
	 * @param {Function} pfnCallback
	 */

	static async subscribe(psBaseId, paSubscribedActions, pfnCallback) {
		if (this === cBaseEvent)
			cDebug.error('cBaseEvent is abstract')

		if (typeof pfnCallback !== 'function')
			cDebug.error(`${this.name}: callback must be a function `)

		if (!Array.isArray(paSubscribedActions))
			cDebug.error(`${this.name}: subscribed actions must be an array`)

		if (!psBaseId)
			cDebug.error(`${this.name}: base ID is required`)

		//--------------------------------------------------------------------
		for (var sAction of paSubscribedActions) {
			if (!sAction)
				cDebug.error(`${this.name}: subscribed action is empty`)

			var oEvent = new this(psBaseId, sAction) //create an event to get the channel ID
			var sChannelId = oEvent.channel_id()
			bean.on(document, sChannelId, pfnCallback)

			this._add_subscriber(oEvent) //keep track of subscribers for this event type
		}
	}

	/**
	 *
	 * @param {cBaseEvent} poEvent
	 */
	static async _add_subscriber(poEvent) {
		//access the static _subscriber_counts property of the subclass
		//is there already a subscriber list for this base ID and action?
		var aSubclassSubscribers = this._subscriber_counts
		var sChannelId = poEvent.channel_id()

		if (!aSubclassSubscribers[sChannelId])
			aSubclassSubscribers[sChannelId] = 1
		else
			aSubclassSubscribers[sChannelId]++
	}

	static get_subscriber_count(psBaseId, psAction){
		//create a new instance of the subclass
		var oEvent = new this(psBaseId, psAction)
		var sChannelId = oEvent.channel_id()
		return this._subscriber_counts[sChannelId] || 0
	}
}
