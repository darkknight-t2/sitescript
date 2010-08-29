// ==SiteScript==
// @siteName    Mofile
// @siteUrl     http://tv.mofile.com/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 
// @date        2008/09/21
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


function translateMD5( str ) {
    var key = "r6JNhkeIdl0vMmun829C3sg5qXacwGH1bV4xPypfz7SFYTtEWADiORZLQUBKjo";
    var num = Math.round( Math.random() * 40 ) + 10;
    
    var strs = new Array( str.length );
    
    for ( var i = 0; i < strs.length; i++ ) {
        var char = key.indexOf( str.charAt( i ) );
        
        char += num;
        if ( char > key.length - 1 ) {
            char -= key.length;
        }
        
        strs[ i ] = key.charAt( char );
    }
    
    return num.toString() + strs.join( "" );
}


function isSiteUrl( url ) {
    if ( url.match( /http:\/\/tv\.mofile\.com\/.*/ ) ) {
        return true;
    }
}


function getVideoDetail( url ) {
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( url );
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /<title>(.*?)<\/title>/ );
    var title = RegExp.$1;
    title = title.replace( /-Mofile.*/, '' );
    
    url.match( /http:\/\/tv\.mofile\.com\/(.*)/ );
    var xmlUrl = "http://tv.mofile.com/cn/videoplay/play.do?v=" + RegExp.$1.replace( '/', '' );
    
    text = craving.getResponseText( xmlUrl );
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /<domain>(.*)<\/domain>/ );
    var domain = RegExp.$1;
    
    text.match( /<path>(.*)<\/path>/ );
    var path = RegExp.$1;
    
    text.match( /<downdomainname>(.*)<\/downdomainname>/ );
    var down = RegExp.$1;
    
    text.match( /<md5>(.*)<\/md5>/ );
    var md5 = RegExp.$1;
    
    text.match( /<auditTime>(.*)<\/auditTime>/ );
    var auditTime = RegExp.$1;
    
    var realUrl = "http://" + domain;
    realUrl += "?p=" + translateMD5( path + md5 + auditTime );
    realUrl += "&down=" + down;
    
    return { videoTitle0: title, videoUrl0: realUrl };
}
