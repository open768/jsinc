class cBaseEventException extends Error {}

//***************************************************************************
class cBaseEvent {
	base_id = null //allows consumers to listen for events associated with a common base_id
	action = null
	data = null
	static _trigger_counts = {}
	static NOISY_TRIGGER_COUNT = 100

	static base_actions= {
		notify_subscription: "BENS"
	}
	static _subscribers = {}

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
		if (typeof psAction === 'undefined')
			throw new cBaseEventException('invalid action')
		if ( !psAction )
			throw new cBaseEventException('action required')


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
		if (cDebug.is_debugging()){
			var aCounts = cBaseEvent._trigger_counts
			var iCount = aCounts[sEventName] || 0
			iCount++
			aCounts[sEventName] = iCount

			if (iCount <= cBaseEvent.NOISY_TRIGGER_COUNT)
				cDebug.write('event>> base:"' + this.base_id + '" type:' + this.constructor.name + ' action:' + this.action)
			if (iCount === cBaseEvent.NOISY_TRIGGER_COUNT)
				cDebug.write('event>> base:"' + this.base_id + '" type:' + this.constructor.name + ' action:' + this.action + ' (further events suppressed)')
		}

		bean.fire(document, sEventName, this)
	}

	//********************************************************************
	static async fire_event(psBaseId, psAction, poData = null) {
		if (this === cBaseEvent)
			throw new CAException('cBaseEvent is abstract')

		if (!psBaseId)
			throw new cBaseEventException('base ID is required')

		if (typeof psAction === 'undefined')
			throw new cBaseEventException('action is required')


		var oEvent = new this(psBaseId, psAction, poData) //create specific instance
		oEvent.trigger()
	}

	//********************************************************************
	/**
	 *
	 * @param {string} psBaseId
	 * @param {Array<string>} paSubscribedActions
	 * @param {Function} pfnCallback
	 */

	static async subscribe(psBaseId, paSubscribedActions, pfnCallback) {
		if (this === cBaseEvent)
			throw new cBaseEventException('cBaseEvent is abstract')

		if (typeof pfnCallback !== 'function')
			throw new cBaseEventException('callback must be a function')

		if (!Array.isArray(paSubscribedActions))
			throw new cBaseEventException('subscribed actions must be an array')

		if (!psBaseId)
			throw new cBaseEventException('base ID is required')

		//--------------------------------------------------------------------
		for (var sAction of paSubscribedActions) {
			if (!sAction)
				throw new cBaseEventException('action is empty')

			var oEvent = new this(psBaseId, sAction) //create an event to get the channel ID
			var sChannelId = oEvent.channel_id()
			bean.on(document, sChannelId, pfnCallback)

			cBaseEvent._add_subscriber(oEvent) //keep track of subscribers for this event type
		}
	}

	/**
	 *
	 * @param {cBaseEvent} poEvent
	 */
	static _add_subscriber(poEvent) {
		//access the static _subscribers property of the subclass
		//is there already a subscriber list for this base ID and action?
		var aSubclassSubscribers = cBaseEvent._subscribers
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
		return cBaseEvent._subscribers[sChannelId] || 0
	}
}
