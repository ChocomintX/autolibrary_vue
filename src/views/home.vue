<template>
  <el-container>
    <el-header id="head" height="50px">
      <div v-show="showNotify">
        <i class="el-icon-warning-outline" style="font-size: 21px;margin-left: 10px;margin-top: 3px"></i>
        <div class="scroll-group">
          <div class="scroll-content">本网站的所有内容不用于盈利，仅供个人研究学习使用！使用有疑问请联系qq：401162659</div>
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

        <el-button type="primary" v-show="isLogin" @click="getMySeats">座位</el-button>
        <el-button type="danger" v-show="isLogin" @click="exit">切换</el-button>
      </div>

      <el-tabs v-show="isLogin" id="tabs" @tab-click="changeView">
        <el-tab-pane label="按座查人" name="searchSeat"></el-tab-pane>
        <el-tab-pane label="按人查座" name="searchPeople"></el-tab-pane>
        <el-tab-pane label="自动抢座" name="autoGrab"></el-tab-pane>
        <el-tab-pane label="暴力反占座" name="cancelSeat"></el-tab-pane>
        <el-tab-pane label="现在预约" name="appointment"></el-tab-pane>
        <el-tab-pane label="后台管理" name="admin"></el-tab-pane>
      </el-tabs>

      <el-dialog
          :visible.sync="centerDialogVisible"
          width="60%"
          center>
        <span>
          <el-radio style="margin-top: 15px" v-for="(item,index) in tokenList" :key="item.token" v-model="currentUser"
                    :label="index">
            {{ item.info.identifyId }}  {{ item.info.real_name }}
          </el-radio>
        </span>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="login">添加</el-button>
          <el-button type="danger" @click="unbind">解绑</el-button>
        </div>
      </el-dialog>
      <router-view></router-view>
    </el-main>
    <el-footer id="footer">
      <div style="margin-bottom: 5px">Copyright © 2021
        <a href="https://chocomint.cn" target="_blank" style="color: #939393">Chocomint</a>
        All Rights Reserved
      </div>
      <div>
        <a href="http://beian.miit.gov.cn/" target="_blank" style="color: #939393">湘ICP备2021001152号-1</a>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      currentUser: 0,
      userInfo: null,
      isLogin: false,
      centerDialogVisible: false,
      tokenList: null,
      items: [
        {url: require("@/assets/1.jpg")},
        {url: require("@/assets/2.jpg")},
        {url: require("@/assets/3.jpg")},
        {url: require("@/assets/4.jpg")},
      ],
      showNotify: true,
    }
  },
  computed: {
    state() {
      if (this.userInfo == null)
        return '登录以使用更多功能';
      else {
        return '欢迎您：' + this.userInfo.real_name;
      }
    }
  },
  methods: {
    init() {
      let token = localStorage.getItem('token');
      if (token != null) {
        let tokenList = JSON.parse(localStorage.getItem('tokenList'));
        let exist = false;
        tokenList.forEach(e => {
          if (e.token == token) {
            this.userInfo = e.info;
            exist = true;
            this.isLogin = true;
            this.tokenList = tokenList;
            return
          }
        })

        if (exist)
          return

        let load = this.$loading({
          lock: true,
          text: '获取登陆状态中...'
        });
        this.$http.post('searchUserInfo', {
          token: token
        }).then(r => {
          if (r.data.code == 0) {
            this.userInfo = JSON.parse(r.data.data);
            this.isLogin = true;

            const user = {
              info: JSON.parse(r.data.data),
              token: token
            }
            tokenList.push(user)
            localStorage.setItem('tokenList', JSON.stringify(tokenList))
            this.tokenList = tokenList;
          }
          console.log(JSON.parse(r.data.data));
        }).finally(() => load.close())
        // this.$router.push('/searchSeat')
      }
    },
    unbind() {
      this.$confirm('确定要解绑图书馆公众号吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('unbindUser', {
          token: localStorage.getItem('token'),
          stuNo: this.userInfo.identifyId
        }).then(r => {
          if (r.status == 200) {
            this.$message.success(r.data);
          } else {
            this.$message.error('请求出错');
          }
          this.getSeats();
          // this.submit('Form');
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    changeView(tab) {
      // console.log(tab,event)
      this.$router.push(tab.name)
    },
    login() {
      this.$router.push('/login')
    },
    getMySeats() {
      this.$router.push('/mySeats')
    },
    exit() {
      this.centerDialogVisible = true;
      // this.$confirm('确定要退出登录吗？', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   localStorage.clear();
      //   this.$message({
      //     type: 'success',
      //     message: '退出登录成功！'
      //   });
      //   location.reload();
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消'
      //   });
      // });
    }
  },
  watch: {
    currentUser(newval, val) {
      const user = JSON.parse(localStorage.getItem('tokenList'))[newval];
      this.userInfo = user.info;
      console.log(user);
      console.log(val, newval);
      localStorage.setItem('token', user.token);
      this.centerDialogVisible = false;
    }
  },
  created() {
    this.init();
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
  background: #4b4b4b;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: gray;
  font-size: 10px;
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
  width: 100%;
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