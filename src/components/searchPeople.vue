<template>
  <el-container>
    <el-main>
      <el-form :rules="rules" ref="Form" label-position="left" label-width="80px" :model="formLabelAlign">

        <el-form-item prop="name" label="座位号">
          <el-input v-model="formLabelAlign.name" placeholder="输入想找的同学姓名(支持模糊查询)"></el-input>
        </el-form-item>

        <el-form-item label-width="0">
          <el-button :loading="loading" @click="submit('Form')" style="width: 100%"
                     type="primary">查询
          </el-button>
        </el-form-item>


        <el-tag type="danger">
          tips：查询时间较长，一般查完所有自习室在几分钟左右！
        </el-tag>

        <el-form-item label-width="0">
          <el-progress status="success" :text-inside="true" :stroke-width="26" :percentage="progress"></el-progress>
        </el-form-item>

        <el-tag v-show="result.length>0" style="font-size: 15px">
          <b style="font-size: 18px">你要找的人可能是：</b>
          <div v-for="(item,index) in result" :key="item.value">
            {{ getInfo(item, index) }}
          </div>
        </el-tag>
      </el-form>

    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "searchPeople",
  data() {
    return {
      progress: 0,
      formLabelAlign: {
        name: ''
      },
      loading: false,
      result: [],
      rules: {
        name: [{required: true, message: '请输入姓名 只有一部分也行', trigger: 'blur'}]
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

          this.$http.post('searchPeople', {
            token: token,
            name: this.formLabelAlign.name
          }).then(r => {
            if (r.data.code == 0) {
              this.$message.success('请求成功！');
              setTimeout(()=>location.reload(),1000)
            }
          })


        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getInfo(item, index) {
      if(this.result.length==0)
        return '';
      let room = item.SeatInfo_Code.substring(7, 11);
      let seat = item.SeatInfo_Code.substring(12, 15).replace('0', '');
      let time = item.StartTime.split(' ')[1] + '-' + item.EndTime.split(' ')[1];
      this.$rooms.forEach(i => {
        if (i.value == room)
          room = i.label;
      })

      let str = '姓名：' + item.real_name
          + '\n地点：' + room
          + '\n座位号：' + seat
          + '\n预约时间：' + time;

      if (index !== this.result.length - 1)
        str += '\n\n'

      return str
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
    // const load = this.$loading(
    //     {
    //       lock: true,
    //       text: '获取查询进度中...'
    //     }
    // )


    let id = setInterval(() => {
      this.$http.post('isSearchPeople', {
        token: token
      }).then(r => {
        let data = r.data;
        console.log(data);
        if (data.code == 0) {
          if (data.results.status == 1) {
            this.loading = true;
            this.progress = Math.round(data.results.count / 1700 * 100);
          } else {
            this.loading = false;
            this.progress = 100;
            clearInterval(id)
          }
          this.result = data.results.list;
        }else {
          clearInterval(id)
        }
      })
    }, 2000)
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
}


</style>