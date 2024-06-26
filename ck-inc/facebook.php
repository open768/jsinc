<?php
//see 
//	https://developers.facebook.com/docs/facebook-login/web/login-button/
//	https://developers.facebook.com/apps/1595545160675026/fb-login/quickstart/

//get the serverside details
$phpinc="../../../php/phpinc";
$home = "$phpinc/ckinc";
require_once ("$home/secret.php");
require_once ("$home/debug.php");
require_once ("$home/facebook.php");
cDebug::check_GET_or_POST();

//Facebook stuff
$FBAPPID=cFacebook_ServerSide::getAppID()->id;	
$FBSESSUSER=cFacebook_ServerSide::getSessionUser();	
$FBSERVERSIDE="php/rest/facebook.php";
$FBVERSION = "v11.0";

?>
<script>	
'use strict';
var AUTH_COOKIE_TIMEOUT =3600; //time out the cookie in 1hr.
var AUTH_USER_COOKIE="fbuser";
var AUTH_DATE_COOKIE="fbdate";

//###############################################################################
//#
//###############################################################################
//**************************************************
//* called when facebook initialises
window.fbAsyncInit = function() {
    FB.init({
		appId      : '<?=$FBAPPID?>',
		cookie     : true,
		xfbml      : true,
		version    : '<?=$FBVERSION?>'
	});
	
    FB.AppEvents.logPageView();   
	FB.Event.subscribe('auth.authResponseChange', function(poEvent){cFacebook.OnFBResponseChange(poEvent);});
	setTimeout( function(){	cFacebook.checkLoginStatus()}, 0);
};

//**************************************************
//* fires up facebook
(
	function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "https://connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk')
);

cDebug.DEBUGGING = true; //DEBUG

//###############################################################################
//#
//###############################################################################
class cFacebook {
	static AppID = "<?=$FBAPPID?>"
	static ServerUser = "<?=$FBSESSUSER?>"
	static fbGetUserURL = null  // url must be set in application
	static fbUserID = null
	static fbAccessToken = null
	static fbAccessExpire = null
	static statusID =null

	//################################################################
	static set_status(psText){
		$( this.statusID).html(psText);
	}

	//################################################################
	static checkLoginStatus(){
		var oThis = this;
		cDebug.enter();
		cDebug.write("checking login status");
		FB.getLoginStatus(function(response) {
			oThis.onFBLoginStatus(response);
		});
		cDebug.leave();
	}

	//**************************************************************
	static getFBUser(){
		cDebug.enter();
		
		if (this.ServerUser !== ""){
			if (cAuth.user){
				cDebug.write("previously authenticated");
				this.onFBGotUser(sUser);
				cDebug.leave();
				return
			}
				
			//check the cookie
			var sUser = $.cookie(AUTH_USER_COOKIE);
			var iDate = $.cookie(AUTH_DATE_COOKIE);
			if (sUser && iDate){
				//-- check the validity of the cookie
				var dNow = new Date();
				var iNow = dNow.getTime();
				if ((iNow - iDate) > AUTH_COOKIE_TIMEOUT){
					cDebug.write("user is cached: " + sUser);
					cAuth.setUser(sUser);
					this.onFBGotUser(sUser);
					cDebug.leave();
					return;
				}else
					cDebug.write("expired login cookie: " );
			}
		}
		
		// no cookie or no server user
		cDebug.write("getting Facebook user details for user " + this.fbUserID);
		//cDebug.write("Access token: " + this.fbAccessToken);
		var oData = {
			o:"getuser",
			user: this.fbUserID,
			token: this.fbAccessToken
		}
		var oThis = this;
		cHttp.post("<?=$FBSERVERSIDE?>", oData, function(poJson){oThis.onGetUserResponse(poJson);});
		cDebug.leave();
	}

	//################################################################
	//see https://developers.facebook.com/docs/facebook-login/web/login-button/
	static onFBLoginStatus (poResponse){	
		cDebug.enter();
		if (poResponse.status == "connected"){
			cDebug.write("user is logged in to facebook");
			var oFBAuthResponse = poResponse.authResponse;
			this.fbUserID = oFBAuthResponse.userID;
			this.fbAccessToken = oFBAuthResponse.accessToken;
			this.fbAccessExpire = oFBAuthResponse.data_access_expiration_time;
			this.set_status("Welcome ...");
			this.getFBUser();
		}else{
			cDebug.write("user not logged into Facebook app");
			this.set_status(" click here &gt; &gt; &gt;");
		}
		cDebug.leave();
	}

	//**************************************************************
	static onGetUserResponse (psData){
		var sUser, dNow;
		cDebug.enter();
		cDebug.write("Auth got response from FB");
		sUser = $.parseJSON(psData);
		if (sUser.trim() === ""){
			sUser = "uh-oh I couldnt get your name";
			$.removeCookie(AUTH_USER_COOKIE);
			$.removeCookie(AUTH_DATE_COOKIE);
			cDebug.write("error: unable to get FB username");
			cDebug.write("try: <?=$FBSERVERSIDE?>?o=getuser&user="+this.fbUserID+"&token="+this.fbAccessToken);
		}else{
			cDebug.write(sUser);
			cAuth.setUser(sUser);
			dNow = new Date();
			$.cookie(AUTH_USER_COOKIE,sUser);
			$.cookie(AUTH_DATE_COOKIE,dNow.getTime());
		}
		this.onFBGotUser(sUser);
		cDebug.leave();
	}
	

	//**************************************************************
	static onFBGotUser(psUser){
		cDebug.enter();
		this.set_status("Welcome " + psUser);
		bean.fire(this,"gotUser");	
		cDebug.leave();
	}
	
	//**************************************************************
	//https://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe/v10.0
	static OnFBResponseChange (poEvent){
		var oThis;
		cDebug.enter();
		oThis = this;
		//setTimeout( function(){	oThis.checkLoginStatus()}, 0);
		cDebug.leave();
	}
}

</script>
