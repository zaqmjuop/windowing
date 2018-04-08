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
    $(entrance).html('').append(iframe(option))
  }
}


$(document).ready(function () {
  $(".entrance").each(function(){
    window.i+=1
    var id = window.i
    $(this).attr("id", id).html(inputBox({id: id}))
  })


  $("iframe").each(function () {
    this.height = window.outerHeight
  })

})