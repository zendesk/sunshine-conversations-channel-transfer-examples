'use strict';

(() => {
	// Gather credentials from query parameters
	const appId = getParam('appId');
	const authCode = getParam('authCode');
	const id = getParam('id');
	const token = getParam('token');

	// Fetch Smooch SDK
	!function(e,n,t,r){
        function o(){try{var e;if((e="string"==typeof this.response?JSON.parse(this.response):this.response).url){
        var t=n.getElementsByTagName("script")[0],r=n.createElement("script");r.async=!0,r.src=e.url,t.parentNode.insertBefore(r,t)}}catch(e){}}
        var s,p,a,i=[],c=[];e[t]={init:function(){s=arguments;var e={then:function(n){return c.push({type:"t",next:n}),e},catch:function(n){
        return c.push({type:"c",next:n}),e}};return e},on:function(){i.push(arguments)},render:function(){p=arguments},destroy:function(){a=arguments}},
        e.__onWebMessengerHostReady__=function(n){if(delete e.__onWebMessengerHostReady__,e[t]=n,s)for(var r=n.init.apply(n,s),o=0;o<c.length;o++){
        var u=c[o];r="t"===u.type?r.then(u.next):r.catch(u.next)}p&&n.render.apply(n,p),a&&n.destroy.apply(n,a);for(o=0;o<i.length;o++)n.on.apply(n,i[o])};
        var u=new XMLHttpRequest;u.addEventListener("load",o),u.open("GET","https://"+r+".webloader.smooch.io/",!0),u.responseType="json",u.send()
    }(window,document,"Smooch", appId);

    // Initialize Smooch and login
    Smooch.init({ appId, authCode }).then(() => Smooch.login(id, token));


    // Utility function to get query parameters from the URL
	function getParam(name) {
	    const regex = new RegExp("[?&]" + name.replace(/[\[\]]/g, "\\$&") + "(=([^&#]*)|&|#|$)");
	    const results = regex.exec(window.location.href);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
})();