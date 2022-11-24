let categories = {};
const boxes = document.querySelectorAll('.box');
setup()


function setup()
{
  chrome.storage.sync.get(['data'], function(items){
    try{
      categories =  JSON.parse(items.data);
      boxes.forEach(box =>{
        box.checked = categories[box.id]
      })
    }
    catch{
      console.log("no storage exist");
    }
  });

  boxes.forEach(box => {
    categories[box.id] = true;
    box.addEventListener('change', function(event){
    categories[event.target.id] = box.checked;
    })
  })

  const submit = document.querySelector('#submit1');
  submit.addEventListener('click',SendData)

  const reset = document.querySelector('#reset');
  reset.addEventListener('click',()=>{ResetSetAll(false)})
      
  const selectAll = document.querySelector('#selectAll');
  selectAll.addEventListener('click',()=>{ResetSetAll(true)})


  function ResetSetAll(check)
  {
    for (var key in categories)
    {
      categories[key] = check;
    }
      boxes.forEach(box =>{
        box.checked = check
      })
  }

  function SendData()
  {
    chrome.tabs.query({active: true, currentWindow: true},  function(tabs) {
       chrome.tabs.sendMessage(tabs[0].id, categories)
       .then(response =>{
         console.log(response.response);
       }).catch(console.log("some error"));
    }
    );
  }

}

function onSetURL() {
  console.log("set uninstall URL");
}

function onError(error) {
  console.log(`Error: ${error}`);
}

let settingUrl = chrome.runtime.setUninstallURL("https://www.google.com");
settingUrl.then(onSetURL, onError);