console.log('User Browser - Content Script ALLL')
const exService = new ExtensionService()
const userId = exService.currentUserId
const providerName = 'udacity'

const sendUpdateToServer = (userId,providerName,progress,URL) => {
  $.ajax({
    url: 'https://9e861c0f488f.ngrok.io/extension/updateProgress/',
    type: 'PUT',
    data: `progress=${progress}&userId=${userId}&providerName=${providerName}&courseURL=${URL}`,
    success: function(data) {
      console.log("SENT")
      console.log(data)
    }
  })
}

const getCurrentURL = () => {
  const currentFullURL = window.location.href
  const learnIndex = currentFullURL.indexOf("/courses")+9
  const shorterURL = currentFullURL.substring(learnIndex)
  console.log(shorterURL)
  //const courseURL = currentFullURL.substring(0,learnIndex)
  //const shorterURL = courseURL.substring(courseIndex)
  return shorterURL
}

const getProgressFromPage = () => {
  let lessonsCount = 0
  let finished = 0
  $("[class^=_progress-bar--completion-amount]").each(function(){
    ++lessonsCount
    console.log($(this).text())
    if($(this).text() === 'Not Started'){

    }else if(parseInt($(this).text()) > 0){
      finished += (parseInt($(this).text())/100)
    }
  })

  let newProgress = $("[class^=deadline-bar--title-]").text()
  let textProgress = parseInt(newProgress)/100
  console.log(newProgress)
  console.log(parseInt(newProgress)/100)
  let avgTotalProgress = finished/lessonsCount
  console.log(avgTotalProgress)
  return textProgress


  

  //     let progressText = $("[class^=progress-popover-content--progress-text]").text()
  //     $("[class^=popover--close-]").click()
  //     let myRegexp = /(\d+ )/g
  //     let match = progressText.match(myRegexp) 
  //     const progress = (parseInt(match[0])/parseInt(match[1])).toFixed(2)
  //     return progress
}

$(document).ready( function(){

    setTimeout( function() {

      const currentProgress = getProgressFromPage()
      const currentURL = getCurrentURL()
      console.log("SENDING")
      sendUpdateToServer(userId,providerName,currentProgress,currentURL)
      
      $('body').on('click', "[class^=next-and-previous--button]", function() {
        const currentProgress = getProgressFromPage()
        const currentURL = getCurrentURL()
        console.log("SENDING")
        sendUpdateToServer(userId,providerName,currentProgress,currentURL)
      })
  }, 3000 )
})




