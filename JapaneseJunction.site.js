// ==SiteScript==
// @siteName    JapaneseJunction
// @siteUrl     http://video.japanesejunction.com/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 
// @date        2009/09/04
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
                  .replace( /&(#91);/ig,         "["  )
                  .replace( /&(#93);/ig,         "]"  )
                  .replace( /&(frasl|#8260);/ig, "/"  );
    }
}


function isSiteUrl( url ) {
    if ( url.match( /http:\/\/video\.japanesejunction\.com\/videos\/\d+\// ) ) {
        return true;
    }
    if ( url.match( /http:\/\/video\.japanesejunction\.com\/play\.php\?vid=\d+/ ) ) {
        return true;
    }
}


function getVideoDetail( url ) {
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( url );
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /<span class="font5_12">(.*?)<\/span>/ );
    var title = craving.decodeHtml( RegExp.$1 );
    
    if ( !text.match( /so\.addVariable\('file','(.*?)'\)/ ) ) {
        return null;
    }
    var file = RegExp.$1;
    
    var streamer;
    if ( text.match( /so\.addVariable\("streamer","(.*?)"\)/ ) ) {
       streamer = RegExp.$1;
    }
    else {
       streamer = "http://server1.video.japanesejunction.com/xmoov.php";
    }
    var realUrl = streamer + "?file=" + file + "&start=0"; 
    
    return { videoTitle0: title, videoUrl0: realUrl };
}
