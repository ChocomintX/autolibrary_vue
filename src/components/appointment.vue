<template>
  <el-container id="main">
    <el-main>
      <el-form label-position="left" label-width="80px" :model="formLabelAlign">
        <el-form-item label="自习室">
          <el-select style="width: 100%" v-model="formLabelAlign.roomID" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="座位号">
          <el-input v-model="formLabelAlign.seatNo" placeholder="输入地图上显示的数字即可"></el-input>
        </el-form-item>

        <el-form-item label="开始时间">
          <el-time-picker placeholder="开始时间" v-model="formLabelAlign.startTime" ></el-time-picker>
        </el-form-item>

        <el-form-item label="结束时间">
          <el-time-picker placeholder="结束时间" v-model="formLabelAlign.endTime" ></el-time-picker>
        </el-form-item>

        <el-form-item label-width="0">
          <el-button @click="submit" style="width: 100%" type="primary">预约</el-button>
        </el-form-item>
      </el-form>

    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "appointment",
  data(){
    return{
      formLabelAlign:{},
      options: [{
        value: '2021',
        label: '东区学习室2-1'
      }, {
        value: '2022',
        label: '东区学习室2-2'
      }, {
        value: '2024',
        label: '东区学习室2-4'
      }, {
        value: '2031',
        label: '东区学习室3-1'
      }, {
        value: '2032',
        label: '东区学习室3-2'
      }, {
        value: '2033',
        label: '东区学习室3-3'
      }, {
        value: '2034',
        label: '东区学习室3-4'
      }, {
        value: '2036',
        label: '东区学习室3-6'
      }, {
        value: '2063',
        label: '东区6楼电子阅览室'
      }, {
        value: '2062',
        label: '东区6楼声像阅览室'
      }]
    }
  },
  methods:{
    submit(){
      console.log(1)
    }
  }
}
</script>

<style scoped>

</style>