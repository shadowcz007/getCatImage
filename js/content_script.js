
var images=new ImagesOfHtml();

async function init_getCatImage(){
    return new Promise((resolve, reject) => {
        //console.log(_urls);
        chrome.runtime.sendMessage(
            { type: 'lingvistov', imgurls: _urls,classNames:_classNames },
            function (response) {
                //console.log('收到来自后台的回复：', response);
                resolve(response);
            }
        );
    })
};


async function init(){
   await images.getImgFromElement();
   console.log(images.result);
}