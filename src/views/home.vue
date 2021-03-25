<template>
  <el-container>
    <el-header id="head" height="40px">
      <div id="scroll-text">滚动字幕滚动字幕滚动字幕滚动字幕滚动字幕滚动字幕滚动字幕滚动字幕</div>
    </el-header>
    <el-main id="main">
      <el-carousel height="150px">
        <el-carousel-item v-for="item in items" :key="item">
          <h3 class="small" style="background-color: red">{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>

      <el-row>
        <el-col :span="18">{{ state }}</el-col>
        <el-col :span="6">
          <el-button @click="login">登录</el-button>
        </el-col>
      </el-row>

      <el-tabs id="tabs" @tab-click="changeView">
        <el-tab-pane label="按座查人" name="searchSeat"></el-tab-pane>
        <el-tab-pane label="自动抢座" name="autoGrab"></el-tab-pane>
        <el-tab-pane label="暴力反占座" name="cancelSeat"></el-tab-pane>
        <el-tab-pane label="现在预约" name="appointment"></el-tab-pane>
      </el-tabs>

      <router-view></router-view>
    </el-main>
    <el-footer id="footer" >底部</el-footer>
  </el-container>
</template>

<script>
export default {
  name: "home",
  data(){
    return{
      state:'还未登录，请登录',
      items:[1,2,3,4]
    }
  },
  methods:{
    changeView(tab){
      // console.log(tab,event)
      this.$router.push(tab.name)
    },
    login(){
      this.$router.push('/login')
    }
  },
  created() {
    if(localStorage.getItem('token')!=null){
      this.state='已登录'
    }
  }
}
</script>

<style scoped>
#head{
  background: blue;
}
#footer{
  /*background: blue;*/
  /*position: fixed;*/
  /*bottom: 0;*/
  /*left: 0;*/
  /*right: 0;*/
}

#scroll-text{
  overflow: hidden;
  white-space: nowrap;
  display: -webkit-flex;
  align-content: center;
  justify-items: center;
}

#main{
  padding: 0;
  min-height: calc(100vh - 100px);
}

#tabs{
  padding: 5px;
}
</style>