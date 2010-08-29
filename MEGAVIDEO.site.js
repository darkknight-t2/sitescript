// ==SiteScript==
// @siteName    MEGAVIDEO
// @siteUrl     http://megavideo.com/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 
// @date        2008/12/14
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


function decrypt( str, key1, key2 ) {
    var strs = [];
    
    for ( var i = 0; i < str.length; i++ ) {
        switch ( str.charAt( i ) ) {
            case '0': strs.push( '0000' ); break;
            case '1': strs.push( '0001' ); break;
            case '2': strs.push( '0010' ); break;
            case '3': strs.push( '0011' ); break;
            case '4': strs.push( '0100' ); break;
            case '5': strs.push( '0101' ); break;
            case '6': strs.push( '0110' ); break;
            case '7': strs.push( '0111' ); break;
            case '8': strs.push( '1000' ); break;
            case '9': strs.push( '1001' ); break;
            case 'a': strs.push( '1010' ); break;
            case 'b': strs.push( '1011' ); break;
            case 'c': strs.push( '1100' ); break;
            case 'd': strs.push( '1101' ); break;
            case 'e': strs.push( '1110' ); break;
            case 'f': strs.push( '1111' );
        }
    }
    
    strs = ( strs.join( '' ) ).split( '' );
    
    var keys = [];
    
    for ( var i = 0; i < 384; i++ ) {
        key1 = ( key1 * 11 + 77213 ) % 81371;
        key2 = ( key2 * 17 + 92717 ) % 192811;
        keys[ i ] = ( key1 + key2 ) % 128;
    }
    
    for ( var i = 256; i >= 0; i-- ) {
        var val1 = keys[ i ];
        var val2 = i % 128;
        var tmp = strs[ val1 ];
        strs[ val1 ] = strs[ val2 ];
        strs[ val2 ] = tmp;
    }
    
    for ( i = 0; i < 128; i++ ) {
        strs[ i ] = strs[ i ] ^ ( keys[ i + 256 ] & 1 );
    }
    
    strs = strs.join( '' );
    var arr = [];
    
    for ( var i = 0; i < strs.length; i +=4 ) {
        var tmp = strs.substr( i, 4 );
        arr.push( tmp );
    }
    
    var result = [];
    
    for ( var i = 0; i < arr.length; i++ ) {
        switch ( arr[ i ] ) {
            case '0000': result.push('0'); break;
            case '0001': result.push('1'); break;
            case '0010': result.push('2'); break;
            case '0011': result.push('3'); break;
            case '0100': result.push('4'); break;
            case '0101': result.push('5'); break;
            case '0110': result.push('6'); break;
            case '0111': result.push('7'); break;
            case '1000': result.push('8'); break;
            case '1001': result.push('9'); break;
            case '1010': result.push('a'); break;
            case '1011': result.push('b'); break;
            case '1100': result.push('c'); break;
            case '1101': result.push('d'); break;
            case '1110': result.push('e'); break;
            case '1111': result.push('f');
        }
    }
    
    return result.join( '' );
};


function isSiteUrl( url ) {
    if ( url.match( /http:\/\/www\.megavideo\.com\/\?v=.*/ ) ) {
        return true;
    }
}


function getVideoDetail( url ) {
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( url );
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /flashvars\.title = "(.*?)";/ );
    var title = decodeURIComponent( RegExp.$1 );
    title = title.replace( /\+/g, ' ' );
    
    text.match( /flashvars\.un = "(.*?)";/ );
    var un = RegExp.$1;
    
    text.match( /flashvars\.k1 = "(.*?)";/ );
    var key1 = RegExp.$1;
    
    text.match( /flashvars\.k2 = "(.*?)";/ );
    var key2 = RegExp.$1;
    
    text.match( /flashvars\.s = "(.*?)";/ );
    var server = RegExp.$1;
    
    var realUrl = "http://www" + server + ".megavideo.com/files/" + decrypt( un, key1, key2 ) + "/";
    
    return { videoTitle0: title, videoUrl0: realUrl };
}
