chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);

  if (request.type == 'lingvistov') {
    getResult(request.imgurls).then(sendResponse);
  };

  return true;

});

 