'use strict'
import isUri from "is-url"

window.i = 0 //计数器

const newPage = (option) => {
  let loadingIcon = $("<i></i>").addClass("fa fa-spinner fa-pulse loading fa-2x") 
  let loading = $("<div></div>").addClass("absolute-center").append(loadingIcon)//加载图标

  let page = $("<iframe></iframe>")
    .attr("src", (option.url || ""))
    .attr("onload", "initIframe(this)")
    .attr("width", "100%")
    .attr("height", "100%")
    .addClass("page")
    .addClass("hide")

  let holder = $("<div></div>").addClass("iframe-holder")

  holder.append(loading).append(page)

  return holder
}

const replaceElement = (oldElement, newElement) => {
  if(!(oldElement && newElement)) {return false}
  let parent = oldElement.parentElement
  if(!parent) {return false}
  $(newElement).insertBefore($(oldElement))
}

const supportIframeHeight = () => {
  resetIframeHeight()
  window.onresize = ()=>{
    resetIframeHeight()
  }
}

window.initIframe = (iframe) => {
  if(!iframe) return false
  let parent = $(iframe).parent()[0]
  $(parent).children().each((index, element)=>{
    if (element.tagName != "IFRAME"){
      parent.removeChild(element)
    }
  })
  $(iframe).removeClass("hide")
  window.resetIframeHeight()
}


window.resetIframeHeight = () => {
  $("iframe").each((index, element) => {
    if (!element) {return }
    let height = $(element).attr("height") || ''
    let perHeight = height.match(/\d+%$/)
    if (!perHeight) {return }
    let per = parseInt(perHeight)
    height = $(element).parent().height() * per / 100
    $(element).css("height", height+"px")
  })
}

const formatURL = (val) => {
  if ((!val) || (typeof val != "string") ) {return false}
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
  if ((!element) || (element.nodeType != 1)) {return false}
  if ((!feedback) || (typeof feedback != "string")) {return false}
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
  if (!(entrance && $(entrance).hasClass("entrance"))) {return false}
  let input = $(entrance).find("input[type=text]")[0]
  if ((!input)  || (!input.value)) {return false} 
  let val = $(input).val()
  let url = validateURL(formatURL(val)) || ("https://www.baidu.com/s?ie=UTF-8&wd=" + val)
  let page = newPage({url})
  $(entrance).html(page)
}


const bindEntranceInput = (entrance) => {
  if (!(entrance && $(entrance).hasClass("entrance"))) {return false}
  let input = $(entrance).find("input[type=text]")[0]
  if (!input) {return }
  $(input).on("keypress", (event) => {
    if (event.keyCode == 13) {
      entrance.submit()
    }
  })
}


const bindEntranceSubmit = (entrance) => {
  if (!(entrance && $(entrance).hasClass("entrance"))) {return false}
  entrance.submit = () => {
    entranceSumit(entrance)
  }

  let button = $(entrance).find("button")[0]
  if (!button) {return }
  //提交按钮
  $(button).on("click", () => { entrance.submit() })
}



const bindEntrance = () => {
  $(".entrance").each((index, entrance)=>{
    if(!entrance) {return }
    window.i+=1
    $(entrance).attr("id", "entrance-"+window.i)
    bindEntranceSubmit(entrance)
    bindEntranceInput(entrance)
  })  
}


$(document).ready(() => {
  if (!document.querySelector) {return false}
  supportIframeHeight()
  bindEntrance()
})

//todo 
// 左右视窗比率调整
// 移动端改为上下分屏
// 输入框快捷方式
// 前进后退 历史记录
// 提供一个输入框随时修改网址
// 把验证单独拿出来


//加载iframe 
//先放一个加载中icon√。 body添加一个iframe display=none onload="show" settimeout每秒检查一次状态 超过10秒不行就提示失败
//因为同源问题 不能删除iframe内的a标签的target
//解决方法
//或者是server render
//或者是jq ajax jsonp get (选择)