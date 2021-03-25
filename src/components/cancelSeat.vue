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
        <el-form-item prop="seatNo" label="座位号">
          <el-input v-model="formLabelAlign.seatNo" placeholder="输入地图上显示的数字即可"></el-input>
        </el-form-item>

        <el-form-item label-width="0">
          <el-button :loading="loading" @click="submit('Form')" style="width: 100%" type="primary">踢了</el-button>
        </el-form-item>
      </el-form>

    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "cancelSeat",
  data() {
    let isNum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('不能为空'))
      } else if (isNaN(value)) {
        callback(new Error('只能输入数字'));
      } else {
        callback();
      }
    }

    return {
      formLabelAlign: {
        roomID: '',
        seatNo: '',
        startTime: '',
        endTime: ''
      },
      loading:false,
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
      }],
      rules: {
        roomID: [
          {required: true, message: '请选择自习室', trigger: 'blur'},
        ],
        seatNo: [
          {required: true,validator: isNum, trigger: 'blur'},
        ]
      }
    }
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading=true;
          this.$http.post('cancelSeat',{
            token:localStorage.getItem('token'),
            roomID:this.formLabelAlign.roomID,
            seatNo:this.formLabelAlign.seatNo
          }).then(r=>{
            if(r.data.code==1){
              this.$message.error(r.data.msg);
            }else{
              this.$message.success(r.data.msg);
            }
            this.loading=false;
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });


    }
  },
  created() {
    let token=localStorage.getItem('token')
    if(token==null){
      this.$msgbox.alert('还未登录！','提示',{
        callback:()=>{
          this.$router.push('/searchSeat')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>