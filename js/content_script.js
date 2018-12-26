
var images = new ImagesOfHtml();
init();

async function init_getCatImage() {
    return new Promise((resolve, reject) => {
        //console.log(_urls);
        chrome.runtime.sendMessage(
            { type: 'lingvistov', imgurls: _urls, classNames: _classNames },
            function (response) {
                //console.log('收到来自后台的回复：', response);
                resolve(response);
            }
        );
    })
};


async function init() {
    await images.getImgFromElement();
    console.log(images.result);

    await downloadImg(0);

}

async function downloadImg(_i) {
    let img = await images.loadImgFromHTTP(images.result.urls[_i]);
    var ctx = images.createCanvasFromImg(img);
    images.downloadCanvas(ctx.canvas, images.result.titles[_i]);
    if (_i + 1 >= images.result.titles.length) {
        var ls = document.querySelector('.bx_pagination_bottom');
        var lis = ls.querySelectorAll('li');
        lis[lis.length - 1].children[0].click();
    } else {
        await downloadImg(_i + 1);
    };
};