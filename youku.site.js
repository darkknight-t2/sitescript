// ==SiteScript==
// @siteName    youku.com(優酷網)
// @siteUrl     http://www.youku.com/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 一部動画は要プロキシ
// @date        2008/09/22
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
        return str.replace( /&nbsp;/ig, " "  )
                  .replace( /&quot;/ig, "\"" )
                  .replace( /&gt;/ig,   ">"  )
                  .replace( /&lt;/ig,   "<"  )
                  .replace( /&amp;/ig,  "&"  );
    }
}


function Youku( seed ) {
    this._initialize( seed );
}


Youku.prototype = {
    _str: null,
    _seed: null,
    
    _initialize: function( seed ) {
        this._seed = parseInt( seed );
        
        var str = "";
        var key = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890";
        var length = key.length;
        
        for ( var i = 0; i < length; i++ ) {
            var num = parseInt( this._getRan() * key.length );
            str = str + key.charAt( num );
            key = key.split( key.charAt( num ) ).join( '' );
        }
        
        this._str = str;
    },
    
    _getRan: function() {
        this._seed = ( this._seed * 211 + 30031 ) % 65536;
        return this._seed / 65536;
    },
    
    getFileId: function( fileId ) {
        var str = this._str;
        var id = fileId.split( '*' );
        var result = "";
        
        for ( var i = 0; i < id.length - 1; i++ ) {
            result += str.charAt( Number( id[ i ] ) );
        }
        
        return result;
    }
}


function isSiteUrl( url ) {
    if ( url.match( /^http:\/\/v\.youku\.com\/(v_show\/id_.+=|v_playlist\/.*)\.html/ ) ) {
        return true;
    }
}


function getVideoDetail( url ) {
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( url );
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /fo\.addVariable\("VideoIDS",(\d+)\)/ );
    var videoIDS = RegExp.$1;
    var ran = craving.random( 10000 );
    var videoidURL;
    
    if ( url.match( /^http:\/\/v\.youku\.com\/v_show\/id_.+=\.html/ ) != null ) {
        videoidURL = "http://v.youku.com/player/getPlayList/VideoIDS/" + videoIDS + "/version/5/source/video/password/?ran=" + ran + "&n=3";
    }
    else {
        text.match( /fo\.addVariable\("Type","(.*?)"\)/ );
        var Type = RegExp.$1;
        text.match( /fo\.addVariable\("Fid","(.*?)"\)/ );
        var Fid = RegExp.$1;
        text.match( /fo\.addVariable\("Pt","(.*?)"\)/ );
        var Pt = RegExp.$1;
        text.match( /fo\.addVariable\("Ob","(.*?)"\)/ );
        var Ob = RegExp.$1;
        
        videoidURL = "http://v.youku.com/player/getPlayList/VideoIDS/" + videoIDS + "/version/5/source/video/password/";
        videoidURL += "/Type/" + Type;
        videoidURL += "/Fid/" + Fid;
        videoidURL += "/Pt/" + Pt;
        videoidURL += "/Ob/" + Ob;
        videoidURL += "?ran=" + ran + "&n=3";
    }
    
    var youkuInfo = craving.getResponseJSON( videoidURL );
    
    if ( youkuInfo == null ) {
        return null;
    }
    
    var ReportSID = ( new Date() ).getTime() + '' + ( 1000 + ( new Date() ).getMilliseconds() ) + '' + Math.floor( Math.random() * 9000 + 1000 );
    
    var flvURL = "http://f.youku.com/player/getFlvPath/sid/" + ReportSID + "_00/st/flv/fileid/";
    
    var key1 = ( Number( "0x" + youkuInfo.data[ 0 ].key1 ) ^ Number( "0xa55aa5a5" ) ).toString( 16 );
    var key2 = youkuInfo.data[ 0 ].key2;
    var key = "?K=" + key2 + key1;
    
    var fileId = youkuInfo.data[ 0 ].fileid;
    if ( fileId.split( '*' ).length > 0 ) {
        var youku = new Youku( youkuInfo.data[ 0 ].seed );
        fileId = youku.getFileId( fileId );
    }
    
    var ret = {}
    var fileCount = youkuInfo.data[ 0 ].segs.flv.length;
    
    for ( var i = 0; i < fileCount; i++ ) {
        var left = fileId.slice( 0, 8 );
        var count = i.toString( 16 );
        if ( count.length == 1 ) {
          count = '0' + count;
        }
        count = count.toUpperCase();
        var right = fileId.slice( 10, fileId.length );
        
        var realURL = null;
        var title = youkuInfo.data[ 0 ].title;
        title = title.replace( /\\(u[0-9a-fA-F]{4})/g, "%$1" );
        title = decodeURIComponent( title );
        
        if ( fileCount > 1) {
            var titleNum = i + 1;
            if ( titleNum < 10 ) {
                titleNum = '0' + titleNum;
            }
            
            title = title + '-' + titleNum;
            var fileid = left + count + right;
            realURL = "http://f.youku.com/player/getFlvPath/sid/" + ReportSID + '_' + count + "/st/flv/fileid/" + fileid + key;
        }
        else {
            var fileid = fileId;
            realURL = "http://f.youku.com/player/getFlvPath/sid/" + ReportSID + "_00/st/flv/fileid/" + fileid + key;
        }
        
        ret[ "videoTitle" + i ] = title;
        ret[ "videoUrl"   + i ] = realURL;
    }
    
    return ret;
}
