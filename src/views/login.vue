<template>
  <el-container id="main">
    <el-main>
      <el-tag>
        tips：
        <div class="tips">
          ①登陆之前，先在“怀化学院图书馆”公众号的<span>座位预约</span>-<span>我的</span>-<span>解除绑定</span>中解除账号的绑定
        </div>
        <div class="tips">
          ②登陆之后，请再次回到公众号绑定自己的学号！否则会<span>收不到预约通知</span>
        </div>
        <div class="tips">
          ③登陆成功一次后再次进入网页不用再<span>重新登陆</span>
        </div>
      </el-tag>
      <el-form label-position="left" label-width="80px" ref="Form" :rules="rules" :model="formLabelAlign">
        <el-form-item prop="username" label="学号">
          <el-input v-model="formLabelAlign.username" placeholder="输入学号 例:1800130935"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="formLabelAlign.password" placeholder="如果没改过的话密码就是学号"></el-input>
        </el-form-item>

        <el-form-item label-width="0">
          <el-button @click="login('Form')" style="width: 100%" type="primary">登录</el-button>
        </el-form-item>
      </el-form>

    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "login",
  data(){
    return{
      formLabelAlign: {
        username:'',
        password:''
      },
      rules: {
        username: [{required: true, message: '输入学号', trigger: 'blur'}],
        password: [{required: true, message: '输入密码', trigger: 'blur'}]
      }
    }
  },
  methods:{
    login(formName) {

      this.$refs[formName].validate((valid) => {
        if (valid) {
          const loading=this.$loading({
            lock:true,
            fullscreen:false
          })
          this.$http.post('bindUser', {
            username:this.formLabelAlign.username,
            password:this.formLabelAlign.password
          }).then(r=>{
            if(r.data['code']===0){
              this.$message.success(r.data['msg'])
              localStorage.setItem('token',r.data['token']);
              this.$router.push('/')
            } else
              this.$message.error(r.data['msg'])

            loading.close()
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    }
  }
}
</script>

<style scoped>
#main{
  display: -webkit-flex;
  align-items: center;

}

.el-tag {
  height: auto;
  width: 100%;
  white-space: normal;
  word-break: break-all;
  margin-bottom: 20px;
}

.tips span{
  color: red;
}
</style>