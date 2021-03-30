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
          <el-button :loading="loading" @click="submit('Form')" style="width: 100%" type="primary">查询占座用户</el-button>
        </el-form-item>
      </el-form>

      <el-tag v-for="item in results" :key="item.value" v-show="results.length>0" style="font-size: 15px">
        <div>{{ getInfo(item) }}</div>
        <el-button v-show="item['Status']==2" type="danger" class="btn" @click="cancelSeat(item['Id'],2)">签退</el-button>
        <el-button v-show="item['Status']==1" type="warning" class="btn" @click="cancelSeat(item['Id'],3)">取消预约</el-button>
      </el-tag>
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
      results:[],
      loading:false,
      options: this.$rooms,
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
            seatNo:this.formLabelAlign.seatNo,
            type:1
          }).then(r=>{
            if(r.data.code==1){
              this.$message.error(r.data.msg);
            }else{
              this.$message.success(r.data.msg);
              this.results=r.data.data
            }
            this.loading=false;
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getInfo(item) {
      if(this.results.length==0)
        return '';
      let time = item.StartTime.split(' ')[1] + '-' + item.EndTime.split(' ')[1];

      let str = '姓名：' + item.real_name
          + '\n预约时间：' + time;

      return str
    },
    cancelSeat(id,type){
      this.$confirm('确定要进行该操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('cancelSeat',{
          token:localStorage.getItem('token'),
          id:id,
          type:type
        }).then(r=>{
          if(r.data.code==0){
            this.$message.success(r.data.msg);
          }else{
            this.$message.error(r.data.msg);
          }
          this.submit('Form');
        })
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
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
.el-tag {
  height: auto;
  width: 100%;
  white-space: pre-line;
  word-break: break-all;
  margin-bottom: 20px;
  position: relative;
}

.btn{
  float: right;
  width: 90px;
  position: absolute;
  font-size: 10px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  margin: 12px;
}
</style>