// ==SiteScript==
// @siteName    Gaytube
// @siteUrl     http://www.gaytube.com/
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
                  .replace( /&(frasl|#8260);/ig, "/"  );
    }
}


function isSiteUrl( url ) {
    if ( url.match( /http:\/\/(www.)?gaytube\.com\/media\/\d+/ ) ) {
        return true;
    }
}


function getVideoDetail( url ) {
    var mediaId;
    if ( url.match( /http:\/\/(www.)?gaytube\.com\/media\/(\d+)/ ) ) {
        mediaId = RegExp.$2;
    }
    else {
        return null;
    }
    url = url.replace( /^http:\/\/gaytube\.com\//, "http://www.gaytube.com/" );
    
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( url );
    
    if ( text == null ) {
        return null;
    }
    
    var title;
    if ( text.match( /<div class='maintitle'>(.*?)<a href/ ) ) {
        title = RegExp.$1;
    }
    else {
        title = "gaytube_" + mediaId;
    }
    title = title.replace( /[\\\/:*?"<>|]/g, "_" );
    
    var xmlUrl;
    if ( text.match( /so\.addVariable\('config'\s*,\s*'([^']+)'/ ) ) {
        xmlurl = RegExp.$1;
    }
    else {
        xmlUrl = "http://www.gaytube.com/flv_player/data/playerConfig/" + mediaId + ".xml";
    }
    
    text = craving.getResponseText( xmlUrl );
    
    if ( text == null ) {
        return null;
    }
    
    if ( !text.match( /<file>(.*?)<\/file>/ ) ) {
        return null;
    }
    var realUrl = RegExp.$1;
    
    return { videoTitle0: title, videoUrl0: realUrl };
}
