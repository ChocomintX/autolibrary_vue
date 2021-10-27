<template>
  <el-container>
    <el-main>
      <el-form ref="Form" label-position="left" label-width="80px" :model="formLabelAlign">
        <el-form-item prop="roomID" label="选择功能">
          <el-select style="width: 100%" v-model="formLabelAlign.type" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="formLabelAlign.type=='addLocalUser'" prop="stuNo" label="学号">
          <el-input v-model="formLabelAlign.stuNo" placeholder="输入要授权的学号"></el-input>
        </el-form-item>

        <el-form-item label-width="0">
          <el-button :loading="loading" @click="submit('Form')" style="width: 100%" type="primary">确定</el-button>
        </el-form-item>
      </el-form>

      <el-tag v-for="item in results" :key="item.value" v-show="results!='{}'" style="font-size: 15px">
        <div>{{ getInfo(item) }}</div>
        <el-button v-show="formLabelAlign.type=='getAllLocalUser'" type="primary"
                   @click="addUserByToken(item['token'])">添加到本地用户列表
        </el-button>
        <el-button v-show="formLabelAlign.type=='getAllLocalUser'" type="danger"
                   @click="cancelSeat(item['stuNo'])">删除用户
        </el-button>

        <el-button v-show="formLabelAlign.type=='getTasks'" type="danger" class="btn"
                   @click="cancelTask(item['token'])">删除任务
        </el-button>
      </el-tag>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "admin",
  data() {
    return {
      formLabelAlign: {
        type: '',
        stuNo: '',
      },
      results: [{"2": "2"}],
      loading: false,
      options: [
        {label: '查询用户', value: 'getAllLocalUser'},
        {label: '添加用户', value: 'addLocalUser'},
        {label: '任务列表', value: 'getTasks'},
      ]
    }
  },
  methods: {
    submit() {
      this.loading = true;
      this.$http.post(this.formLabelAlign.type, {
        token: localStorage.getItem('token'),
        stuNo: this.formLabelAlign.stuNo,
      }).then(r => {
        if (r.data.code == 1) {
          this.$message.error(r.data.msg);
        } else {
          this.$message.success(r.data.msg);
          this.results = r.data.data
          console.log(r.data)
        }
        this.loading = false;
      })
    },
    getInfo(item) {
      console.log(item)
      let res = '';
      if (this.formLabelAlign.type === 'getAllLocalUser') {
        console.log((this.formLabelAlign.type));
        res += item.stuNo + '\n'
        res += item.name + '\n'
        res += item.token
      } else if (this.formLabelAlign.type === 'getTasks') {
        console.log((this.formLabelAlign.type));
        res += item.name + '\n'
        res += item.seatNo + '\n'
        res += item.id + '\n'
        res += item.status
      }
      return res
    },
    cancelSeat(stuNo) {
      this.$confirm('确定要进行该操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('deleteLocalUser', {
          token: localStorage.getItem('token'),
          stuNo: stuNo
        }).then(r => {
          if (r.data.code == 0) {
            this.$message.success(r.data.msg);
          } else {
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
    },
    addUserByToken(token) {
      let tokenList = JSON.parse(localStorage.getItem('tokenList'));
      let exist = false;
      tokenList.forEach(e => {
        if (e.token === token) {
          exist = true;
        }
      })

      if (exist){
        this.$message({
          type: 'warning',
          message: '该用户已添加'
        });
        return;
      }

      localStorage.setItem('token',token);
      location.reload();
    },
    cancelTask(token) {
      this.$confirm('确定要进行该操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('deleteTask', {
          token: localStorage.getItem('token'),
          cancelToken: token
        }).then(r => {
          if (r.data.code == 0) {
            this.$message.success(r.data.msg);
          } else {
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
    },
  },
  watch: {
    'formLabelAlign.type'() {
      this.results = '';
    }
  },
  created() {
    let token = localStorage.getItem('token')
    if (token == null) {
      this.$msgbox.alert('还未登录！', '提示', {
        callback: () => {
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

.btn {
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