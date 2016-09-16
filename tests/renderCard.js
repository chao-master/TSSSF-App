var system = require('system');
var fs = require('fs');
var page = require('webpage').create();
var configLoc;
var config;

if(system.args.length < 3){
  phantomError("usage phantomjs renderCard.js [config] [URL]");
  phantom.exit(1);
} else {
  configLoc = system.args[1];
  config = require("./"+configLoc+".json");
  open(system.args[2]);
}

function saveResult(result){
  if("result" in result){
    fs.write("results/"+configLoc+".png",atob(result.result),"b");
    page.render("results/"+configLoc+"-snap.png");
    phantomMsg("Result saved");
    phantom.exit(0);
  } else {
    phantomError("generate failed",JSON.stringify(result));
    phantom.exit(1);
  }
}

function makeCard(config){
  console.log("Setting card values");
  if ("title" in config){
    document.querySelector(".nameInput").value = config.title;
  }
  if ("type" in config){
    document.querySelector(".type [value="+config.type+"]").click();
  }
  if ("symbols" in config){
    config.symbols.forEach(function(symbol){
      document.querySelector(".symbolSelect [value="+symbol+"]").click();
    });
  }
  if ("keywords" in config){
    document.querySelector(".attrs").value = config.keywords.join(", ");
  }
  if ("body" in config){
    document.querySelector("textarea.effect").value = config.body;
  }
  if ("flavour" in config){
    document.querySelector("textarea.flavour").value = config.flavour;
  }
  if ("copyright" in config){
    document.querySelector(".copyright").value = config.copyright;
  }

  var cg = cardGenerator.generateCard.bind(cardGenerator);
  function doGenerate(){
    cg().then(function(){
      window.callPhantom({result:cardGenerator.canvas.toDataURL().substr("data:image/png;base64,".length)});
    }).catch(function(e){
      console.error(e);
      window.callPhantom({error:1});
    });
  }

  if ("image" in config){
    console.log("Building card with image");
    cardGenerator.generateCard = doGenerate;
    makeImage(config.image);
  } else {
    console.log("Building card without image");
    doGenerate();
  }
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
  page.injectJs("polyfills/es6-promise.min.js");
  page.injectJs("polyfills/es6-arrayfrom.min.js");
}
function open(url){
  page.open(url,function(status){
    if (status !== "success") {
        phantomError("Unable to access network",status);
        phantom.exit(1);
    }

    polyfill(page);
    if(fs.exists(configLoc+"-image.png")){
      config.image = "data:image/png;base64," + btoa(fs.read(configLoc+"-image.png","b"));
    }
    page.evaluate(makeCard,config);
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
