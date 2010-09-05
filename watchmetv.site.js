// ==SiteScript==
// @siteName    ワッチミー！TV
// @siteUrl     http://www.watchme.tv/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 
// @date        2010/09/05
// @version     0.3
// ==/SiteScript==


function CravingSiteScript() {
    this._initialize();
}


CravingSiteScript.prototype = {
    _xhr: null,
    
    _initialize: function() {},
    
    _getXmlHttpRequest: function() {
        if ( this._xhr != null ) {
            return this._xhr;
        }
        
        var xhr = null;
        var these = [
              function() { return new XMLHttpRequest(); }
            , function() { return new ActiveXObject( "Msxml2.XMLHTTP" ); }
            , function() { return new ActiveXObject( "Microsoft.XMLHTTP" ); }
            , function() { return new ActiveXObject( "Msxml2.XMLHTTP.4.0" ); }
        ];
        
        for ( var i = 0, length = these.length; i < length; i++ ) {
            var func = these[ i ];
            try {
                xhr = func();
                break;
            }
            catch( e ) {}
        }
        this._xhr = xhr;
        
        return this._xhr;
    },
    
    _load: function( url, data, method ) {
        var req = this._getXmlHttpRequest();
        
        var mtd = ( method == null ) ? "GET" : "POST";
        
        req.open( mtd, url, false );
        
        if ( mtd == "POST" ) {
            req.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
        }
        
        req.send( data );
        
        return req.responseText;
    },
    
    getResponseText: function( url, data, method ) {
        return this._load( url, data, method );
    },
    
    getResponseJSON: function( url, data, method ) {
        var text = this._load( url, data, method );
        
        return eval( "("+text+")" );
    },
    
    random: function( limit ) {
        return Math.floor( Math.random() * limit );
    }
}


function isSiteUrl( url ) {
    if ( url.match( /http:\/\/www\.watchme\.tv\/v2?\/\?mid=.*/ ) ) {
        return true;
    }
}


function getVideoDetail( url ) {
    url.match( /http:\/\/www\.watchme\.tv\/v\/\?mid=(.*)/ );
    var xmlUrl = "http://www.watchme.tv/v/flvxml.php?mid=" + RegExp.$1;
    
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( xmlUrl );
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /videoTitle="(.*?)"/ );
    var title = RegExp.$1;
    
    text.match( /flvURL="(.*?)"/ );
    var realUrl = RegExp.$1;
    
    return { videoTitle0: title, videoUrl0: realUrl };
}
