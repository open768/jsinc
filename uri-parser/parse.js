/******************************************
 * https://j11y.io/javascript/parsing-urls-with-the-dom/
 * Usage:
 * var oObj = parseURL('http://abc.com:8080/dir/index.html?id=255&m=hello#top');
 *	oObj.file;     // = 'index.html' 
 *	oObj.hash;     // = 'top '
 *	oObj.host;     // = 'abc.com'
 *	oObj.query;    // = '?id=255&m=hello'
 *	oObj.params;   // = Object = { id: 255, m: hello }
 *	oObj.path;     // = '/dir/index.html'
 *	oObj.segments; // = Array = ['dir', 'index.html']
 *	oObj.port;     // = '8080'
 *	oObj.protocol; // = 'http'
 *	oObj.source;   // = 'http://abc.com:8080/dir/index
*/
function parseURL(url) {
    var a =  document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([\^\/\?\#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([\^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[\^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
}
