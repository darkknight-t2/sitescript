// ==SiteScript==
// @siteName    YourFileHost.com
// @siteUrl     http://www.yourfilehost.com/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 
// @date        2008/09/07
// @version     0.4
// ==/SiteScript==


function CravingSiteScript( uri ) {
    this._initialize( uri );
}


CravingSiteScript.prototype = {
    _uri: null,
    
    _initialize: function( uri ) {
        if ( !uri ) {
            return;
        }
        this._uri = uri;
    },
    
    _getXmlHttpRequest: function() {
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
        
        return xhr;
    },
    
    _load: function() {
        var req = this._getXmlHttpRequest();
        
        req.open( "GET", this._uri, false );
        req.send();
        
        return req.responseText;
    },
    
    getResponseText: function() {
        return this._load();
    },
    
    getResponseJSON: function() {
        var text = this._load();
        
        return eval( "("+text+")" );
    }
}


function isSiteUrl( url ) {
    if ( url.match( /http:\/\/www\.yourfilehost\.com\/media\.php\?cat=video&file=.*/ ) ) {
        return true;
    }
}


function getVideoDetail( url ) {
    var craving = new CravingSiteScript( url );
    var text = craving.getResponseText();
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /Description: (.*)</ );
    var title = RegExp.$1;
    
    text.match( /param name="movie" value="(.*?)"/ );
    var swfUrl = decodeURIComponent( RegExp.$1 );
    
    swfUrl.match( /&video=(.*)&videoembed_id/ );
    var dataUrl = RegExp.$1;
    
    craving = new CravingSiteScript( dataUrl );
    text = craving.getResponseText();
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /video_id=(.*)&homeurl/ );
    var realUrl = decodeURIComponent( RegExp.$1 );
    
    return { videoTitle0: title, videoUrl0: realUrl };
}
