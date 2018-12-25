class ImagesOfHtml {

    constructor(_isDev) {
      this.isDev = !!_isDev;
      this.result={
        imgs:[],
        urls:[],
        types:[],
        sizes:[]
      };
    };
  
    getImgFromElement() {
      let that = this;
      let imgs = document.images;
  
      //bug 
      if (that.isDev) console.log(imgs.length);
  
      for (let i = 0; i < imgs.length; i++) {
        let img = imgs[i];
        let w = img.naturalWidth,
          h = img.naturalHeight,
          url = img.src;
  
        if (that.isImgMatch(w, h, url)) {
  
          that.pushResult(img, url, "element-image", {
            width: w,
            height: h
          });
  
        };
      };
    };

    pushResult(_img,_url,_type,_size){
      this.result.imgs.push(_img);
      this.result.urls.push(_url);
      this.result.types.push(_type);
      this.result.sizes.push(_size);
    };
  
    isImgMatch(_w, _h, _url) {
      let isMatch = !!(_w != 0 & _h != 0 & _w > 10 && !_url.match('.svg'));
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
  
  };