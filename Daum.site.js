// ==SiteScript==
// @siteName    Daum
// @siteUrl     http://tvpot.daum.net/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 
// @date        2008/09/22
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
        return str.replace( /&nbsp;/ig, " "  )
                  .replace( /&quot;/ig, "\"" )
                  .replace( /&gt;/ig,   ">"  )
                  .replace( /&lt;/ig,   "<"  )
                  .replace( /&amp;/ig,  "&"  );
    }
}


function isSiteUrl( url ) {
    if ( url.match( /http:\/\/tvpot\.daum\.net\/clip\/ClipView\.do\?.*clipid=\d+/ ) ) {
        return true;
    }
    else if ( url.match( /http:\/\/tvpot\.daum\.net\/.*\/.*\.do\?.*/ ) ) {
        return true;
    }
    else if ( url.match( /http:\/\/tvpot\.daum\.net\/.*\/\d+\?.*/ ) ) {
        return true;
    }
}


function getVideoDetail( url ) {
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( url );
    
    if ( text == null ) {
        return null;
    }
    
    var title;
    if ( text.match( /<h3 class="vod_title" title="(.*?)">/ ) != null ) {
        title = RegExp.$1;
    }
    else if ( text.match( /<h3 title=".*">(.*?)<\/h3>/ ) != null ) {
        title = RegExp.$1;
    }
    else {
        return null;
    }
    
    text.match( /clipReferLoader\.show\(e, '(.*?)',/ );
    var videoId = RegExp.$1;
    
    var xmlUrl = "http://flvs.daum.net/viewer/MovieLocation.do?vid=" + videoId;
    
    text = craving.getResponseText( xmlUrl );
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /<MovieLocation url="(.*?)"\/>/ );
    xmlUrl = craving.decodeHtml( RegExp.$1 );
    
    text = craving.getResponseText( xmlUrl );
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /<MovieLocation movieURL="(.*?)" \/>/ );
    var realUrl = RegExp.$1;
    
    return { videoTitle0: title, videoUrl0: realUrl };
}
