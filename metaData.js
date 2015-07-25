function addMetaData(uri){
    var metaData = makeTextBlock("cv","0.1")+
                   makeTextBlock("name", $(".card .name").text())+
                   makeTextBlock("attrs", $(".attrs").val() )+
                   makeTextBlock("effect", $(".effect").text() )+
                   makeTextBlock("flavour", $(".flavour").text() )+
                   makeTextBlock("copyright", $(".copyright").val() )+
                   makeTextBlock("classes", $(".card").attr("class") ),
        endData = atob(uri.substr(-20)),
        keepData = endData.substr(0,endData.length-12),
        newB64 = btoa( keepData+metaData+makeIendBlock() )
    return uri.substr(0,uri.length-20)+newB64;
}

function makeTrailingBlock(){
    return makeMetaData()+makeIendBlock();
}

var crcTable={};
function crcByte(n){
    if (crcTable[n] === undefined){
        var c=n;
        for (var k=0;k<8;k++){
            if (c&1){
                c = 0xedb88320 ^ ((c >> 1)&0x7fffffff);
            } else {
                c = ((c >> 1)&0x7fffffff);
            }
        }
        crcTable[n]=c;
    }
    return crcTable[n]
}

function makeCRC(data){
    var crc = 0xffffffff;
    for(var i=0;i<data.length;i++){
        crc = crcByte((crc ^ data.charCodeAt(i)) & 0xff) ^ ((crc>>8)&0xffffff);
    }
    crc = crc ^ 0xffffffff;
    return packInt(crc);
}

function utf8Encode(s){
    return unescape(encodeURIComponent(s));
}

function packInt(s){
    var p1=(s>>24)&0xff,
        p2=(s>>16)&0xff,
        p3=(s>>8)&0xff,
        p4=s&0xff;
    return String.fromCharCode(p1,p2,p3,p4);
}

function makeTextBlock(key,payload){
    var data = "tEXt"+utf8Encode(key)+"\0"+utf8Encode(payload);
    var lenS = packInt(data.length-4);
    return lenS+data+makeCRC(data);
}

function makeIendBlock(){
    var data = "IEND";
    var lenS = packInt(data.length-4);
    return lenS+data+makeCRC(data);
}
