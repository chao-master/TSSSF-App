var system = require('system');
var fs = require('fs');
var page = require('webpage').create();
var configLoc;
var config;

if(system.args.length < 3){
  phanomError("usage phantomjs renderCard.js [config] [URL]");
  phatom.exit(1);
} else {
  configLoc = system.args[1];
  config = require("./"+configLoc+".json");
  open(system.args[2]);
}


function saveResult(result){
  fs.write("results/"+configLoc+".html","<img src='"+result+"'/>");
  phantomMsg("Result saved");
  phantom.exit(1);
}
function makeCard(){
  var cg = new CardGenerator(document.querySelector(".card"));
  cg.generateCard().then(function(){
    window.callPhantom(cg.canvas.toDataURL());
  });
}


function onError(msg,trace){
  pageError(msg);
  if(trace && trace.length){
    trace.forEach(function(t){
      pageError("\t",t.file || t.sourceURL,t.line,t.function ? ' (in function ' + t.function +')' : '');
    });
  }
}
function polyfill(page){
  page.injectJs("es6-promise.min.js");
  page.injectJs("es6-arrayfrom.min.js");
}
function open(url){
  page.open(url,function(status){
    if (status !== "success") {
        phantomError("Unable to access network",status);
        phantom.exit(1);
    } else {
      polyfill(page);
      page.evaluate(makeCard);
    }
  });
}

function pageError(){
  console.log("\x1B[33m"+Array.apply(null, arguments).join(" ")+"\x1B[0m");
}
function pageMessage(){
  console.log("\x1B[34m"+Array.apply(null, arguments).join(" ")+"\x1B[0m");
}
function phantomError(){
  console.log("\x1B[31m"+Array.apply(null, arguments).join(" ")+"\x1B[0m");
}
function phantomMsg(){
  console.log("\x1B[39m"+Array.apply(null, arguments).join(" ")+"\x1B[0m");
}

page.onConsoleMessage = pageMessage;
page.onError = onError;
page.onCallback = saveResult;
