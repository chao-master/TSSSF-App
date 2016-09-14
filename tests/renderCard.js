var system = require('system');
var fs = require('fs');
var page = require('webpage').create();
var configLoc;
var config;

if(system.args.length < 3){
  console.log("usage phantomjs renderCard.js [config] [URL]");
} else {
  configLoc = system.args[1];
  config = require("./"+configLoc+".json");
  open(system.args[2]);
}


function saveResult(result){
  fs.write("results/"+configLoc+".html","<img src='"+result+"'/>");
  console.log("result saved");
}
function makeCard(){
  var cg = new CardGenerator(document.querySelector(".card"));
  cg.generateCard().then(function(){
    window.callPhantom(cg.canvas.toDataURL());
  });
}


function onConsoleMessage(msg){
  console.log(msg);
}
function onError(msg,trace){
  console.error(msg,trace);
}
function polyfill(page){
  page.injectJs("es6-promise.min.js");
  page.injectJs("es6-arrayfrom.min.js");
}
function open(url){
  page.open(url,function(status){
    if (status !== "success") {
        console.error("Unable to access network",status);
        phantom.exit(1);
    } else {
      polyfill(page);
      page.evaluate(makeCard);
    }
  });
}

page.onConsoleMessage = onConsoleMessage;
page.onError = onError;
page.onCallback = saveResult;
