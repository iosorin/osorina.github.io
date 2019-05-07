<template>
  <div class="canvas-wrapper facebook">
    <vue-fabric ref="canvas" :width="width" :height="height"></vue-fabric>
    <button class="pure-button pure-button-success" @click="exportImage">下載封面</button>
  </div>
</template>

<script>
  import CryptoJS     from 'crypto-js'
  import Image2Base64 from 'image-to-base64'
  import DownloadJS   from 'downloadjs'
  export default {
    name: 'facebook-cover',
    data () {
      return {
        'width': 851,
        'height': 315,
        'coverLogo': {name: 'Q版維茲', file: 'qWiz.png'},
        'name': '遊戲ID顯示處',
        'code': '邀請碼顯示處',
        'seireis': [
          {id: 0, text: '', value: '0000.png'},
          {id: 0, text: '', value: '0000.png'},
          {id: 0, text: '', value: '0000.png'},
          {id: 0, text: '', value: '0000.png'},
          {id: 0, text: '', value: '0000.png'}
        ],
      }
    },
    mounted () {
      if (this.$parent.data !== '')
        this.acceptData(this.$parent.data)
      else
        this.drawCanvas()
    },
    methods: {
      linkGenerator (value) {
        let filename = value.value
        let rand = Math.floor((Math.random() * 4) + 1);
        let md5name = CryptoJS.MD5(filename).toString();
        return 'https://vignette'+rand+'.wikia.nocookie.net/nekowiz/images/'+md5name.charAt(0)+'/'+md5name.charAt(0)+md5name.charAt(1)+'/'+filename+'/revision/latest?path-prefix=zh';
      },
      acceptData (data) {
        this.coverLogo = data.coverLogo
        this.name = data.name
        this.code = data.code
        this.seireis.forEach((o, i, a) => {
          a[i] = data.seireis[i]
        })
        this.drawCanvas()
      },
      drawCanvas () {
        let _this = this;
        this.$refs.canvas.clear()
        this.$refs.canvas.setBackgroundColor('#191919');
        this.$refs.canvas.createImage('./static/images/load_img.png', {
          width: 100,
          height: 108,
          left: _this.width / 2,
          top: _this.height / 2,
        })
        this.$refs.canvas.canvas.sendToBack(this.$refs.canvas.canvas._objects[0])
        this.$refs.canvas.createImage('./static/images/pclogo.png', {
          width: 121,
          height: 67,
          left: 80,
          top: 50,
        })
        this.$refs.canvas.createImage('./static/images/frontLogo/' + this.coverLogo.file, {
          width: 256,
          height: 256,
          left: _this.width - 186,
          top: _this.height - 128,
        })
        this.seireis.forEach((seirei, idx) => {
          let path = this.linkGenerator(seirei)
          // use base64 to prevent cross-origin problem
          Image2Base64(path).then((response) => {
            let fullPath = 'data:image/png;base64, ' + response
            this.$refs.canvas.createImage(fullPath, {
              width: 40,
              height: 40,
              left: 220 + 46 * idx,
              top: 240,
            })
          })
        })
        this.$refs.canvas.createTextbox(_this.name, {
          width: 100,
          fillColor: 'white',
          fontSize: 20,
          left: 200,
          top: 170,
        })
        this.$refs.canvas.createTextbox(this.code, {
          width: 200,
          fillColor: 'white',
          fontSize: 16,
          left: 200,
          top: 190,
        })
        this.$refs.canvas.createTextbox('Graphics ⓇCopyright by COLOPL, Inc. Published by So-net Entertainment Taiwan Limited.', {
          width: 500,
          fillColor: 'white',
          fontSize: 9,
          left: _this.width - 610,
          top: 10,
        })
      },
      exportImage () {
        let base64 = this.$refs.canvas.toDataUrl()
        let timestamp = Date.now().toString()
        DownloadJS(base64, 'facebookCover' + timestamp + '.jpg', 'image/jpeg')
      }
    }
  }
</script>

<style>
  .canvas-wrapper {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
  .canvas-wrapper.facebook {
    width: 851px;
  }
  .canvas-wrapper button {
    margin-left: auto;
    margin-right: auto;
  }
  .canvas-container {
    border: 1px solid #888;
  }
</style>