// ==SiteScript==
// @siteName    ClipLife
// @siteUrl     http://cliplife.jp/
// @author      DarkKnight
// @authorUrl   http://darkknightlabs.com/
// @scriptUrl   http://darkknightlabs.com/site-script/
// @description 
// @date        2008/09/15
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
    
    random: function( limit ) {
        return Math.floor( Math.random() * limit );
    }
}


function MD5() {
    this._initialize();
}


MD5.prototype = {
    _MD5_T: null,
    _MD5_round1: null,
    _MD5_round2: null,
    _MD5_round3: null,
    _MD5_round4: null,
    _MD5_round: null,
    
    _initialize: function() {
        
        _MD5_T = new Array( 0x00000000, 0xd76aa478, 0xe8c7b756, 0x242070db,
                            0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613,
                            0xfd469501, 0x698098d8, 0x8b44f7af, 0xffff5bb1,
                            0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e,
                            0x49b40821, 0xf61e2562, 0xc040b340, 0x265e5a51,
                            0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681,
                            0xe7d3fbc8, 0x21e1cde6, 0xc33707d6, 0xf4d50d87,
                            0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9,
                            0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122,
                            0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60,
                            0xbebfbc70, 0x289b7ec6, 0xeaa127fa, 0xd4ef3085,
                            0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8,
                            0xc4ac5665, 0xf4292244, 0x432aff97, 0xab9423a7,
                            0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d,
                            0x85845dd1, 0x6fa87e4f, 0xfe2ce6e0, 0xa3014314,
                            0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb,
                            0xeb86d391
                          );
                          
        _MD5_round1 = new Array( new Array(  0,  7,  1 ), new Array(  1, 12,  2 ),
                                 new Array(  2, 17,  3 ), new Array(  3, 22,  4 ),
                                 new Array(  4,  7,  5 ), new Array(  5, 12,  6 ),
                                 new Array(  6, 17,  7 ), new Array(  7, 22,  8 ),
                                 new Array(  8,  7,  9 ), new Array(  9, 12, 10 ),
                                 new Array( 10, 17, 11 ), new Array( 11, 22, 12 ),
                                 new Array( 12,  7, 13 ), new Array( 13, 12, 14 ),
                                 new Array( 14, 17, 15 ), new Array( 15, 22, 16 )
                               );
                               
        _MD5_round2 = new Array( new Array(  1,  5, 17 ), new Array(  6,  9, 18 ),
                                 new Array( 11, 14, 19 ), new Array(  0, 20, 20 ),
                                 new Array(  5,  5, 21 ), new Array( 10,  9, 22 ),
                                 new Array( 15, 14, 23 ), new Array(  4, 20, 24 ),
                                 new Array(  9,  5, 25 ), new Array( 14,  9, 26 ),
                                 new Array(  3, 14, 27 ), new Array(  8, 20, 28 ),
                                 new Array( 13,  5, 29 ), new Array(  2,  9, 30 ),
                                 new Array(  7, 14, 31 ), new Array( 12, 20, 32 )
                               );
                               
        _MD5_round3 = new Array( new Array(  5,  4, 33 ), new Array(  8, 11, 34 ),
                                 new Array( 11, 16, 35 ), new Array( 14, 23, 36 ),
                                 new Array(  1,  4, 37 ), new Array(  4, 11, 38 ),
                                 new Array(  7, 16, 39 ), new Array( 10, 23, 40 ),
                                 new Array( 13,  4, 41 ), new Array(  0, 11, 42 ),
                                 new Array(  3, 16, 43 ), new Array(  6, 23, 44 ),
                                 new Array(  9,  4, 45 ), new Array( 12, 11, 46 ),
                                 new Array( 15, 16, 47 ), new Array(  2, 23, 48 )
                               );
                               
        _MD5_round4 = new Array( new Array(  0,  6, 49 ), new Array(  7, 10, 50 ),
                                 new Array( 14, 15, 51 ), new Array(  5, 21, 52 ),
                                 new Array( 12,  6, 53 ), new Array(  3, 10, 54 ),
                                 new Array( 10, 15, 55 ), new Array(  1, 21, 56 ),
                                 new Array(  8,  6, 57 ), new Array( 15, 10, 58 ),
                                 new Array(  6, 15, 59 ), new Array( 13, 21, 60 ),
                                 new Array(  4,  6, 61 ), new Array( 11, 10, 62 ),
                                 new Array(  2, 15, 63 ), new Array(  9, 21, 64 )
                               );
                               
        _MD5_round = new Array( new Array( this._MD5_F, _MD5_round1 ),
                                new Array( this._MD5_G, _MD5_round2 ),
                                new Array( this._MD5_H, _MD5_round3 ),
                                new Array( this._MD5_I, _MD5_round4 )
                               );
                               
    },
    
    _MD5_F: function( x, y, z ) { return (x & y) | (~x & z); },
    
    _MD5_G: function( x, y, z ) { return (x & z) | (y & ~z); },
    
    _MD5_H: function( x, y, z ) { return x ^ y ^ z;          },
    
    _MD5_I: function( x, y, z ) { return y ^ (x | ~z);       },
    
    _MD5_pack: function ( n32 ) {
        return String.fromCharCode(   n32          & 0xff ) +
               String.fromCharCode( ( n32 >>> 8  ) & 0xff ) +
               String.fromCharCode( ( n32 >>> 16 ) & 0xff ) +
               String.fromCharCode( ( n32 >>> 24 ) & 0xff );
    },
    
    _MD5_unpack: function( s4 ) {
        return  s4.charCodeAt( 0 )         |
              ( s4.charCodeAt( 1 ) <<  8 ) |
              ( s4.charCodeAt( 2 ) << 16 ) |
              ( s4.charCodeAt( 3 ) << 24 );
    },
    
    _MD5_number: function( n ) {
        while ( n < 0 ) {
            n += 4294967296;
        }
        
        while ( n > 4294967295 ) {
            n -= 4294967296;
        }
        
        return n;
    },
    
    _MD5_apply_round: function( x, s, f, abcd, r ) {
        var a, b, c, d;
        var kk, ss, ii;
        var t, u;
        
        a = abcd[ 0 ];
        b = abcd[ 1 ];
        c = abcd[ 2 ];
        d = abcd[ 3 ];
        kk = r[ 0 ];
        ss = r[ 1 ];
        ii = r[ 2 ];
        
        u = f( s[ b ], s[ c ], s[ d ] );
        t = s[ a ] + u + x[ kk ] + _MD5_T[ ii ];
        t = this._MD5_number( t );
        t = ( ( t << ss ) | ( t >>> ( 32 - ss ) ) );
        t += s[ b ];
        s[ a ] = this._MD5_number( t );
    },
    
    _MD5_hash: function( data ) {
        var abcd, x, state, s;
        var len, index, padLen, f, r;
        var i, j, k;
        var tmp;
        
        state = new Array( 0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476 );
        len = data.length;
        index = len & 0x3f;
        padLen = ( index < 56 ) ? ( 56 - index ) : ( 120 - index );
        
        if ( padLen > 0 ) {
            data += "\x80";
            for ( i = 0; i < padLen - 1; i++) {
                data += "\x00";
            }
        }
        
        data += this._MD5_pack( len * 8 );
        data += this._MD5_pack( 0 );
        len  += padLen + 8;
        abcd = new Array( 0, 1, 2, 3 );
        x    = new Array( 16 );
        s    = new Array( 4 );
        
        for ( k = 0; k < len; k += 64 ) {
            for( i = 0, j = k; i < 16; i++, j += 4 ) {
                x[ i ] = data.charCodeAt( j     )         |
                       ( data.charCodeAt( j + 1 ) <<  8 ) |
                       ( data.charCodeAt( j + 2 ) << 16 ) |
                       ( data.charCodeAt( j + 3 ) << 24 );
            }
            
            for ( i = 0; i < 4; i++ ) {
                s[ i ] = state[ i ];
            }
            
            for ( i = 0; i < 4; i++ ) {
                f = _MD5_round[ i ][ 0 ];
                r = _MD5_round[ i ][ 1 ];
                
                for ( j = 0; j < 16; j++ ) {
                    this._MD5_apply_round( x, s, f, abcd, r[ j ] );
                    tmp = abcd[ 0 ];
                    abcd[ 0 ] = abcd[ 3 ];
                    abcd[ 3 ] = abcd[ 2 ];
                    abcd[ 2 ] = abcd[ 1 ];
                    abcd[ 1 ] = tmp;
                }
            }
            
            for ( i = 0; i < 4; i++ ) {
                state[ i ] += s[ i ];
                state[ i ] = this._MD5_number( state[ i ] );
            }
        }
        
        return this._MD5_pack( state[ 0 ] ) +
               this._MD5_pack( state[ 1 ] ) +
               this._MD5_pack( state[ 2 ] ) +
               this._MD5_pack( state[ 3 ] );
    },
    
    getHash: function ( data ) {
        var result = "";
        var bit128 = this._MD5_hash(data);
        
        for ( var i = 0; i < 16; i++ ) {
            var c = bit128.charCodeAt( i );
            result += "0123456789abcdef".charAt( ( c >> 4 ) & 0xf );
            result += "0123456789abcdef".charAt( c & 0xf );
        }
        
        return result;
    }
}


function isSiteUrl( url ) {
    if ( url.match( /http:\/\/cliplife\.jp\/clip\/\?content_id=.*/ ) ) {
        return true;
    }
}


function getVideoDetail( url ) {
    var craving = new CravingSiteScript();
    var text = craving.getResponseText( url );
    
    if ( text == null ) {
        return null;
    }
    
    text.match( /<title>(.*)<\/title>/ );
    var title = RegExp.$1;
    title = title.replace( "ClipLife | ", "" );
    
    text.match( /var content_id = '(.*)'/ );
    var content_id = RegExp.$1;
    
    text.match( /var main_server = '(.*)'/ );
    var main_server = RegExp.$1;
    
    text.match( /var stream_server = '(.*)'/ );
    var stream_server = RegExp.$1;
    
    var md5 = new MD5();
    var countPass = md5.getHash( content_id.concat( "internal", "mtrtjkgrshbsgwr7symmkmtnkmrnknsh" ) );
    
    var realUrl = "http://" + stream_server +
                  "/getclip/?content_id=" + content_id + 
                  "&referer=internal&password=" + countPass +
                  "&file=cliplife.flv";
    
    return { videoTitle0: title, videoUrl0: realUrl };
}
