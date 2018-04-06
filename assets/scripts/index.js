'use strict';

window.i = 0 //计数器

var inputBox = function(){
  window.i += 1
  var id = window.i

  var group = $("<div></div>").addClass("input-group")
  var input = $("<input></input>")
    .attr("placeholder", "输入网址")
    .attr("type", "text")
    .addClass("form-control")
    .attr("value", "")
    .attr("id", id)
  var holder = $("<div></div>")
    .addClass("input-group-append")
  var button = $("<button></button>")
    .attr("type", "button")
    .addClass("btn btn-outline-secondary")
    .text("GO")
    .attr("onclick", "getIn.call(this, $('#"+id+"').val())")

 group.append(input).append(holder.append(button))
  return group  
}


var iframe = function(option){
  var iframe = $("<iframe></iframe>")
    .attr("height", window.outerHeight)
    .attr("src", (option.src || ""))
  return iframe
}

window.getIn = function(url){
  var entrance = $(this).parents('.entrance')[0]
  if (entrance){
    var option = {
      src: url
    }
    $(entrance).html('').append(iframe(option))
  }
}


$(document).ready(function () {
  $(".entrance").each(function(){
    $(this).html(inputBox)
  })


  $("iframe").each(function () {
    this.height = window.outerHeight
  })
})