function store_data(request)
{
  chrome.storage.sync.set({'data': JSON.stringify(request)}, (function() {
    console.log('Settings saved');
  }));
}
 chrome.runtime.onMessage.addListener(
  (function(request, sender, sendResponse) {
    store_data(request)
    sendResponse({farewell: "received"});
    location.reload()
  })
);
let categories= {};
chrome.storage.sync.get(['data'], (function(items) {
  try
  {
    categories =  JSON.parse(items.data);
  }
  catch(error)
  {
    categories = {'data' : 15}
  }
  modify_page();
}));
function makediv(){
  if(document.querySelector('.flex-box')== null){
    var all = document.querySelector('ytd-rich-grid-renderer.style-scope.ytd-two-column-browse-results-renderer');
    var tag = document.createElement("div");
    tag.classList.add("flex-box");
    tag.style.cssText = "display:flex;flex-wrap: wrap;width: -webkit-fill-available;user-select: auto;";
    all.insertBefore(tag,document.querySelector('#contents.style-scope.ytd-rich-grid-renderer')); 
  }
}
let NewLength = 0;
let OldLength = 0;
function modify_page()
{

let timer = setInterval(check, 1000);
  function check()
  {
    const elements =  document.querySelectorAll('ytd-rich-item-renderer.style-scope.ytd-rich-grid-row');
    OldLength = elements.length;
    if (OldLength != 0)
    {
      clearInterval(timer);
      RemoveElements(elements);
    }
  }
}
function addmore() {  
  let elementsScroll =  document.querySelectorAll('ytd-rich-item-renderer.style-scope.ytd-rich-grid-row');
  
  NewLength = elementsScroll.length;
  if (NewLength > OldLength)
  {
    elementsScroll = [...elementsScroll];
    elementsScroll = elementsScroll.slice(OldLength);
    OldLength = NewLength;
    RemoveElements(elementsScroll);
  }
} 
function move(elem){
  window.setInterval(function() {
    addmore();
    elem.scrollTop = elem.scrollHeight;
  }, 1500);
}
var ct=1;
function RemoveElements(elements)
{
  makediv();
  let sum = Object.values(categories).reduce((partialSum, a) => partialSum + a, 0);
  elements.forEach(firstChild =>{
    if (sum == 15)
    {
      console.log("All categories selected");
    }
    else{
      var contentdiv = document.querySelector('#contents.style-scope.ytd-rich-grid-renderer');
      contentdiv.style.overflowY = 'scroll';
      contentdiv.style.maxHeight = '150px';
      contentdiv.style.visibility = 'hidden';
      if(sum!=0){
        if(ct){
          move(contentdiv);
          ct=0;
        }
        var tagi = document.querySelector('.flex-box');
        link = firstChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.href;
        fetch(link)
        .then((response) => response.text())
        .then((text) => {
          let category = (text.substring( text.search('"category"')+12 , text.search('"category"') +15));
          if(categories[category])
          {
            tagi.appendChild(firstChild);
          }
        })
        .catch()
      }
    }
  })
}