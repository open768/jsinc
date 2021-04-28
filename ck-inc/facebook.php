<?php
//see 
//	https://developers.facebook.com/docs/facebook-login/web/login-button/
//	https://developers.facebook.com/apps/1595545160675026/fb-login/quickstart/

//get the serverside details
$root = realpath("../");
$phpinc = realpath("$root/../phpinc");
require_once("$phpinc/ckinc/header.php");
require_once("$phpinc/ckinc/secret.php");
require_once("$phpinc/ckinc/facebook.php");

$FBAPPID= (cHeader::is_localhost()?cSecret::FB_DEV_APP:cSecret::FB_APP);
$FBSESSUSER=cFacebook_ServerSide::getSessionUser();	
?>
//<script>	
var AUTH_COOKIE_TIMEOUT =3600; //time out the cookie in 1hr.
var AUTH_USER_COOKIE="fbuser";
var AUTH_DATE_COOKIE="fbdate";

//**************************************************
//* called when facebook initialises
window.fbAsyncInit = function() {
    FB.init({
		appId      : '<?=$FBAPPID?>',
		cookie     : true,
		xfbml      : true,
		version    : 'v10.0'
	});
	
    FB.AppEvents.logPageView();   
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


var cFacebook = {
	AppID:"<?=$FBAPPID?>",
	ServerUser:"<?=$FBSESSUSER?>",
	fbGetUserURL: null, // url must be set in application
	fbUserID: null,
	fbAccessToken: null,
	fbAccessExpire: null,
	statusID:null,

	//################################################################
	pr_set_status:function(psText){
		$( this.statusID).html(psText);
	},

	//################################################################
	checkLoginStatus: function(){
		var oThis = this;
		cDebug.enter();
		cDebug.write("checking login status");
		FB.getLoginStatus(function(response) {
			oThis.onFBLoginStatus(response);
		});
		cDebug.leave();
	},

	//**************************************************************
	getFBUser: function(){
		var oThis = this;
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
		cHttp.post("php/rest/facebook.php", oData, function(poJson){oThis.onGetUserResponse(poJson);});
		cDebug.leave();
	},

	//################################################################
	onFBLoginStatus: function (poResponse){	
		//CODE To be written see https://developers.facebook.com/docs/facebook-login/web/login-button/
		cDebug.enter();
		if (poResponse.status == "connected"){
			cDebug.write("user is logged in to facebook");
			var oFBAuthResponse = poResponse.authResponse;
			this.fbUserID = oFBAuthResponse.userID;
			this.fbAccessToken = oFBAuthResponse.accessToken;
			this.fbAccessExpire = oFBAuthResponse.data_access_expiration_time;
			this.pr_set_status("Welcome ...");
			this.getFBUser();
		}else{
			cDebug.write("user not logged into Facebook app");
			this.pr_set_status(" click here &gt; &gt; &gt;");
		}
		cDebug.leave();
	},

	//**************************************************************
	onGetUserResponse :function(psData){
		var sUser, dNow;
		cDebug.enter();
		cDebug.write("Auth got response from FB");
		sUser = $.parseJSON(psData);
		cDebug.write(sUser);
		cAuth.setUser(sUser);
		dNow = new Date();
		$.cookie(AUTH_USER_COOKIE,sUser);
		$.cookie(AUTH_DATE_COOKIE,dNow.getTime());
		this.onFBGotUser(sUser);
		cDebug.leave();
	},
	

	//**************************************************************
	onFBGotUser: function(psUser){
		cDebug.enter();
		this.pr_set_status("Welcome " + psUser);
		bean.fire(this,"gotUser");	
		cDebug.leave();
	}
}

//</script>
