var GET={};

function parseQuery(){
    var queries;
    queries = document.location.search.substring(1).split("&");
    var parsed = {};
    for(var i=0;i<queries.length;i++){
        var q = queries[i],
            eAt = q.indexOf("=");
        if (eAt == -1){
            parsed[q] = null;
        } else {
            var k = q.substr(0,eAt),
                v = q.substr(eAt+1);
            parsed[k] = v
        }
    }
    return parsed;
}

function updateFields(newGet,supressEvent){
    var oldGet = $.extend({},GET);
    $.extend(GET,newGet);
    var query = $.map(GET,function(v,k){
        if (v){
            return k+"="+v
        } else {
            return
        }
    }).join("&")
    history.pushState({},"",document.location.pathname+"?"+query)
    if (!supressEvent){
        $(document).trigger("state:adjust",[GET,oldGet]);
    }
}

window.onpopstate = function(event){
    var oldGet = $.extend({},GET);
    var get = parseQuery();
    $(document).trigger("state:adjust",[get,oldGet]);
}

$(document).ready(function(){
    var get = parseQuery();
    $(document).trigger("state:adjust",[get,{"first":1}]);
})
