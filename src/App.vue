<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
#app,#main,html,body{
  height: 100%;
  width: 100%;
}

#main,html,body{

  /*font-family: "微軟正黑體 Light";*/
}

#head{
  padding: 0;
}

#footer{
  padding: 0;
}
</style>
