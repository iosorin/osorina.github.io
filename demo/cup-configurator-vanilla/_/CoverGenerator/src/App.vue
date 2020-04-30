<template>
  <div id="app">
    <a id="menuLink" href="#menu" class="menu-link"><span></span></a>
    <div id="menu">
      <div class="pure-menu"><a href="http://nekowiztw.github.io/" class="pure-menu-heading">NekowizTW</a>
        <ul class="pure-menu-list">
          <li class="pure-menu-item"><a href="http://zh.nekowiz.wikia.com" class="pure-menu-link">黑貓wikia</a></li>
          <li class="pure-menu-item"><a href="https://github.com/NekowizTW/cardFinder" class="pure-menu-link">專案地址</a></li>
        </ul>
      </div>
    </div>
    <MainFunc />
  </div>
</template>

<script>
import MainFunc from './components/MainFunc'
export default {
  name: 'app',
  components: {
    MainFunc,
  }
}
</script>

<style>
  body {
    color:#777;
    font-family: Arial, "文泉驛正黑", "WenQuanYi Zen Hei", "儷黑 Pro", "LiHei Pro", "微軟正黑體", "Microsoft JhengHei", "標楷體", DFKai-SB, sans-serif;
  }
  .pure-img-responsive {
    max-width:100%;
    height:auto
  }
  #app,
  #menu,
  .menu-link {
    -webkit-transition:all .2s ease-out;
    -moz-transition:all .2s ease-out;
    -ms-transition:all .2s ease-out;
    -o-transition:all .2s ease-out;
    transition:all .2s ease-out
  }
  #app {
    position:relative;
    padding-left:0
  }
  #app.active #menu {
    left:150px;
    width:150px
  }
  #app.active .menu-link {
    left:150px
  }
  .header {
    margin:0;
    color:#333;
    text-align:center;
    padding:2.5em 2em 0;
    border-bottom:1px solid #eee
  }
  .header h1 {
    margin:.2em 0;
    font-size:3em;
    font-weight:300
  }
  .header h2 {
    font-weight:300;
    color:#ccc;
    padding:0;
    margin-top:0
  }
  #menu {
    margin-left:-150px;
    width:150px;
    position:fixed;
    top:0;
    left:0;
    bottom:0;
    z-index:1000;
    background:#191818;
    overflow-y:auto;
    -webkit-overflow-scrolling:touch
  }
  #menu a {
    color:#999;
    border:none;
    padding:.6em 0 .6em .6em
  }
  #menu .pure-menu,
  #menu .pure-menu ul {
    border:none;
    background:0 0
  }
  #menu .pure-menu .menu-item-divided,
  #menu .pure-menu ul {
    border-top:1px solid #333
  }
  #menu .pure-menu li a:focus,
  #menu .pure-menu li a:hover {
    background:#333
  }
  #menu .pure-menu-heading,
  #menu .pure-menu-selected {
    background:#1f8dd6
  }
  #menu .pure-menu-selected a {
    color:#fff
  }
  #menu .pure-menu-heading {
    font-size:110%;
    color:#fff;
    margin:0
  }
  .menu-link {
    position:fixed;
    display:block;
    top:0;
    left:0;
    background:#000;
    background:rgba(0,0,0,.7);
    font-size:10px;
    z-index:10;
    width:2em;
    height:auto;
    padding:2.1em 1.6em
  }
  .menu-link:focus,
  .menu-link:hover {
    background:#000
  }
  .menu-link span {
    position:relative;
    display:block
  }
  .menu-link span,
  .menu-link span:after,
  .menu-link span:before {
    background-color:#fff;
    width:100%;
    height:.2em
  }
  .menu-link span:after,
  .menu-link span:before {
    position:absolute;
    margin-top:-.6em;
    content:" "
  }
  .menu-link span:after {
    margin-top:.6em
  }
  @media (min-width:48em) {
    .content,
    .header {
      padding-left:2em;
      padding-right:2em
    }
    #app {
      padding-left:150px;
      left:0
    }
    #menu {
      left:150px
    }
    .menu-link {
      position:fixed;
      left:150px;
      display:none
    }
    #app.active .menu-link {
      left:150px
    }
  }
  @media (max-width:48em) {
    #app.active {
      position:relative;
      left:150px
    }
  }
  @media screen and (max-width:35.438em) {
    .pure-visible-sm {
      display:none
    }
    .pure-visible-md {
      display:none
    }
    .pure-visible-lg {
      display:none
    }
    .pure-visible-xl {
      display:none
    }
    .pure-hidden-xs {
      display:none
    }
  }
  @media screen and (min-width:35.5em) and (max-width:47.938em) {
    .pure-visible-xs {
      display:none
    }
    .pure-visible-md {
      display:none
    }
    .pure-visible-lg {
      display:none
    }
    .pure-visible-xl {
      display:none
    }
    .pure-hidden-sm {
      display:none
    }
  }
  @media screen and (min-width:48em) and (max-width:63.938em) {
    .pure-visible-xs {
      display:none
    }
    .pure-visible-sm {
      display:none
    }
    .pure-visible-lg {
      display:none
    }
    .pure-visible-xl {
      display:none
    }
    .pure-hidden-md {
      display:none
    }
  }
  @media screen and (min-width:64em) and (max-width:79.938em) {
    .pure-visible-xs {
      display:none
    }
    .pure-visible-sm {
      display:none
    }
    .pure-visible-md {
      display:none
    }
    .pure-visible-xl {
      display:none
    }
    .pure-hidden-lg {
      display:none
    }
  }
  @media screen and (min-width:80em) {
    .pure-visible-xs {
      display:none
    }
    .pure-visible-sm {
      display:none
    }
    .pure-visible-md {
      display:none
    }
    .pure-visible-lg {
      display:none
    }
    .pure-hidden-xl {
      display:none
    }
  }
</style>