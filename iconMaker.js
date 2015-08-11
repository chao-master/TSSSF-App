IconMaker = (function(){
    
	var faSheets = Array.prototype.filter.call(document.styleSheets,function(s){
            return s.href == "http://scoots.home/~ripp_/TSSSF-App/css/font-awesome.min.css";
        })[0],
        faRules = Array.prototype.filter.call(faSheets.rules,function(s){
            return s.selectorText !== undefined && s.selectorText.slice(-8) == "::before";
        }),
        iconGrid = $("<div>").addClass("iconGrid"),
        selectedIcons = $("<div>").addClass("selIcons");
    
    function addIcon(){
        $("<div>").addClass("btn-group").append(
            $(this).find("i").clone()
        ).append(
            $("<button>").addClass("btn")
        ).append(
            $("<button>").addClass("btn")
        ).appendTo(selectedIcons);
    }
    
    for(var i=0;i<faRules.length;i++){
        var sp = faRules[i].selectorText.match(/fa-[^:]+/);
        $("<i>").addClass("fa fa-fw").addClass(sp[0]).appendTo(
            $("<button>").addClass("icon btn btn-flat").appendTo(iconGrid).click(addIcon)
        );
    }
    
    $(document).ready(function(){
        $("<div>").addClass("iconPicker").append(selectedIcons).append(iconGrid).appendTo("body");
    })
})()
