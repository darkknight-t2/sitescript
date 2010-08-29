// ==SiteScript==
// @siteName    FC2 “®‰æ
// @siteUrl     http://video.fc2.com/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 
// @date        2010/08/29
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
    
    random: function( limit ) {
        return Math.floor( Math.random() * limit );
    }
}


function isSiteUrl( url ) {
    if ( url.match( /http:\/\/video\.fc2\.com\/(a\/)?content\/([^\/]+\/)*[^\/]+\/?/ ) ) {
        return true;
    }
}


function getVideoDetail( url ) {
    var splitUrl = url.split( "?" )[ 0 ];
    var arrUrl = splitUrl.split( "/" );
    var upid = arrUrl.pop();
    if ( upid == "" ) {
        upid = arrUrl.pop();
    }
    if ( !upid ) {
        return null;
    }
    
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( url );
    
    if ( text == null ) {
        return null;
    }
    
    var title;
    if ( text.match( /<h2 id="video_title">(.*?)<\/h2>/ ) ) {
        title = RegExp.$1;
    }
    else {
        title = "fc2_" + upid;
    }
    title = title.replace( /[\\\/:*?"<>|]/g, "_" );
    
    var dataUrl = "http://video.fc2.com/ginfo.php?upid=" + upid;
    text = craving.getResponseText( dataUrl );
    
    if ( text == null ) {
        return null;
    }
    
    if ( !text.match( /filepath=([^&?]+)/ ) ) {
        return false;
    }
    var realUrl = RegExp.$1;
    
    return { videoTitle0: title, videoUrl0: realUrl };
}
