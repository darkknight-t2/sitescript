// ==SiteScript==
// @siteName    Innolife.tv
// @siteUrl     http://www.innolife.tv/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 
// @date        2010/09/04
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
    
    getResponseBody: function() {
        if ( this._xhr ) {
            return this._xhr.responseBody;
        }
        else {
            return null;
        }
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
    
    getLocation: function( url ) {
        var location = null;
        try {
            var winHttp = new ActiveXObject( "WinHttp.WinHttpRequest.5.1" );
            var WinHttpRequestOption_EnableRedirects = 6;
            
            winHttp.option( WinHttpRequestOption_EnableRedirects ) = false;
            winHttp.open( "GET", url, false );
            winHttp.send();
            
            location = winHttp.getResponseHeader( "Location" );
        }
        catch( e ) {
            return null;
        }
        return location;
    }
}

function CharConv() {
    var _initialized = false;
    var _stream = null;
    var _result = "";
    
    this._initialize = function () {
        try {
            this._stream = new ActiveXObject( "ADODB.Stream" );
            this._initialized = true;
        }
        catch ( e ) {}
    }
    this._initialize();
    
    this.isInit = function() {
        return this._initialized;
    }
    
    this.convert = function ( bin, charset ) {
        this._stream.Open();
        try{
            this._stream.Type = 1;
            this._stream.Write( bin );
            
            this._stream.Position = 0;
            this._stream.Type = 2;
            this._stream.Charset = charset; 
            this._result = this._stream.ReadText();
        }
        catch( e ) {
            this._result = "";
        }
        this._stream.Close();
    }
    
    this.getResult = function() {
        return this._result;
    }
}


function isSiteUrl( url ) {
    if (   url.match( /http:\/\/www\.innolife\.tv\/list1\.php/ )
        && url.match( /(\?|&)ac_id=\d+/ )
        && url.match( /(\?|&)ai_id=\d+/ )
    ) {
        return true;
    }
    
    if (   url.match( /http:\/\/www\.innolife\.tv\/tv_qacont\.php/ )
        && url.match( /(\?|&)tbl=tv_board1/ )
        && url.match( /(\?|&)aq_id=\d+/ )
        && url.match( /(\?|&)aq_listnum=\d+/)
    ) {
        return true;
    }
    
    if (   url.match( /http:\/\/contents\.innolife\.net\/listpre\.php/ )
        && url.match( /(\?|&)ac_id=\d+/ )
        && url.match( /(\?|&)ai_id=\d+/ )
    ) {
        return true;
    }
}


function getVideoDetail( url ) {
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( url );
    
    if ( text == null ) {
        return null;
    }
    
    var charConv = new CharConv();
    if ( charConv.isInit() ) {
        charConv.convert( craving.getResponseBody(), "euc-jp" );
        var result = charConv.getResult();
        if ( result != "" ) {
            text = result;
        }
    }
    var title;
    var realUrl;
    
    if (   url.match( /http:\/\/www\.innolife\.tv\/list1\.php/ )
        || url.match( /http:\/\/contents\.innolife\.net\/listpre\.php/ )
    ) {
        if ( !text.match( /<embed [^>]*?src\s*?=\s*?"([^"]+)"/ ) ) {
            return null;
        }
        realUrl = RegExp.$1;
        
        if ( text.match( /<meta name="description" content="([^"]+)"/ ) && charConv.isInit() ) {
            title = RegExp.$1;
        }
        else {
            url.match( /(\?|&)ac_id=(\d+)/ );
            var ac_id = RegExp.$2;
            url.match( /(\?|&)ai_id=(\d+)/ );
            var ai_id = RegExp.$2;
            title = "innolife_" + ac_id + "_" + ai_id;
        }
    }
    else if ( url.match( /http:\/\/www\.innolife\.tv\/tv_qacont\.php/ ) ) {
        if ( !text.match( /<param name='movie' value='([^']+)'/ ) ) {
            return null;
        }
        
        var loaderUrl = RegExp.$1;
        if ( text.match( /<tr class=st_bgc_list>\s*?<td align=center>.*?<\/td>\s*?<td>(.*?)<\/td>/m ) && charConv.isInit() ){
            title = RegExp.$1;
        }
        else {
            url.match( /(\?|&)aq_listnum=(\d+)/ );
            title = "inno_ucc_" + RegExp.$2;
        }
        
        var location = craving.getLocation( loaderUrl );
        if ( !location ) {
            return null;
        }
        
        var param = location.substring( location.indexOf( "?" ) );
        var xmlUrl = "http://v.nate.com/xmovie_url.php" + param;
        
        text = craving.getResponseText( xmlurl );
        if ( text == null ) {
            return null;
        }
        if (   text.match( /<mov_url>(.*?)<\/mov_url>/ )
            || text.match( /<mov_url_alt>(.*?)<\/mov_url_alt>/ )
        ) {
           realUrl = decodeURIComponent( RegExp.$1 );
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
    
    title = title.replace( /&#\d+;/g,
                           function( chars ) { return String.fromCharCode( parseInt( chars.substr( 2 ) ) ); }
                         );
    title = title.replace( /[\\\/:*?"<>|]/g, "_" );
    
    return { videoTitle0: title, videoUrl0: realUrl };
}
