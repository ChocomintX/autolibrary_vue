<template>
  <el-container id="main">
    <el-main>
      <el-form label-position="left" label-width="80px" :model="formLabelAlign">
        <el-form-item label="学号">
          <el-input v-model="formLabelAlign.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formLabelAlign.password"></el-input>
        </el-form-item>
        <el-form-item label="py码">
          <el-input v-model="formLabelAlign.pycode"></el-input>
        </el-form-item>

        <el-form-item label-width="0">
          <el-button @click="login" style="width: 100%" type="primary">登录</el-button>
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
        password:'',
        pycode:''
      }
    }
  },
  methods:{
    login() {
      const loading=this.$loading({
        lock:true,
        fullscreen:false
      })
      this.$http.post('bindUser', {
        username:this.formLabelAlign.username,
        password:this.formLabelAlign.password,
        pycode:this.formLabelAlign.pycode
      }).then(r=>{
        if(r.data['code']===0){
          this.$message.success(r.data['msg'])
          localStorage.setItem('token',r.data['token']);
          this.$router.push('/')
        } else
          this.$message.error(r.data['msg'])

        loading.close()
      })
    }
  }
}
</script>

<style scoped>
#main{
  /*flex: flex;*/
}
</style>