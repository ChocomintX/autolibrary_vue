<template>
  <el-container>
    <el-main>
      <el-tag style="margin-top: -20px" type="success" v-show="show">
        <div id="showInfo" >
          <h1 style="color: green">查询成功！</h1>
          <div>
            你想要找的或许是<span>{{ info.department }}</span><span>{{ info.id.slice(0, 2) }}级</span><span>{{ info.id.slice(6, 8) }}班</span>的<span>{{ info.name }}</span>同学!
          </div>
          <div>
            ta在<span>{{ info.startTime.split(' ')[1] }}</span>就已经来了图书馆，<span>{{ info.endTime.split(' ')[1] }}</span>应该就要走了
          </div>
          <div>
            <b>还不抓住机会搭个讪吗？</b>
          </div>
        </div>
      </el-tag>
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
          <el-input v-model="formLabelAlign.seatID" placeholder="输入地图上显示的数字即可 例:45"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button :loading="loading" id="search" type="primary" @click="search" style="width: 100%">查询当前座位用户</el-button>
        </el-form-item>
        <el-form-item label-width="0">
          <img id="searchImg" src="../assets/searchSeat.gif">
        </el-form-item>
      </el-form>

      <el-progress v-show="false" :text-inside="true" :stroke-width="24" :percentage="process" :status="status"></el-progress>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "searchSeat",
  data() {
    return {
      formLabelAlign: {
        roomID: '',
        seatID: ''
      },
      status: 'warning',
      process: 0,
      seatNo: '',
      show: false,
      loading: false,
      info: {
        id: '',
        department: '',
        startTime: '',
        endTime: '',
        name: ''
      },
      options: this.$rooms
    }
  },
  methods: {
    search() {
      // const loading = this.$loading({
      //   lock: true
      // });
      if (this.formLabelAlign.seatID == '' || this.formLabelAlign.roomID == '') {
        this.$message({
          type: 'error',
          message: `请输入完整的信息`
        });
        return;
      }

      this.loading=true;
      if (this.process >= 100 || this.process === 0) {
        this.status = 'warning';
        this.process = 0;

        this.$http.post('searchSeat', {
          roomID: this.formLabelAlign.roomID,
          seatID: this.formLabelAlign.seatID
        }).then(r => {
          this.loading=false;
          this.show=false;
          if (Object.keys(r.data).length > 0) {
            // let interval = setInterval(() => {
            //   this.process += 1;
            //   if (this.process >= 100) {
            //     clearInterval(interval);
            //     this.status = 'success';
            //     this.info = r.data;
            //     this.show = true;
            //   }
            //   //do whatever here..
            // }, 30);

            this.status = 'success';
            this.info = r.data;
            this.show = true;
          }else {
            this.$message.warning('未查询到相关信息！')
          }
        }).finally(()=>{
          this.loading=false;
        })
      }

    }
  }
}
</script>

<style scoped>
#showInfo > h1 {
  margin-top: 10px;
}

#showInfo > div {
  margin-top: 10px;
}

#showInfo span {
  color: red;
  font-family: 黑体;
}

#searchImg{
  width: 100%;
  margin-top: -10px;
  margin-bottom: -40px;
}

.el-tag{
  height: auto;
  width: 100%;
  white-space:normal;
  word-break: break-all;
  margin-bottom: 20px;
  font-size: 15px;
}

</style>