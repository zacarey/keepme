<template>
  <div id="app">
    <div class="wrapper">
      <div>
        <br/>
        <div>
          <img class="siteIcon" src="favicon.ico" height = 30 width = 30/>
          <h2 class="siteTitle">KeepMe</h2>
        </div>
        <p><i>Lock away secrets.</i></p>
      </div>
      <router-view/>
      <br>
    </div>
    <div id="footer" class="footer">
      &copy; 2019 KeepMe | <a class="footer-link" href="/">Home</a> | <router-link class="footer-link" to="/about">About</router-link>
    </div>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 60px 30px 10px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-active {
  color: #42b983;
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: white;
  color: #e64c1b;
  text-align: center;
  font-size: 15px;
  height: 22px;
}

.footer-link {
  color: #e64c1b;
  text-decoration: none;
}

.siteIcon {
  margin-right: 7px;
  margin-bottom: 12px;
}

.siteTitle {
  display: inline;
}

.wrapper {
  margin: 0 0 20px;
}
</style>
