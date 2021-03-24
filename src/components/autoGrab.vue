<template>
  <el-container>
    <el-main>
      <el-form :rules="rules" ref="Form" label-position="left" label-width="80px" :model="formLabelAlign">
        <el-form-item prop="roomID" label="自习室">
          <el-select style="width: 100%" v-model="formLabelAlign.roomID" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

<!--        <el-form-item prop="startTime" label="开始时间">-->
<!--          <el-time-picker placeholder="开始时间" v-model="formLabelAlign.startTime" style="width: 100%"></el-time-picker>-->
<!--        </el-form-item>-->

<!--        <el-form-item prop="endTime" label="结束时间">-->
<!--          <el-time-picker placeholder="结束时间" v-model="formLabelAlign.endTime" style="width: 100%"></el-time-picker>-->
<!--        </el-form-item>-->

        <el-form-item label-width="0">
          <el-button :loading="loading" @click="submit('Form')" style="width: 100%" type="primary">抢座</el-button>
        </el-form-item>
      </el-form>

    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "autoGrab",
  data() {
    let isNum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('不能为空'))
      } else if (isNaN(value)) {
        callback(new Error('只能输入数字'));
      } else {
        callback();
      }
    };
    let checkTime = (rule, value, callback) => {
      let startTime = new Date(this.formLabelAlign.startTime)
      let endTime = new Date(value)
      if (endTime < startTime) {
        callback(new Error('结束时间不能比开始时间早'));
      } else if (value == '') {
        callback(new Error('请选择结束时间'))
      } else {
        callback();
      }
    };
    return {
      formLabelAlign: {
        roomID: '',
        startTime: '',
        endTime: ''
      },
      loading:false,
      options: [{
        value: '2062',
        label: '东区6楼声像阅览室'
      }],
      rules: {
        roomID: [
          {required: true, message: '请选择自习室', trigger: 'blur'},
        ],
        seatNo: [
          {required: true,validator: isNum, trigger: 'blur'},
        ],
        startTime: [
          {required: true, message: '请选择开始时间', trigger: 'blur'}
        ],
        endTime: [
          {required: true,validator: checkTime, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submit(formName) {
      let token=localStorage.getItem('token')
      if(token==null){
        this.$message.error('还未登录！')
        return;
      }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading=true;
          // let startTime = new Date(this.formLabelAlign.startTime);
          // let endTime = new Date(this.formLabelAlign.endTime);
          // let time = (startTime.getHours() * 60 + startTime.getMinutes()) + ','
          //     + (endTime.getHours() * 60 + endTime.getMinutes());
          this.$http.post('autoGrab',{
            // roomID:this.formLabelAlign.roomID,
            token:token,
            // time:time,
            // seatNo:this.formLabelAlign.seatNo
          }).then(r=>{
            console.log(r.data)
            this.loading=false;
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

</style>