<template>
  <el-container>
    <el-header id="head" height="50px">
      <div v-show="showNotify">
        <i class="el-icon-warning-outline" style="font-size: 21px;margin-left: 10px;margin-top: 3px"></i>
        <div class="scroll-group">
          <div class="scroll-content">本网站的所有内容不用于盈利，仅供个人研究学习使用！</div>
        </div>
        <i class="el-icon-close" @click="showNotify=false"
           style="font-size: 21px;margin-right: 10px;margin-top: 3px"></i>
      </div>

      <div v-show="!showNotify" style="background-color: #409EFF;color: white">
        怀化学院图书馆 <b style="text-decoration: line-through;margin: 5px"><i>抢座</i></b> 相亲系统
      </div>
    </el-header>
    <el-main id="main">
      <el-carousel height="150px">
        <el-carousel-item v-for="item in items" :key="item.index">
          <img style="width: 100%" :src="item.url" alt="无图片"/>
        </el-carousel-item>
      </el-carousel>

      <div class="row">
        <div class="showState">
          <b>{{ state }}</b>
        </div>
        <el-button type="primary" v-show="!isLogin" @click="login">登录</el-button>

        <el-button type="primary" v-show="isLogin" @click="sign">签到</el-button>
        <el-button type="danger" v-show="isLogin" @click="exit">退出</el-button>
      </div>

      <el-tabs id="tabs" @tab-click="changeView">
        <el-tab-pane label="按座查人" name="searchSeat"></el-tab-pane>
        <el-tab-pane label="按人查座" name="searchPeople"></el-tab-pane>
        <el-tab-pane label="自动抢座" name="autoGrab"></el-tab-pane>
        <el-tab-pane label="暴力反占座" name="cancelSeat"></el-tab-pane>
        <el-tab-pane label="现在预约" name="appointment"></el-tab-pane>
      </el-tabs>

      <router-view></router-view>
    </el-main>
    <el-footer id="footer">这是底部，还没写东西</el-footer>
  </el-container>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      userInfo:null,
      isLogin: false,
      items: [
        {url: require("@/assets/1.jpg")},
        {url: require("@/assets/2.jpg")},
        {url: require("@/assets/3.jpg")},
        {url: require("@/assets/4.jpg")},
      ],
      showNotify: true,
    }
  },
  computed:{
    state(){
      if(this.userInfo==null)
        return '还未登录，请先登录';
      else {
        return '欢迎您：'+this.userInfo.real_name;
      }
    }
  },
  methods: {
    changeView(tab) {
      // console.log(tab,event)
      this.$router.push(tab.name)
    },
    login() {
      this.$router.push('/login')
    },
    sign(){
      this.$http.post('sign',{
        token:localStorage.getItem('token')
      }).then(r=>{
        let data=r.data;
        if(data.code==0){
          this.$msgbox.alert('签到成功！','提示');
        }else{
          this.$msgbox.alert('签到失败！请检查是否在预约前后十五分钟内','提示');
        }
      })
    },
    exit(){
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.clear();
        this.$message({
          type: 'success',
          message: '退出登录成功！'
        });
        location.reload();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    }
  },
  created() {
    let token=localStorage.getItem('token');
    if (token != null) {
      let load=this.$loading({
        lock:true,
        text:'获取登陆状态中...'
      });
      this.$http.post('searchUserInfo',{
        token:token
      }).then(r=>{
        if(r.data.code==0){
          this.userInfo=JSON.parse(r.data.data);
          this.isLogin=true;
        }
        console.log(JSON.parse(r.data.data));
      }).finally(()=>load.close())
      // this.$router.push('/searchSeat')
    }
  }
}
</script>

<style scoped>
#head {
  background-color: #a2f3a6;
  color: green;
  display: -webkit-flex;
  align-items: center;
  font-size: 15px;
}

#head > div {
  overflow: hidden;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

#footer {
  background: gray;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.row {
  margin: 10px 20px 0 20px;
  height: 40px;
  display: -webkit-flex;
}

.showState {
  width: 80%;
  height: 100%;
  display: -webkit-flex;
  align-items: center;
  color: blue;
  font-size: 20px;
  font-family: 幼圆;
}

.row > .el-button {
  float: right;
  height: 100%;
  width: 20%;
}

#main {
  padding: 0;
  min-height: calc(100vh - 100px);
}

#tabs {
  padding: 5px;
}

.scroll-group {
  overflow: hidden;
  margin: 0 10px 0 10px;
}

.scroll-content {
  float: left;
  left: 100%;
  margin: 0 20px 0 20px;
  white-space: nowrap;
  position: relative;
  animation: scrollAnimation linear 15s infinite;
}

@keyframes scrollAnimation {
  0% {
    left: 100%;
  }

  100% {
    transform: translateX(-105%);
    left: 0;
  }
}
</style>