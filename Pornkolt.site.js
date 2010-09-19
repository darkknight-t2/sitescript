// ==SiteScript==
// @siteName    Pornkolt
// @siteUrl     http://www.pornkolt.com/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 
// @date        2010/09/18
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
    
    getXHR: function() {
        return this._getXmlHttpRequest();
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


function getSendData( objBny, strNum ){
    var arrSend1 = [
        0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x13,
        0x67, 0x65, 0x74, 0x56, 0x69, 0x65, 0x77, 0x65, 
        0x72, 0x50, 0x61, 0x72, 0x61, 0x6D, 0x73, 0x2E,
        0x67, 0x65, 0x74, 0x00, 0x02, 0x2F, 0x31, 0x00, 
        0x00, 0x00, 0x14, 0x0A, 0x00, 0x00, 0x00, 0x03,
        0x02, 0x00, 0x06
    ];
    var arrSend2 = [
        0x02, 0x00, 0x00, 0x02, 0x00, 0x00
    ];
    
    var objStream = new ActiveXObject( "ADODB.Stream" );
    objStream.Open();
    objStream.Position = 0;
    objStream.type = 1;
    
    for ( var i = 0; i < arrSend1.length; i++ ) {
        objStream.Write( objBny.fromByteCode( arrSend1[ i ] ) );
    }
    for ( var i = 0; i < strNum.length; i++ ) {
        objStream.Write( objBny.fromByteCode( strNum.charCodeAt( i ) ) );
    }
    for ( var i = 0; i < arrSend2.length; i++ ) {
        objStream.Write( objBny.fromByteCode( arrSend2[ i ] ) );
    }
    
    objStream.Position = 0;
    objBny.senddata = objStream.Read();
    objStream.Close();
} 


function clsGetBinary() {
    this.isOK = false;
    this._objStream = null;
    this._binaryNone;
    
    this._initialize = function () {
        try {
            this._objStream = new ActiveXObject( "ADODB.Stream" );
            this.isOK = true;
        }
        catch( e ) {
            this.isOk = false;
            return false;
        }
        this._objStream.Open();
        this._objStream.type = 1;
        this._binaryNone = this._objStream.Read( 0 );
        this._objStream.Close();
        return true;
    }
    this._initialize();
    
    this.fromByteCode = function ( intByteCode ) {
        if ( !this.isOK ) {
            return this._binaryNone;
        }
        if ( intByteCode < 0 || 255 < intByteCode ) {
            return this._binaryNone;
        }
        this._objStream.Open();
        this._objStream.type = 2;
        this._objStream.Charset = "Unicode";
        this._objStream.WriteText( String.fromCharCode( intByteCode ) );
        this._objStream.Position = 0;
        this._objStream.type = 1;
        this._objStream.Position = 2;
        
        var binary = this._objStream.Read( 1 );
        this._objStream.Close();
        
        return binary;
    }
}


function clsGetByteCode( binarydata ) {
    this._binary = binarydata;
    this.isOK = false;
    this.size = 0;
    this._objSC = null;
    
    this._initialize= function () {
        try {
            this._objSC = new ActiveXObject( "ScriptControl" );
            this.isOK = true;
        }
        catch( e ) {
            this.isOK = falae;
            this.size = 0;
            return false;
        }
        this._objSC.Language = "VBScript";
        this._objSC.AddCode( "Function VB_getSize( bin ) : VB_getSize = LenB( bin ) : End Function" );
        this._objSC.AddCode( "Function VB_getByte( bin, pos ) : VB_getByte = AscB( MidB( bin, pos, 1 ) ) : End Function" );
        this.size = this._objSC.Run( "VB_getSize", this._binary );
        return true;
    }
    this._initialize();
    
    this.byteCodeAt = function ( index ) {
        if ( !this.isOK ) {
            return 0;
        }
        if ( index < 0 || this.size <= index ) {
            return 0;
        }
        return this._objSC.Run( "VB_getByte", this._binary, index + 1 );
    }
    
    this.percentEncode = function (){
        var arr = [];
        for ( var i = 0; i < this.size; i++ ) {
            if ( this.byteCodeAt( i ) <= 15 ) {
                arr.push( "%0" + this.byteCodeAt( i ).toString( 16 ).toUpperCase() );
            }
            else if ( this.byteCodeAt( i ) <= 31 ) {
                arr.push( "%" + this.byteCodeAt( i ).toString( 16 ).toUpperCase() );
            }
            else if ( this.byteCodeAt( i ) <= 127 ) {
                arr.push( String.fromCharCode( this.byteCodeAt( i ) ) );
            }
            else {
                arr.push( "%" + this.byteCodeAt( i ).toString( 16 ).toUpperCase() );
            }
        }
        return arr.join( "" );
    }
}


function isSiteUrl( url ) {
    if ( url.match( /http:\/\/(www\.)?pornkolt\.com\/.*-\d+\.html/ ) ) {
        return true;
    }
}


function getVideoDetail( url ) {
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( url );
    
    if ( text == null ) {
        return null;
    }
    
    if ( !text.match( /so\.addVariable\("id_video","([^"]+)"\)/ ) ) {
        return null;
    }
    var videoid = RegExp.$1;
    
    var objBinary = new clsGetBinary();
    if ( !objBinary.isOK ) {
        return null;
    }
    getSendData( objBinary, videoid );
    
    var amfurl = "http://flashembed.xvideos.com/flashservices/gateway.php";
    craving.getXHR().open( "POST", amfurl, false );
    craving.getXHR().setRequestHeader( "Content-Type", "application/x-amf" );
    craving.getXHR().send( objBinary.senddata );
    
    var objByte = new clsGetByteCode( craving.getResponseBody() );
    if ( !objByte.isOK ) {
        return null;
    }
    var text = objByte.percentEncode();
    
    var title
    if ( text.match( /%00%04name%02(%[0-9A-F]{2}|.)(%[0-9A-F]{2}|.)(.*?)%00/ ) ) {
        title = RegExp.$3;
    }
    else {
        title = "pornkolt_" + videoid;
    }
    title = title.replace( /[\\\/:*?"<>|]/g, "_" );
    
    if ( !text.match( /%00%03url%02(%[0-9A-F]{2}|.)(%[0-9A-F]{2}|.)(.*?)%00/ ) ) {
        return null;
    }
    var realUrl = RegExp.$3;
    
    return { videoTitle0: title, videoUrl0: realUrl };
}
