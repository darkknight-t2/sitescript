// ==SiteScript==
// @siteName    I'm Vlog
// @siteUrl     http://www.im.tv/vlog/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 
// @date        2008/09/11
// @version     0.6
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
    
    _load: function( url ) {
        var req = this._getXmlHttpRequest();
        
        req.open( "GET", url, false );
        req.send();
        
        return req.responseText;
    },
    
    getResponseText: function( url ) {
        return this._load( url );
    },
    
    getResponseTextPost: function( url, data ) {
        var req = this._getXmlHttpRequest();
        
        req.open( "POST", url, false );
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.send( data );
        
        return req.responseText;
    },
    
    getResponseJSON: function( url ) {
        var text = this._load( url );
        
        return eval( "("+text+")" );
    },
    
    random: function( limit ) {
        return Math.floor( Math.random() * limit );
    }
}


function isSiteUrl( url ) {
    if ( url.match( /http:\/\/.*\.im\.tv\/vlog\/personal.*/i ) ) {
        return true;
    }
    else if ( url.match( /http:\/\/.*\.im\.tv\/fullscreen\.htm\?id=\d+/i ) ) {
        return true
    }
}


function getVideoDetail( url ) {
    if ( url.match( /http:\/\/(.*?)\.im\.tv\/fullscreen\.htm\?id=(\d+)/i ) ) {
        if ( RegExp.$1 == "jpmyvlog" ) {
            url = "http://jp.im.tv/vlog/personal.asp?memid=&fid=" + RegExp.$2;
        }
        else if ( RegExp.$1 == "myvlog" ) {
            url = "http://im.tv/vlog/personal.asp?memid=&fid=" + RegExp.$2;
        }
    }
    
    var craving = new CravingSiteScript();
    var text = craving.getResponseTextPost( url );
    
    if ( text == null ) {
        return null;
    }
    
    var title;
    var id;
    var baseUrl;
    
    if ( url.match( /http:\/\/uk\.im\.tv\/vlog\/personal\.asp\?memid=\d+/i ) != null ) {
        text.match( /<input type="hidden" name="FID" value="(\d+)">/ );
        id = RegExp.$1;
        
        text.match( /<td width="40" class="txtb">Topic：<\/td>\r\n\s*<td class="txtb">(.*?)<\/td>/ );
        title = RegExp.$1;
        baseUrl = "http://ukmyvlog.im.tv/"
    }
    else {
        if ( url.match( /http:\/\/(jp|hk)\.im\.tv\/vlog\/personal\.asp\?memid=(\d+)?&fid=(\d+)/i ) != null ) {
            baseUrl = "http://" + RegExp.$1 + "myvlog.im.tv/";
            id = RegExp.$3
            
            text.match( /<a href="Javascript:void\(0\);"  class="title2">(.*?)<\/a>/ );
            title = RegExp.$1;
        }
        else {
            if (   url.match( /http:\/\/im\.tv\/vlog\/personal\.asp\?memid=&fid=(\d+)/i ) != null
                || url.match( /http:\/\/.*\.im\.tv\/vlog\/personal\/\d+\/(\d+)/i        ) != null
                || url.match( /http:\/\/.*\.im\.tv\/vlog\/personal\.asp\?FID=(\d+)/i    ) != null
            ) {
                id = RegExp.$1;
                
                text.match( /<span class="title2">(.*?)<\/span>/ );
                title = RegExp.$1;
            }
            else {
                return null;
            }
            
            var siteUrl = "http://www.im.tv/vlog/vlog_player_process.asp"
            
            text = craving.getResponseTextPost( siteUrl, "cfm=status&id=" + id );
            
            if ( text == null ) {
               return null;
            }
            
            text.match( /site=(.*?)&/ );
            baseUrl = "http://" + RegExp.$1 + ".im.tv/";
        }
    }
    
    var keyUrl = baseUrl + "getkey/getkey.aspx";
    text = craving.getResponseTextPost( keyUrl, "pwd=q1w2e3r4&id=vlog" );
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /key=(.*)&ip=(.*)/ );
    var key = RegExp.$1;
    var ip = RegExp.$2;
    var arrIp = ip.split( '.', 4 );
    
    var realUrl = baseUrl + "flv/" + arrIp[ 0 ].charAt( 0 )
                                   + arrIp[ 2 ].charAt( 0 )
                                   + id.charAt( 0 ) + key
                                   + arrIp[ 3 ].charAt( 0 )
                                   + id.charAt( 1 )
                                   + arrIp[ 1 ].charAt( 0 )
                                   + id.substring( 2 ) + ".flv";
    
    return { videoTitle0: title, videoUrl0: realUrl };
}
