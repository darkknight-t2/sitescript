// ==SiteScript==
// @siteName    6.cn
// @siteUrl     http://6.cn/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 
// @date        2008/09/10
// @version     0.7
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


function getKey() {
    var date = new Date();
    var time = date.getTime() / 1000;
    var key3 = 1000000000 + Math.floor( Math.random() * 1000000000 );
    var key4 = 1000000000 + Math.floor( Math.random() * 1000000000 );
    var key1, key2;
    var rnd = Math.floor( Math.random() * 100 );
    
    if ( rnd > 50 ) {
        key1 = Math.abs( Math.floor( time / 3 ) ^ key3 );
        key2 = Math.abs( Math.floor( time * 2 / 3 ) ^ key4 );
    }
    else {
        key1 = Math.abs( Math.floor( time * 2 / 3 ) ^ key3 );
        key2 = Math.abs( Math.floor( time / 3 ) ^ key4 );
    }
    
    var keys = new Array();
    keys[ 0 ] = key1;
    keys[ 1 ] = key2;
    keys[ 2 ] = key3;
    keys[ 3 ] = key4;
    
    return keys;
}


function isSiteUrl( url ) {
    if ( url.match( /http:\/\/6\.cn\/watch\/\d+\.html/ ) ) {
        return true;
    }
    else if ( url.match( /http:\/\/6\.cn\/plist\/\d+\/\d+\.html/ ) ) {
        return true;
    }
    else if ( url.match( /http:\/\/6\.cn\/plist\/\d+/ ) ) {
        return true;
    }
}


function getVideoDetail( url ) {
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( url );
    
    if ( text == null ) {
        return null;
    }
    
    var xmlUrl;
    
    if ( url.match( /http:\/\/6\.cn\/watch\/\d+\.html/ ) ) {
        text.match( /pageMessage.evid = '(.*)'/ );
        xmlUrl = "http://6.cn/v72.php?vid=" + RegExp.$1;
    }
    else if ( url.match( /http:\/\/6\.cn\/plist\/(\d+)\/(\d+)\.html/ ) ) {
        xmlUrl = "http://6.cn/v72.php?p=" + RegExp.$1 + "&k=" + RegExp.$2;
    }
    else if ( url.match( /http:\/\/6\.cn\/plist\/(\d+)/ ) ) {
        xmlUrl = "http://6.cn/v72.php?p=" + RegExp.$1 + "&k=0";
    }
    else {
        return null;
    }
    
    text = craving.getResponseText( xmlUrl );
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /<title>(.*)<\/title>/ );
    var title = RegExp.$1;
    
    text.match( /<file_xml>(.*)<\/file_xml>/ );
    var fileXml = RegExp.$1;
    
    text = craving.getResponseText( fileXml );
    
    if ( text == null ) {
        return null;
    }
    
    var keys = getKey();
    text.match( /<file>(.*)<\/file>/g );
    var realUrl = RegExp.$1;
    realUrl += "?key1=" + keys[ 0 ] + "&key2=" + keys[ 1 ] + "&key3=" + keys[ 2 ] + "&key4=" + keys[ 3 ];
    
    return { videoTitle0: title, videoUrl0: realUrl };
}
