// ==SiteScript==
// @siteName    XTube
// @siteUrl     http://xtube.com/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 
// @date        2008/10/28
// @version     0.2
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
    },
    
    encodeHtml: function( str ) {
        return str.replace( /_/ig, "%5F" )
                  .replace( /-/ig, "%2D" );
    }
}


function isSiteUrl( url ) {
    if ( url.match( /http:\/\/.*\.xtube\.com\/watch.*\.php/ ) ) {
        return true;
    }
}


function getVideoDetail( url ) {
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( url );
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /<h2>(.*?)<\/h2>/ );
    var title = RegExp.$1;
    
    text.match( /so_s\.addVariable\("swfURL", "(.*?)"\)/ );
    var baseUrl = RegExp.$1;
    
    text.match( /so_s\.addVariable\("user_id", "(.*?)"\)/ );
    var usrId = RegExp.$1;
    
    text.match( /so_s\.addVariable\("video_id", "(.*?)"\)/ );
    var videoId = RegExp.$1;
    
    text.match( /so_s\.addVariable\("clip_id", "(.*?)"\)/ );
    var clipId = RegExp.$1;
    
    var xmlUrl = "http://video2.xtube.com/find_video.php";
    var data = "user%5Fid=" + usrId + "&clip%5Fid=" + clipId + "&video%5Fid=" + videoId;
    
    data = craving.encodeHtml( data );
    
    text = craving.getResponseText( xmlUrl, data, "POST" );
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /filename=(.*?)&/ );
    
    var realUrl = baseUrl + RegExp.$1;
    
    return { videoTitle0: title, videoUrl0: realUrl };
}
