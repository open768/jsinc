'use strict'

//###############################################################################
//#
//###############################################################################
class cFacebook {
	static AppID = 'not set'
	static ServerUser = 'not set'
	static fbGetUserURL = null // url must be set in application
	static fbUserID = null
	static fbAccessToken = null
	static fbAccessExpire = null
	static NameID = null
	static AUTH_COOKIE_TIMEOUT = 3600 //time out the cookie in 1hr.
	static AUTH_USER_COOKIE = 'fbuser'
	static AUTH_DATE_COOKIE = 'fbdate'
	static STATUS_EVENT = 'FBeVStatus'

	//################################################################
	static checkLoginStatus() {
		const oThis = this
		cDebug.enter()

		cDebug.write('checking login status')
		FB.getLoginStatus(response => oThis.onFBLoginStatus(response))
		cDebug.leave()
	}

	//**************************************************************
	static getFBUser() {
		cDebug.enter()
		const oThis = this

		if (this.ServerUser !== '') {
			if (cAuth.user) {
				cDebug.write('previously authenticated')
				this.onFBGotUser(cAuth.user)
				cDebug.leave()
				return
			}

			cDebug.write('checking authentication cookies')
			//check whether user is allready logged in - ie the cookie sent by our server
			var sUser = $.cookie(this.AUTH_USER_COOKIE)
			var iDate = $.cookie(this.AUTH_DATE_COOKIE)
			if (sUser && iDate) {
				//-- check the validity of the cookie
				var dNow = new Date()
				var iNow = dNow.getTime()
				if (iNow - iDate > this.AUTH_COOKIE_TIMEOUT) {
					cDebug.write('user is cached: ' + sUser)
					cAuth.setUser(sUser)
					this.onFBGotUser(sUser)
					cDebug.leave()
					return
				} else cDebug.write('expired login cookie: ')
			}
		}

		// no cookie or no server user
		// get the information from the server
		cDebug.write('getting Facebook user details for user ' + this.fbUserID)
		var oData = {
			[cAppUrlParams.OPERATION]: 'getuser',
			u: this.fbUserID,
			t: this.fbAccessToken
		}

		var oHttp = new cHttp2()
		{
			bean.on(oHttp, 'result', poHttp => oThis.onGetUserResponse(poHttp))
			oHttp.post(cFBConfig.$SERVER_SIDE, oData)
		}
		cDebug.leave()
	}

	//################################################################
	//see https://developers.facebook.com/docs/facebook-login/web/login-button/
	static onFBLoginStatus(poResponse) {
		cDebug.enter()
		const oThis = this
		if (poResponse.status == 'connected') {
			cDebug.write('user is logged in to facebook')
			var oFBAuthResponse = poResponse.authResponse
			this.fbUserID = oFBAuthResponse.userID
			this.fbAccessToken = oFBAuthResponse.accessToken
			this.fbAccessExpire = oFBAuthResponse.data_access_expiration_time
			bean.fire(this, this.STATUS_EVENT, 'Welcome ...')
			setTimeout(() => oThis.getFBUser(), 0) //do this asynchronously
		} else {
			cDebug.write('user not logged into Facebook app')
			bean.fire(this, this.STATUS_EVENT, ' click here &gt; &gt; &gt;')
		}
		cDebug.leave()
	}

	//**************************************************************
	static onGetUserResponse(poHttp) {
		var dNow
		cDebug.enter()
		cDebug.write('Auth got response from FB')
		var sUser = poHttp.response
		if (typeof sUser !== 'string') $.error('user response is not a string')

		if (sUser.trim() === '') {
			sUser = 'uh-oh I couldnt get your name'
			$.removeCookie(this.AUTH_USER_COOKIE)
			$.removeCookie(this.AUTH_DATE_COOKIE)
			cDebug.write('error: unable to get FB username')
			var sUrl = cBrowser.buildUrl(cFBConfig.$SERVER_SIDE, {
				[cAppUrlParams.OPERATION]: 'getuser',
				user: this.fbUserID,
				token: this.fbAccessToken
			})
			cDebug.write('try entering this in the browser: ' + sUrl)
		} else {
			cDebug.write(sUser)
			cAuth.setUser(sUser)
			dNow = new Date()
			$.cookie(this.AUTH_USER_COOKIE, sUser)
			$.cookie(this.AUTH_DATE_COOKIE, dNow.getTime())
		}
		this.onFBGotUser(sUser)
		cDebug.leave()
	}

	//**************************************************************
	static onFBGotUser(psUser) {
		const oThis = this
		cDebug.enter()
		bean.fire(this, this.STATUS_EVENT, 'Welcome ' + psUser)

		//subscribe to logout
		FB.Event.subscribe('auth.logout', poEvent => oThis.OnFBLogout(poEvent))

		cDebug.leave()
	}

	//**************************************************************
	//https://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe/v10.0
	static OnFBLogout(poEvent) {
		cDebug.enter()
		//not implemented
		//setTimeout( function(){	oThis.checkLoginStatus()}, 0);
		cDebug.leave()
	}
}

//###############################################################################
//# this is from https://developers.facebook.com/apps/551240839671132/fb-login/quickstart/
//# NOTE dont change the code to OO, this is the code  FB provided
//###############################################################################
//* called when facebook initialises

window.fbAsyncInit = function () {
	FB.init({
		appId: cFacebook.AppID,
		cookie: true,
		xfbml: true,
		version: cFBConfig.VERSION
	})

	FB.AppEvents.logPageView()

	//additional stuff
	FB.Event.subscribe('auth.logout', function (poEvent) {
		cFacebook.OnFBLogout(poEvent)
	})

	setTimeout(() => cFacebook.checkLoginStatus())
}

//* fires up facebook
;(function (d, s, id) {
	var js,
		fjs = d.getElementsByTagName(s)[0]
	if (d.getElementById(id)) {
		return
	}
	js = d.createElement(s)
	js.id = id
	js.src = 'https://connect.facebook.net/en_US/sdk.js'
	fjs.parentNode.insertBefore(js, fjs)
})(document, 'script', 'facebook-jssdk')
