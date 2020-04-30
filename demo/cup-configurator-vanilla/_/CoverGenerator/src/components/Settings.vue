<template>
  <div id="setting" class="pure-form pure-form-aligned">
    <h3 class="content-subtitle">設定選項</h3>
    <fieldset>
      <div class="pure-control-group">
        <label for="frontLogo">封面人物</label>
        <select id="frontLogo"
                @change="handleLogoChange">
          <option  v-for="(logo, logo_idx) in logos"
                  :key="'logo' + logo_idx"
                  :value="logo_idx">
            {{logo.name}}
          </option>
        </select>
      </div>
      <div class="pure-control-group">
        <label for="name">遊戲ID</label>
        <input  id="name"
                type="text"
                v-bind:value="name"
                @keyup="handleNameChange"
                placeholder="請輸入你的遊戲ID">
      </div>

      <div class="pure-control-group">
        <label for="code">邀請碼</label>
        <input  id="code"
                type="text"
                v-bind:value="code"
                @keyup="handleCodeChange"
                placeholder="請輸入你的邀請碼">
      </div>
      <div class="pure-control-group"
           v-for="(sei_item, sei_idx) in seireis" :key="'seirei' + sei_idx">
        <label :for="'seirei' + sei_idx">常駐卡片{{ sei_idx + 1 }}</label>
        <div class="option-container">
          <v-suggest :id="'seirei' + sei_idx"
                     :data="options"
                     :value="seireis[sei_idx].text"
                      show-field="text"
                     @values="(value) => { handleChange(value, sei_idx)}"
                      placeholder="請輸入卡片名稱或卡片代號"></v-suggest>
          <img class="card-img" :src="linkGenerator(seireis[sei_idx])" alt="" />
        </div>
      </div>
      <div class="pure-controls pure-button-group">
        <button class="pure-button pure-button-primary" @click="saveData">產生預覽</button>
        <button class="pure-button pure-button-error" @click="clearSeirei">清除精靈</button>
      </div>
    </fieldset>
  </div>
</template>

<script>
  import CryptoJS        from 'crypto-js'
  import fandomAPI       from './../tools/fandomAPI'
  export default {
    name: 'setting',
    components: {

    },
    data () {
      return {
        options: [],
        logos: [
          {name: 'Q版維茲', file: 'qWiz.png'},
          {name: '新年優卡', file: 'shogatuYucca.png'}
        ],
        coverLogo: {name: 'Q版維茲', file: 'qWiz.png'},
        name: '',
        code: '',
        seireis: [
          {id: 0, text: '', value: '0000.png'},
          {id: 0, text: '', value: '0000.png'},
          {id: 0, text: '', value: '0000.png'},
          {id: 0, text: '', value: '0000.png'},
          {id: 0, text: '', value: '0000.png'}
        ],
      }
    },
    beforeMount () {
      fandomAPI.fetchList()
        .then(res => {
          this.options = res
        })
    },
    methods: {
      linkGenerator (value) {
        let filename = value.value
        let rand = Math.floor((Math.random() * 4) + 1);
        let md5name = CryptoJS.MD5(filename).toString();
        return 'https://vignette'+rand+'.wikia.nocookie.net/nekowiz/images/'+md5name.charAt(0)+'/'+md5name.charAt(0)+md5name.charAt(1)+'/'+filename+'/revision/latest?path-prefix=zh';
      },
      handleLogoChange (e) {
        this.coverLogo = this.logos[e.target.value]
      },
      handleNameChange (e) {
        this.name = e.target.value
      },
      handleCodeChange (e) {
        this.code = e.target.value
      },
      handleChange (value, idx) {
        this.seireis[parseInt(idx)] = value
        this.$forceUpdate()
      },
      clearSeirei () {
        // set all value to specified in array
        this.seireis.forEach((o, i, a) => a[i] = {id: 0, text: '', value: '0000.png'})
        this.$forceUpdate()
      },
      saveData () {
        this.$parent.updateCanvas({
          coverLogo: this.coverLogo,
          name: this.name,
          code: this.code,
          seireis: this.seireis
        })
      }
    }
  }
</script>

<style>
  .setting {
    
  }
  .option-container {
    display: inline-block;
  }
  .pure-form select {
    height: 2.3em;
  }
  .v-suggest {
    display: inline-block;
    width: 217px;
    margin-right: 2em;
  }
  .v-suggest input:focus {
    border-color: #129FEA!important;
    border-radius: 4px!important;
  }
  .card-img {
    display: inline-block;
    width: 48px;
    vertical-align: middle;
  }
  .pure-button-success,
  .pure-button-error,
  .pure-button-warning,
  .pure-button-secondary {
    color: white;
    border-radius: 4px;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  }

  .pure-button-success {
    background: rgb(28, 184, 65); /* this is a green */
  }

  .pure-button-error {
    background: rgb(202, 60, 60); /* this is a maroon */
  }

  .pure-button-warning {
    background: rgb(223, 117, 20); /* this is an orange */
  }

  .pure-button-secondary {
    background: rgb(66, 184, 221); /* this is a light blue */
  }
</style>