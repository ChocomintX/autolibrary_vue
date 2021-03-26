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

        <el-form-item prop="type" label="任务类型">
          <el-select style="width: 100%" v-model="formLabelAlign.type" placeholder="请选择">
            <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-show="formLabelAlign.type==2" prop="seatNo" label="座位号">
          <el-input v-model="formLabelAlign.seatNo" placeholder="输入地图上显示的数字即可 例:43"></el-input>
        </el-form-item>

        <el-form-item label-width="0">
          <el-button :disabled="btnActive" :loading="loading" @click="submit('Form')" style="width: 100%"
                     type="primary">抢座
          </el-button>
        </el-form-item>

        <el-tag>当前状态：{{ state }}
          <el-link v-show="cancelActive" type="danger" @click="cancelGrab" style="float: right">取消</el-link>
        </el-tag>
        <el-tag type="danger">
          tips：
          <div>①立即开始不可选取座位，只要自习室有空位则立即自动预约并签到</div>
          <div>②明早开始可选取座位，第二天6点才开始执行抢座，且可能需要手动签到</div>
          <div>③若已签到其他自习室位置，则任务会执行失败</div>
          <div>④立即开始目前仅支持6楼声像自习室</div>
        </el-tag>
      </el-form>

    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "autoGrab",
  data() {
    let isNum = (rule, value, callback) => {
      if (this.formLabelAlign.type == 1) {
        callback();
      } else if (value === '') {
        callback(new Error('不能为空'))
      } else if (isNaN(value)) {
        callback(new Error('只能输入数字'));
      } else {
        callback();
      }
    };
    return {
      btnActive: false,
      cancelActive: false,
      formLabelAlign: {
        roomID: '',
        type: '',
        seatNo: ''
      },
      loading: false,
      state: '',
      options: this.$rooms,
      types: [{
        value: '1',
        label: '立即开始'
      }, {
        value: '2',
        label: '明早开始'
      }],
      rules: {
        roomID: [{required: true, message: '请选择自习室', trigger: 'blur'}],
        type: [{required: true, message: '请选择任务类型', trigger: 'blur'}],
        seatNo: [{required: true, validator: isNum, trigger: 'blur'}]
      }
    }
  },
  methods: {
    submit(formName) {
      let token = localStorage.getItem('token')
      if (token == null) {
        this.$message.error('还未登录！')
        return;
      }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          // let startTime = new Date(this.formLabelAlign.startTime);
          // let endTime = new Date(this.formLabelAlign.endTime);
          // let time = (startTime.getHours() * 60 + startTime.getMinutes()) + ','
          //     + (endTime.getHours() * 60 + endTime.getMinutes());
          this.$http.post('autoGrab', {
            token: token,
            type: this.formLabelAlign.type,
            seatNo: this.formLabelAlign.seatNo,
            roomID:this.formLabelAlign.roomID,
            // time:time,
            // seatNo:this.formLabelAlign.seatNo
          }).then(r => {
            console.log(r.data)
            this.loading = false;
            this.$msgbox.alert(r.data.msg, '提示', {
              callback: () => {
                this.$router.go(0);
              }
            });
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    cancelGrab() {
      this.$confirm('确定要取消抢座任务吗？', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          if (action == 'confirm') {
            const loading = this.$loading({
              lock: true,
              text: '取消中...'
            })
            this.$http.post('cancelGrab', {
              token: localStorage.getItem('token')
            }).then(r => {
              if (r.data.code == 0) {
                this.$message.success(r.data.msg);
              } else {
                this.$message.error(r.data.msg);
              }
              this.$router.go(0);
            }).finally(() => loading.close());
          }
        }
      })
    }
  },
  created() {
    const token = localStorage.getItem('token');
    if (token == null) {
      this.$msgbox.alert('未登录无法使用此功能', '提示', {
        callback: () => {
          this.$router.push('/searchSeat')
        }
      })
      return;
    }
    const load = this.$loading(
        {
          lock: true,
          text: '获取状态信息中...'
        }
    )
    this.$http.post('isGrab', {
      token: localStorage.getItem('token')
    }).then(r => {
      load.close();
      let data = r.data;
      console.log(data.code);
      if (data.code == 1) {
        this.state = '还未设置自动抢座任务';
      } else {
        let state = r.data.state;

        switch (state.status) {
          case 0:
            this.state = '抢座成功！  共执行' + state.count + '次';
            break;
          case 1:
            this.cancelActive = true;
            this.btnActive = true;
            this.state = '抢座执行中...  已执行' + state.count + '次';
            break;
          case 2:
            this.state = '任务执行失败！' + state.msg;
            break;
          case 3:
            this.cancelActive = true;
            this.btnActive = true;
            this.state = '预约成功，任务明早执行';
            break;
        }
      }
      console.log(r.data)
    })
  }
}
</script>

<style scoped>
.el-tag {
  height: auto;
  width: 100%;
  white-space: normal;
  word-break: break-all;
  margin-bottom: 20px;
}


</style>