// ==SiteScript==
// @siteName    FREUDBOX
// @siteUrl     http://www.freudbox.com/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 
// @date        2010/09/05
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


function FleudDecrypt() {
    this._arrSBox  = new Array();
    this._arrMyKey = new Array();
    
    this.decrypt = function ( strEnc, strKey ){
        return this._charsToStr( this._calculate( this._hexToChars( strEnc ), this._strToChars( strKey ) ) );
    }
    
    this._charsToStr = function ( arr ){
        var str = "";
        for (var i = 0; i < arr.length; i++){
            str += String.fromCharCode( arr[i] );
        }
        return str;
    }
    
    this._calculate = function ( arrEnc, arrKey ){
        this._initialize( arrKey );
        
        var arrRet = new Array();
        var sd1 = 0;
        var sd2 = 0;
        
        for ( var i = 0; i < arrEnc.length; i++ ) {
            sd1 = ( sd1 + 1 ) % 256;
            sd2 = ( sd2 + this._arrSBox[ sd1 ] ) % 256;
            
            var temp1 = this._arrSBox[ sd1 ];
            this._arrSBox[ sd1 ] = this._arrSBox[ sd2 ];
            this._arrSBox[ sd2 ] = temp1;
            var temp2 = ( this._arrSBox[ sd1 ] + this._arrSBox[ sd2 ] ) % 256;
            var ans = arrEnc[ i ] ^ this._arrSBox[ temp2 ];
            arrRet.push( ans );
        }
        return arrRet;
    }
    
    this._initialize = function ( arr ) {
        for ( var i = 0; i <= 255; i++ ) {
            this._arrMyKey[ i ] = arr[ i % arr.length ];
            this._arrSBox[ i ] = i;
        }
        
        var temp1 = 0; 
        for ( var i = 0; i <= 255; i++ ) {
            temp1 = ( temp1 + this._arrSBox[ i ] + this._arrMyKey[ i ] ) % 256;
            var temp2 = this._arrSBox[ i ];
            this._arrSBox[ i ] = this._arrSBox[ temp1 ];
            this._arrSBox[ temp1 ] = temp2;
        }
        return;
    }
    
    this._hexToChars = function ( str ){
        var arr = new Array();
        var headx;
        if ( str.substr( 0,2 ) == "0x" ) {
            headx = 2;
        }
        else {
            headx = 0;
        }
            
        for ( var i = headx; i < str.length; i+= 2 ) {
            arr.push( parseInt( str.substr( i, 2 ), 16 ) );
        }
        return arr;
    }
    
    this._strToChars = function ( str ){
        var arr = new Array();
        for ( var i = 0; i < str.length; i++ ) {
            arr.push( str.charCodeAt( i ) );
        }
        return arr;
    }
}


function isSiteUrl( url ) {
    if ( url.match( /http:\/\/(www\.)?freudbox\.com\/video_\d+/ ) ) {
        return true;
    }
}


function getVideoDetail( url ) {
    url = url.replace( /http:\/\/freudbox\.com\//, "http://www.freudbox.com/" );
    if ( !url.match( /http:\/\/www\.freudbox\.com\/video_(\d+)/ ) ) {
        return null;
    }
    var videoId = RegExp.$1;
    
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( url );
    
    if ( text == null ) {
        return null;
    }
    
    var title;
    if ( text.match( /<h2>(.*?)<\/h2>/ ) ) {
        title = RegExp.$1;
    }
    else {
        title = "freudbox_" + videoId;
    }
    title = title.replace( /[\\\/:*?"<>|]/g, "_" );
    
    if ( !text.match( /<param name="flashvars" value="file=(.*?)" \/>/ ) ) {
        return null;
    }
    var xmlUrl = RegExp.$1;
    
    text = craving.getResponseText( xmlUrl );
    
    if ( text == null ) {
        return null;
    }
    
    text = ( new FleudDecrypt() ).decrypt( text, "tW5Fs1,ra" );
    
    if ( !text.match( /<location>(.*?)<\/location>/ ) ) {
        return null;
    }
    var realUrl = RegExp.$1;
    
    return { videoTitle0: title, videoUrl0: realUrl };
}
