<template>
  <div id="main">
    <div class="header">
      <h1>黑貓封面生產器</h1>
    </div>
    <div class="content">
      <tabs
        :tabs="tabs"
        :currentTab="currentTab"
        :wrapper-class="'default-tabs'"
        :tab-class="'default-tabs__item'"
        :tab-active-class="'default-tabs__item_active'"
        :line-class="'default-tabs__active-line'"
        @onClick="handleClick"
      />
      <div v-if="currentTab == 'facebook'" title="Facebook">
        <Facebook ref="facebook" />
      </div>
      <div v-if="currentTab == 'bahamut'" title="巴哈姆特">
        <Bahamut ref="bahamut" />
      </div>
      <Settings />
    </div>
    <div class="footer">
      <div class="legal pure-g">
        <div class="pure-u-1">
          <p class="legal-license">Graphics ⓇCopyright by COLOPL, Inc. Published by So-net Entertainment Taiwan Limited.</p>
        </div>
        <div class="pure-u-1">
          <p class="legal-copyright">Project created by OtomeSound</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Tabs     from 'vue-tabs-with-active-line'
  import Facebook from './generator/Facebook'
  import Bahamut  from './generator/Bahamut'
  import Settings from './Settings'

  const TABS = [
    {title: 'Facebook', value: 'facebook'},
    {title: '巴哈姆特', value: 'bahamut'},
  ]

  export default {
    name: 'mainpage',
    components: {
      Tabs,
      Facebook,
      Bahamut,
      Settings
    },
    data () {
      return {
        tabs: TABS,
        currentTab: 'bahamut',
        data: ''
      }
    },
    mounted () {
    },
    updated () {
      this.$refs[this.currentTab].acceptData(this.data)
    },
    methods: {
      handleClick(newTab) {
        this.currentTab = newTab
      },
      updateCanvas (data) {
        if (data === '') return
        this.data = data
        this.$forceUpdate()
      }
    }
  }
</script>

<style>
  .content {
    margin: 0 auto;
    padding: 0 2em;
    margin-bottom: 50px;
    line-height: 1.6em;
    max-width: 960px;
  }
  .content-subhead {
    margin:50px 0 20px 0;
    font-weight:300;
    color:#888
  }
  .footer {
    text-align: center;
  }
  .default-tabs {
    position: relative;
    margin: 0 auto;
    margin-bottom: 10px;
  }
  .default-tabs__item {
    display: inline-block;
    margin: 0 5px;
    padding: 10px;
    padding-bottom: 8px;
    font-size: 16px;
    letter-spacing: 0.8px;
    color: gray;
    text-decoration: none;
    border: none;
    background-color: transparent;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.25s;
  }
  .default-tabs__item_active {
    color: black;
  }
  .default-tabs__item:hover {
    border-bottom: 2px solid gray;
    color: black;
  }
  .default-tabs__item:focus {
    outline: none;
    border-bottom: 2px solid gray;
    color: black;
  }
  .default-tabs__item:first-child {
    margin-left: 0;
  }
  .default-tabs__item:last-child {
    margin-right: 0;
  }
  .default-tabs__active-line {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background-color: black;
    transition: transform 0.4s ease, width 0.4s ease;
  }
</style>