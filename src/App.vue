<template>
  <div id="app">
    <div class="left">
      <img src="./static/images/logo.svg" alt="nutbox" class="logo">
      <b-nav pills vertical align="center">
        <b-nav-item to="/wallet">
          <b-icon icon="nut"></b-icon>
          Wallet
        </b-nav-item>
        <b-nav-item to="/stake">
          <b-icon icon="nut"></b-icon>
          Stake
        </b-nav-item>
        <b-nav-item to="/farm">
          <b-icon icon="nut"></b-icon>
          Farm
        </b-nav-item>
        <div class="bottom">
          <a href="/wallet" target="_blank">
            <b-icon icon="nut"></b-icon>
          </a>
          <a href="/stake" target="_blank">
            <b-icon icon="nut"></b-icon>
          </a>
           <a href="/stake" target="_blank">
            <b-icon icon="nut"></b-icon>
          </a>
           <a href="/stake" target="_blank">
            <b-icon icon="nut"></b-icon>
          </a>
           <a href="/stake" target="_blank">
            <b-icon icon="nut"></b-icon>
          </a>
        </div>
      </b-nav>
    </div>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss">
$blue: #f4a921;
:root{
  --yellow-background: #f5ecd8;
  --primary: #f4a921;
}

 @import '~bootstrap/scss/bootstrap.scss';
  @import '~bootstrap-vue/src/index.scss';
html, body{
  height:100%;
  margin:0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  display: flex;
  align-items: left;
}

.logo {
  margin-bottom:30px
}

.left{
  background-color: #fefefe;
  padding-top: 64px;
  width: 240px;
  position: relative;
  box-shadow:0 0 16px #eee;
}
.right{
  background-color:#fefefa;
  flex: 1
}

.left .nav-item{
  height: 60px;
  font-size: 1.1rem;
  text-align: left;
  box-sizing: border-box
}

.left .nav-item:hover{
  background-color: var(--yellow-background) !important;
}

.left .nav-item .b-icon{
  margin-right: 6px;
}

.left .nav-link{
  height:100%;
  line-height:44px;
  color:var(--primary) !important;
  padding-left: 24px;
}

.left .active{
  background-color:var(--yellow-background) !important;
  border-radius: 0px;
}

.left .bottom{
  position:absolute;
  padding:0 40px;
  width: 100%;
  bottom:30px;
  background-color:#fefefe;
  display:flex;
  justify-content:center;
  justify-content:space-around;
}
.left .bottom a{
  font-size: 1.2rem !important;
}

</style>
