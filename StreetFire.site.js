// ==SiteScript==
// @siteName    StreetFire
// @siteUrl     http://www.streetfire.net/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 
// @date        2009/05/03
// @version     0.1
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
    
    /// Math
    random: function( limit ) {
        return Math.floor( Math.random() * limit );
    },
    
    /// String
    decodeHtml: function( str ) {
        return str.replace( /&(quot|#34);/ig,    "\"" )
                  .replace( /&(amp|#38);/ig,     "&"  )
                  .replace( /&(apos|#39);/ig,    "'"  )
                  .replace( /&(lt|#60);/ig,      "<"  )
                  .replace( /&(gt|#62);/ig,      ">"  )
                  .replace( /&(nbsp|#160);/ig,   " "  )
                  .replace( /&(#91);/ig,         "["  )
                  .replace( /&(#93);/ig,         "]"  )
                  .replace( /&(frasl|#8260);/ig, "/"  );
    }
}


function isSiteUrl( url ) {
    if ( url.match( /http:\/\/videos\.streetfire\.net\/video\/.*\.htm/ ) ) {
        return true;
    }
}


function getVideoDetail( url ) {
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( url );
    
    if ( text == null ) {
        return null;
    }
    
    var condomain = url.replace( ':', "%3A" );
    
    text.match( /s2\.addVariable\('video','(.*?)'\);/ );
    var xmlUrl = "http://videos.streetfire.net/handlers/SFAsysPlayer_GetData.ashx?playerinfo={"
    + "%20id:'null',%20mode:'stdvideo_from_id',%20note:'true',%20pno:'-1',%20cfg:'4482',%20playlistid:'-1'"
    + ",%20video:'" + RegExp.$1 + "'"
    + ",%20album:'null',%20photo:'null',%20overlay:'null',%20conurl:''"
    + ",%20condomain:'" + condomain + "'"
    + ",%20watchedlist:''%20}";
    xmlUrl += "&rnd=" + Math.random();
    
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( xmlUrl );
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /<media:title>(.*?)<\/media:title>/ );
    var title = RegExp.$1;
    
    text.match( /<sf:mediapath>(.*?)<\/sf:mediapath>/ );
    var realUrl = RegExp.$1;
    
    return { videoTitle0: title, videoUrl0: realUrl };
}
