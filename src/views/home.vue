<template>
  <div class="main">
    <div class="head">
      头部
    </div>

    <el-carousel height="150px">
      <el-carousel-item v-for="item in items" :key="item">
        <h3 class="small">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>

    <el-row>
      <el-col :span="18">还未登录，请先登录</el-col>
      <el-col :span="6">登录</el-col>
    </el-row>

    <el-row>
      <el-col :span="6">

      </el-col>
      <el-col :span="6">123</el-col>
      <el-col :span="6">123</el-col>
      <el-col :span="6">123</el-col>
    </el-row>
    <div class="footer">
      底部
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  data(){
    return{
      items:[1,2,3,4]
    }
  }
}
</script>

<style scoped>

</style>