// ==SiteScript==
// @siteName    B9
// @siteUrl     http://up.b9dm.com/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 
// @date        2008/10/05
// @version     0.8
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
    if ( url.match( /http:\/\/up\.b9dm\.com\/video\.php\/.*\.htm/ ) ) {
        return true;
    }
    else if ( url.match( /http:\/\/up\.b9dm\.com\/video\.php\?vid=\d+/ ) ) {
        return true;
    }
    else if ( url.match( /http:\/\/up\.b9dm\.com\/.*\/\d+_\d+\.html/ ) ) {
        return true;
    }
    else if ( url.match( /http:\/\/up\.b9dm\.com\/.*\/(.*\/)?\d+\.html/ ) ) {
        return true;
    }
}


function getVideoDetail( url ) {
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( url );
    
    if ( text == null ) {
        return null;
    }
    
    if ( text.match( /SWFObject\(".*siteid=(.*?)&.*vid=(.*?)&.*"/ ) == null ) {
        text.match( /SWFObject\("http:\/\/union\.bokecc\.com\/flash\/player\.swf\?videoID=(.*?)_(.*?)"/ );
    }
    var userId = RegExp.$1
    var videoId = RegExp.$2;
    
    var xmlUrl = "http://union.bokecc.com/servlet/GetVideoStatus";
    xmlUrl += "?videoID=" + videoId;
    xmlUrl += "&userID=" + userId;
    xmlUrl += "&random=" + Math.random();
    
    text = craving.getResponseText( xmlUrl );
    
    if ( text == null ) {
        return null;
    }
    
    if ( text.match( /title="(.*?)"/ ) == null ) {
        xmlUrl = "http://union.bokecc.com/servlet/getPlayerSkin";
        xmlUrl += "?videoID=" + videoId;
        xmlUrl += "&userID=" + userId;
        
        text = craving.getResponseText( xmlUrl );
        
        if ( text == null ) {
            return null;
        }
        
        if ( text.match( /\d*_\d*_(.*)/ ) == null ) {
            return null;
        }
        userId = RegExp.$1;
        
        xmlUrl = "http://union.bokecc.com/servlet/GetVideoStatus";
        xmlUrl += "?videoID=" + videoId;
        xmlUrl += "&userID=" + userId;
        xmlUrl += "&random=" + Math.random();
        
        text = craving.getResponseText( xmlUrl );
        
        if ( text == null ) {
            return null;
        }
    }
    text.match( /title="(.*?)"/ );
    var title = RegExp.$1;
    
    text.match( /flvPath="(.*?)"/g );
    var realUrl = RegExp.$1;
    
    return { videoTitle0: title, videoUrl0: realUrl };
}
