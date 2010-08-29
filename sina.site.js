// ==SiteScript==
// @siteName    sina(新浪网)
// @siteUrl     http://v.sina.com.cn/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 
// @date        2008/10/01
// @version     0.3
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


function isSiteUrl( url ) {
    if ( url.match( /http:\/\/you\.video\.sina\.com\.cn\/b\/\d+-\d+\.html/ ) ) {
        return true;
    }
}


function getVideoDetail( url ) {
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( url );
    
    if ( text == null ) {
        return null;
    }
    
    url.match( /http:\/\/you\.video\.sina\.com\.cn\/b\/(\d+)-\d+\.html/ );
    var vid = RegExp.$1;
    
    text.match( /_S_PID_="(\d+)"/ );
    var pid = RegExp.$1;
    
    var tid = null;
    if ( url.indexOf( "http://you.video.sina.com.cn/" ) != -1 ) {
        if ( url.indexOf( "/b/" ) == -1 ) {
            tid = "3";
        }
        else {
            tid = "2";
        }
    }
    
    var xmlUrl = "http://v.iask.com/v_play.php?vid=" + vid;
    xmlUrl += "&pid=" + pid;
    xmlUrl += "&tid=" + tid;
    xmlUrl += "&plid=2001";
    xmlUrl += "&ran=" + Math.random();
    
    text = craving.getResponseText( xmlUrl );
    
    if ( text == null ) {
        return null;
    }
    
    if ( text.match( /<order>2<\/order>/ ) == null ) {
        text.match( /<vname><!\[CDATA\[(.*?)\]\]><\/vname>/ );
        var title = RegExp.$1;
        
        text.match( /<url><!\[CDATA\[(.*?)\]\]><\/url>/ );
        var realUrl = RegExp.$1;
        
        return { videoTitle0: title, videoUrl0: realUrl };
    }
    else {
        text.match( /<order>(\d+)<\/order>/g );
        var count = RegExp.$1;
        
        text.match( /<vname><!\[CDATA\[(.*?)\]\]><\/vname>/ );
        var title = RegExp.$1;
        var realUrl = text.match( /<url><!\[CDATA\[(.*?)\]\]><\/url>/g );
        
        var ret = {};
        for ( var i = 0; i < count; i++ ) {
            var num = i + 1;
            ret[ "videoTitle" + i ] = title + num;
            realUrl[ i ].match( /<url><!\[CDATA\[(.*?)\]\]><\/url>/ );
            ret[ "videoUrl"   + i ] = RegExp.$1;
        }
        
        return ret;
    }
}
