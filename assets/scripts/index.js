'use strict';
if(!document.querySelector) return false
import isUri from "is-url"

window.i = 0 //计数器

const newPage = (option) => {
  let page = $("<iframe></iframe>")
    .attr("height", window.outerHeight)
    .attr("src", (option.src || ""))
  return page
}

const replaceElement = (oldElement, newElement) => {
  if(!(oldElement && newElement)) return false
  let parent = oldElement.parentElement
  if(!parent) return false
  $(newElement).insertBefore($(oldElement))
}

const supportIframeHeight = () => {
  resetIframeHeight()
  window.onresize = ()=>{
    resetIframeHeight()
  }
}

window.resetIframeHeight = () => {
  $("iframe").each((index, element) => {
    if (!element) return
    let height = $(element).attr("height") || ''
    let perHeight = height.match(/\d+%$/)
    if (!perHeight) return
    let per = parseInt(perHeight)
    height = $(element).parent().height() * per / 100
    $(element).css("height", height+"px")
  })
}

const formatURL = (val) => {
  if ((!val) || (typeof val != "string") ) return false
  let hasPrefix = val.match(/^http[s]?:[/]{2}/)
  if(!hasPrefix){
    val = "http://" + val
  }
  return val
}


const validateURL = (val) => {
  if (!isUri) throw "isUri 未能成功加载"
  return (isUri(val) ? val : undefined)
}

const sendFeedback = (element, validbool, feedback) => {
  if ((!element) || (element.nodeType != 1)) return false
  if ((!feedback) || (typeof feedback != "string")) return false
  let bool = Boolean(validbool)
  let inputClass = (bool) ? "is-valid" : "is-invalid"
  let feedbackClass = (bool) ? "valid-tooltip" : "invalid-tooltip"
  let place = $(element).parent().find(".feedback")[0]
  if (!place) {
    place = $("<div></div>").addClass("feedback").insertAfter(element)
  }
  $(element).removeClass("is-valid is-invalid").addClass(inputClass)
  $(place).text(feedback).removeClass("valid-tooltip invalid-tooltip").addClass(feedbackClass)
}

const validFeedback = (element, feedback) => {
  sendFeedback(element, true, feedback)
}

const invalidFeedback = (element, feedback) => {
  sendFeedback(element, false, feedback)
}

const entranceSumit = (entrance) => {
  if (!(entrance && $(entrance).hasClass("entrance"))) return false
  let input = $(entrance).find("input[type=text]")[0]
  if (!input) return false 
  let val = $(input).val()
  if (!val) {
    invalidFeedback(input, "请输入网址或搜索关键词")
    return 
  }
  let url = validateURL(formatURL(val)) || ("https://www.baidu.com/s?ie=UTF-8&wd=" + val)

  let page = $("<iframe></iframe>")
    .attr("src", url)
    .attr("onload", "resetIframeHeight()")
    .attr("width", "100%")
    .attr("height", "100%")
    .addClass("page")
  $(entrance).html("").removeClass("entrance").addClass("stage").html(page)
}




const bindEntranceInput = (entrance) => {
  if (!(entrance && $(entrance).hasClass("entrance"))) return false
  let input = $(entrance).find("input[type=text]")[0]
  if (!input) return
  $(input).on("keypress", (event) => {
    if (event.keyCode == 13) {
      entrance.submit()
    }
  })
}


const bindEntranceSubmit = (entrance) => {
  if (!(entrance && $(entrance).hasClass("entrance"))) return false
  entrance.submit = () => {
    entranceSumit(entrance)
  }

  let button = $(entrance).find("button")[0]
  if (!button) return
  //提交按钮
  $(button).on("click", () => { entrance.submit() })
}



const bindEntrance = () => {
  $(".entrance").each((index, entrance)=>{
    if(!entrance) return
    window.i+=1
    $(entrance).attr("id", "entrance-"+window.i)
    bindEntranceSubmit(entrance)
    bindEntranceInput(entrance)
  })  
}



$(document).ready(() => {
  if (!document.querySelector) return false
  supportIframeHeight()
  bindEntrance()
})
