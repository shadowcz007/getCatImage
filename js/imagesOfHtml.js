class ImagesOfHtml {

  constructor(_isDev) {
    this.isDev = !!_isDev;
    this.result = {
      imgs: [],
      urls: [],
      types: [],
      sizes: [],
      titles: []
    };
  };


  imgLoad(_imgs, callback) {
    var timer = setInterval(function () {
      let count = _imgs.length;
      for (let i = 0; i < _imgs.length; i++) {
        let img = _imgs[i];
        if (img.complete) {
          count -= 1;
        };
      };

      if (count == 0) {
        callback();
        clearInterval(timer);
      };

    }, 50);
  };

 async getImgFromElement() {
    let that = this;
    let imgs = document.images;
    return new Promise((resolve, reject) => {

    if (that.isDev) console.log(imgs.length);

    that.imgLoad(imgs, function () {
      console.log('加载完毕')
      for (let i = 0; i < imgs.length; i++) {
        let img = imgs[i];
        let w = img.naturalWidth,
          h = img.naturalHeight,
          url = img.src;

        if (that.isImgMatch(w, h, url)) {
          let title = img.nextElementSibling.innerText;

          that.pushResult(img, url, "element-image", {
            width: w,
            height: h
          }, title);

        };
      };

      resolve();
    });
  });

  };

  pushResult(_img, _url, _type, _size, _title) {
    this.result.imgs.push(_img);
    this.result.urls.push(_url);
    this.result.types.push(_type);
    this.result.sizes.push(_size);
    this.result.titles.push(_title);
  };

  isImgMatch(_w, _h, _url) {
    let isMatch = !!(_w != 0 & _h != 0 & _w > 800 && !_url.match('.svg'));
    if (this.isDev) console.log(isMatch);
    return isMatch;
  };


  async loadImgFromHTTP(_url) {
    //console.log("loadImgFromHTTP:", _url);
    let that = this;

    return new Promise((resolve, reject) => {

      let url = _url;
      let xhr = new XMLHttpRequest();
      xhr.responseType = 'arraybuffer';
      xhr.open("GET", url, true);
      // console.log(xhr);
      xhr.send();

      xhr.onload = async function (e) {
        // console.log(this.response);
        var blob = this.response;
        var base64 = btoa(
          new Uint8Array(blob)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        //btoa(String.fromCharCode.apply(null, new Uint8Array(blob)))
        var str = 'data:image/png;base64,' + base64;
        var img = await that.loadImg(str);
        resolve(img);
      };
    });

  };

  async loadImg(_url) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.src = _url;
      // console.log(str);
      img.onload = function () {
        resolve(img);
      };
    });
  };


  createCanvasFromImg(_img) {
    let w = _img.naturalWidth,
      h = _img.naturalHeight;

    let c = document.createElement('canvas');
    c.width = w;
    c.height = h;

    let ctx = c.getContext('2d');
    ctx.drawImage(_img, 0, 0, w, h);

    return ctx

  };

  downloadCanvas(_canvas, _fileName) {

    var img = _canvas.toDataURL();

    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    save_link.href = img;
    save_link.download = _fileName;
    save_link.click();
  };


};