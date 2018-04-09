'use strict';

window.i = 0 //计数器

var inputBox = function(option){
  var group = $("<div></div>").addClass("input-group")
  var input = $("<input></input>")
    .attr("placeholder", "输入网址")
    .attr("type", "text")
    .addClass("form-control")
    .attr("value", "https://www.baidu.com")
    .attr("onkeypress", "if(event.keyCode===13){change(" + option.id +")}")
  var holder = $("<div></div>")
    .addClass("input-group-append")
  var button = $("<button></button>")
    .attr("type", "button")
    .addClass("btn btn-outline-secondary")
    .text("GO")
    .attr("onclick", "change("+option.id+")")

  group.append(input).append(holder.append(button))
  return group
}



var iframe = function(option){
  var iframe = $("<iframe></iframe>")
    .attr("height", window.outerHeight)
    .attr("src", (option.src || ""))
  return iframe
}

window.change = function(id){
  var entrance = $("#"+id)
  var url = entrance.find("input[type=text]").val()
  if (entrance){
    var option = {
      src: url
    }
    var inner = iframe(option)
    $(entrance).html('').append(inner)
  }
}

function dragin (event){
  $('body').css('cursor', "w-resize")
  //开始拖拽 因为目前只有2个框体切拖动图标在右侧 所以只要改变右侧框体的clsss col-? 即可
  //给鼠标在body上移动时添加动作
  var x = event.pageX
  //改变的是右侧框体col-n 且范围在[2..10]之间
  var col = 12 - Math.round(x/$('body').width()*12)
  if(col>1 && col<11){
    //拿到现存col-n 再算新的col-n 如果不一样就替换
    var rightScr = $('.scr')[1]
    var oldCol = rightScr.className.match(/col(-\d+)?/)[0]
    var newCol = "col-"+col
    if(oldCol != newCol){
      $(rightScr).removeClass(oldCol).addClass(newCol)
    }
  }
}




$(document).ready(function () {
  $(".entrance").each(function(index, element){
    window.i+=1
    var id = window.i
    $(this)
      .attr("id", id)
      .html(inputBox({id: id}))
  })

  // 拖拽窗体
  $(".scr").each(function(index, element){
    if(index>0){
      var drager = $(element).find(".drager")
      drager.mousedown(function(event){
        $('body').on('mousemove', drager, dragin)
      })

      //移除监听
      $('body').mouseleave(function (){
        $('body').css('cursor', "default")
        $("body").off('mousemove',dragin)
      })
      $('body').mouseup(function () {
        $('body').css('cursor', "default")
        $("body").off('mousemove', dragin)        
      })

    }
  })


  $("iframe").each(function () {
    this.height = window.outerHeight
  })

  //屏幕右上角显示鼠标相对于#app坐标
  $("#app").mousemove(function(event){
    var x = event.pageX
    var y = event.pageY
    var per = Math.round(x/$("body").width()*12)
    $("#pointer").text(`X:${x}, Y:${y}, per:${per} `)
  })
  

  
})