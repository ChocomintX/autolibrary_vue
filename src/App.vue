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

.main,html,body{
  width: 100%;
}

.head{
  width: 100%;
  height: 50px;
  color: white;
  background: #39afff;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
}

.footer{
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
}
</style>
