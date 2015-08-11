IconMaker = (function(container){

	var faSheets = Array.prototype.filter.call(document.styleSheets,function(s){
            return s.href == "http://scoots.home/~ripp_/TSSSF-App/css/font-awesome.min.css";
        })[0],
        faRules = Array.prototype.filter.call(faSheets.rules,function(s){
            return s.selectorText !== undefined && s.selectorText.slice(-8) == "::before";
        }),
        iconGrid = $("<div>").addClass("iconGrid"),
        selectedIcons = $("<div>").addClass("selIcons"),
        previewArea = $("<div>").addClass("preview fa-stack fa-3x");

    iconGrid.on("click",".icon",function(){
        var icon = $(this).find("i"),
            faI  = icon.attr("class").match(/fa-(?!fw\b)[^ ]+/)[0]
        icon.clone().addClass("fa-stack-1x").appendTo(previewArea);

        $("<div>").addClass("btn-group").data(
            "faI",faI
        ).append(
            $("<button>").addClass("btn").append(
                icon.clone()
            )
        ).append(
            $("<button>").addClass("btn rotate").append(
                $("<i>").addClass("fa fa-rotate-right")
            )
        ).append(
            $("<button>").addClass("btn size").append(
                $("<i>").addClass("fa fa-search")
            )
        ).append(
            $("<button>").addClass("btn invert").append(
                $("<i>").addClass("fa fa-adjust")
            )
        ).append(
            $("<button>").addClass("btn remove").append(
                $("<i>").addClass("fa fa-times")
            )
        ).appendTo(selectedIcons);
    })

    selectedIcons.on("click",".rotate",function(){
        var icon = previewArea.find("."+$(this).parent().data("faI"));
        if (icon.hasClass("fa-rotate-90")){
            icon.toggleClass("fa-rotate-90 fa-rotate-180");
        } else if (icon.hasClass("fa-rotate-180")){
            icon.toggleClass("fa-rotate-180 fa-rotate-270");
        } else if (icon.hasClass("fa-rotate-270")){
            icon.removeClass("fa-rotate-270");
        } else {
            icon.addClass("fa-rotate-90");
        }
    }).on("click",".size",function(){
        var icon = previewArea.find("."+$(this).parent().data("faI"));
        icon.toggleClass("fa-stack-1x fa-stack-2x");
    }).on("click",".invert",function(){
        var icon = previewArea.find("."+$(this).parent().data("faI"));
        icon.toggleClass("fa-inverse")
    }).on("click",".remove",function(){
        var icon = previewArea.find("."+$(this).parent().data("faI"));
        icon.remove()
        $(this).parent().remove()
    })

    for(var i=0;i<faRules.length;i++){
        var sp = faRules[i].selectorText.match(/fa-[^:]+/);
        $("<button>").addClass("icon btn btn-flat").append(
            $("<i>").addClass("fa fa-fw").addClass(sp[0])
        ).appendTo(iconGrid);
    }

    $(document).ready(function(){
        $("<div>").addClass("iconPicker").append(
            $("<div>").addClass("clearfix").append(previewArea.addClass("pull-left")).append(
                $("<button>").addClass("btn btn-success pull-right").text("OK").click(function(){
                    $(this).closest(".modal").modal("hide");
                })
            )
        )
        .append(selectedIcons)
        .append(iconGrid)
        .appendTo(container);
    })
})($("#iconmaker-dialog .modal-body"))
