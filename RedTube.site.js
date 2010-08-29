// ==SiteScript==
// @siteName    RedTube
// @siteUrl     http://redtube.com/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 
// @date        2008/10/17
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
    }
}


function isSiteUrl( url ) {
    if ( url.match( /http:\/\/www\.redtube\.com\/\d+/ ) ) {
        return true;
    }
}


function getVideoDetail( url ) {
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( url );
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /<h1 class='videoTitle'>(.*?)</ );
    var title = RegExp.$1;
    
    text.match( /so\.addVariable\("id", "(\d+)"\)/ );
    var id = RegExp.$1;
    
    text.match( /so\.addVariable\("styleURL", "(.*?)"\)/ );
    var styleUrl = "http://www.redtube.com" + RegExp.$1;
    
    text = craving.getResponseText( styleUrl );
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /config\.stream{\r\n\tURL: (.*?);/ );
    var streamUrl = RegExp.$1;
    
    var s = "" + id;
    if ( s == "") {
        s = "1";
    }
    
    var pathnr = "" + Math.floor( parseFloat( s ) / 1000 );
    var l = s.length;
    
    for ( var i = 1; i <= 7 - l; i++ ) {
        s = "0" + s;
    }
    
    l = pathnr.length;
    
    for ( var i = 1; i <= 7 - l; i++ ) {
        pathnr = "0" + pathnr;
    }
    
    var xc = new Array( "R", "1", "5", "3", "4", "2", "O", "7", "K", "9", "H", "B", "C", "D", "X", "F", "G", "A", "I", "J", "8", "L", "M", "Z", "6", "P", "Q", "0", "S", "T", "U", "V", "W", "E", "Y", "N" );
    var code = "";
    var qsum = 0;
    
    for ( var i = 0; i <= 6; i++ ) {
        qsum = qsum + parseInt( s.charAt( i ) ) * ( i + 1 );
    }
    
    var s1 = "" + qsum;
    qsum = 0;
    
    for ( var i = 0; i < s1.length; i++ ) {
        qsum = qsum + parseInt( s1.charAt( i ) );
    }
    
    var qstr;
    if ( qsum >= 10 ) {
        qstr = "" + qsum;
    }
    else {
        qstr = "0" + qsum;
    }
    
    code = code + xc[ s.charCodeAt( 3 ) - 48 + qsum + 3 ];
    code = code + qstr.charAt( 1 );
    code = code + xc[ s.charCodeAt( 0 ) - 48 + qsum + 2 ];
    code = code + xc[ s.charCodeAt( 2 ) - 48 + qsum + 1 ];
    code = code + xc[ s.charCodeAt( 5 ) - 48 + qsum + 6 ];
    code = code + xc[ s.charCodeAt( 1 ) - 48 + qsum + 5 ];
    code = code + qstr.charAt( 0 );
    code = code + xc[ s.charCodeAt( 4 ) - 48 + qsum + 7 ];
    code = code + xc[ s.charCodeAt( 6 ) - 48 + qsum + 4 ];
    
    var realUrl = streamUrl + pathnr + "/" + code + ".flv";;
    
    return { videoTitle0: title, videoUrl0: realUrl };
}
