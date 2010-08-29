// ==SiteScript==
// @siteName    cctv(星播客)
// @siteUrl     http://video.cctv.com/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 暫定版 4 つの内 3 つは必ず失敗します
// @date        2008/12/29
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
                  .replace( /&(frasl|#8260);/ig, "/"  );
    }
}


function isSiteUrl( url ) {
    if ( url.match( /http:\/\/video\.cctv\.com\/opus\/.*\.html/ ) ) {
        return true;
    }
    else if ( url.match( /http:\/\/video\.cctv\.com\/channel\/.*\.html/ ) ) {
        return true;
    }
}


function getVideoDetail( url ) {
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( url );
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /so\.addVariable\("VideoID", (\d+)\)/ );
    var videoId = RegExp.$1;
    
    text.match( /so\.addVariable\("server", "(.*?)"\)/ );
    var server = RegExp.$1;
    
    var t = craving.random( 1000000000000 ) + 10000000000000;
    var xmlUrl = server + "/videodetail?id=" + videoId + "&t=" + t;
    
    text = craving.getResponseText( xmlUrl );
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /name="(.*?)"/ );
    var title = RegExp.$1;
    
    text.match( /url="(.*?)"/ );
    var realUrl = RegExp.$1;
    if ( realUrl.match( /community\d+\.flv/ ) == null ) {
        realUrl.match( /(.*)\/.*\.flv/ );
        realUrls = new Array( 4 );
        realUrls[ 0 ] = RegExp.$1 + "/" + videoId *   2 + ".flv";
        realUrls[ 1 ] = RegExp.$1 + "/" + videoId *   4 + ".flv";
        realUrls[ 2 ] = RegExp.$1 + "/" + videoId *  64 + ".flv";
        realUrls[ 3 ] = RegExp.$1 + "/" + videoId * 512 + ".flv";
        
        return {
              videoTitle0: title, videoUrl0: realUrls[ 0 ]
            , videoTitle1: title, videoUrl1: realUrls[ 1 ]
            , videoTitle2: title, videoUrl2: realUrls[ 2 ]
            , videoTitle3: title, videoUrl3: realUrls[ 3 ]
        };
    }
    else {
        return { videoTitle0: title, videoUrl0: realUrl }
    }
}
