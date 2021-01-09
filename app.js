var searchWord  = document.querySelector(".searchWord")
var searchUrl = document.querySelector(".searchUrl")
var sumitUrl = document.querySelector(".sumitUrl")
var sumitWord = document.querySelector(".sumitWord")
var iframe = document.querySelector("iframe")

var ctx = document.getElementById('myChart');
var keyWord   //Top3
var timeLabel //時間
var timeProb  // 機率

var selectWord = []

var showUrl //在前端可顯示的樣子

// =========================== 前端整理input (url、keyWord) ====================================
var keyWord_vue = new Vue({  // 影片一分析完就顯示的推薦關鍵字
    el: '#keyWord',
    data: {
      key: [],
    }
})
var userSearch_vue = new Vue({ // user查過的關鍵字
    el: '#userSearch',
    data: {
      search:[]
    }
})

searchWord.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      event.preventDefault()
      sumitWord.click()
    }
})
// ----> 查關鍵字
sumitWord.onclick = function(e){
    searchWord = document.querySelector(".searchWord").value
    console.log(searchWord);
    if (userSearch_vue['search'].indexOf(searchWord) == -1){
        userSearch_vue['search'].push(searchWord)
        selectWord.push(searchWord)
    }
}

searchUrl.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      event.preventDefault()
      sumitUrl.click()
    }
})
// ----> 查YT影片
sumitUrl.onclick = function(e){
    // 取出網址
    searchUrl = document.querySelector(".searchUrl").value
    // send to server & check valid url
    vaildVideo = sentVideo(searchUrl)
    if (vaildVideo){
        // 整理網址以show
        searchUrl = searchUrl.split('watch?v=')
        showUrl = searchUrl[0]+"embed/"+searchUrl[1].split("&")[0]
        iframe.src = showUrl
        iframe.classList.remove("hide")
        ctx.classList.remove("hide")

        // show key word
        document.querySelector('#keyWord').classList.remove('hide')
    }
    console.log(showUrl);
}

function handleChange(checkbox) {
    var labelText = checkbox.parentElement.querySelector('label').innerText
    if(checkbox.checked == true){
        selectWord.push(labelText)
    }else{
        var delIdx = selectWord.indexOf(labelText)
        selectWord.splice(delIdx,1)
    }
    console.log(selectWord)
}

// =========================== 接後端資料 =====================================================
// 當 "影片網址、搜尋關鍵字" 改變
// 傳 keyWord、video 給 server

function sentVideo(searchUrl){
    var valid = true
    // 主要傳給server的是 "selectWord、辨識影片id"
    
    // 接server資料：TOP3、time、prob
    keyWord = ['AAA','BBB','CCC'] 
    timeLabel = ['10s', '20s', '30s', '40s', '50s', '60s', '70s']
    timeProb = [0, 0.1,0.7,0.3,0.4,0.2,0.3]


    keyWord_vue["key"] = keyWord

    // 接完後端的資料後 才更新前端機率圖
    showCharJS()
    return valid
}


// =========================== 前端處理影片 =====================================================
// 機率分布顯示的圖 char.js
var chart 
var ctx = document.getElementById('myChart')
function showCharJS(){
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabel,
            datasets: [{
                label: 'My First dataset',
                backgroundColor: 'rgb(31, 211, 207)',
                borderColor: 'rgb(31, 211, 207)',
                data: timeProb
            }]
        },
        // Configuration options go here
        options: {
            // responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false 
             },
             scales: {
                yAxes: [{
                  gridLines: {
                    drawBorder: false,
                  },
                }]
              },
        }
    })
    // 創完char.js後再指定一次 canvas
    canvas = document.querySelector("canvas")
}

// 處理影片要跳到哪一段
var canvas = document.querySelector("canvas")
canvas.onclick = function(evt){
    var activePoints = chart.getElementsAtEvent(evt)[0]._index; // activePoints=按下的時間
    activePoints *= 50
    iframe.src = showUrl + "?start=" + activePoints +"&autoplay=1"
    console.log(activePoints)
};