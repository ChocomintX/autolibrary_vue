<template>
  <el-container>
    <el-header id="head" height="50px">
      <div>座位预约记录</div>
      <i @click="$router.go(-1)" class="el-icon-arrow-left" style="padding-left: 10px;position: relative"></i>
    </el-header>
    <el-main id="showSeats">
      <el-tag v-for="(item,i) in seats" :key="item.Id">
        <div class="seatHead">
          {{i+1}}.座位编号：{{item.SeatInfo_Code}}
        </div>
        <div class="attribute">
          约座时间：{{item.BookDate}}
        </div>
        <div class="attribute">
          座位地址：{{item.AddressName}}
        </div>
        <div class="attribute">
          预约时间：{{item.StartTime1}}-{{item.EndTime1}}
        </div>
        <div class="attribute">
          预约状态：{{item.StatusCN}}
        </div>
        <div class="button-group">
          <el-button type="danger" @click="cancelSeat(item,2)" v-show="item.StatusCN=='已签到'">释放座位</el-button>
          <el-button type="warning" @click="cancelSeat(item,3)" v-show="item.StatusCN=='未签到'">取消预约</el-button>
          <el-button type="success" @click="sign" v-show="item.StatusCN=='未签到'">立即签到</el-button>
        </div>
<!--        {{item}}-->
<!--        {{i}}-->
      </el-tag>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "mySeats",
  data(){
    return{
      seats:[]
    }
  },
  methods:{
    getSeats(){
      this.$http.post('getAllSeatsByUser', {
        token: localStorage.getItem('token')
      }).then(r => {
        let data = r.data;
        console.log(data);
        this.seats=data;
        // if (data.code == 0) {
        //   this.$msgbox.alert('签到成功！', '提示');
        // } else {
        //   this.$msgbox.alert('签到失败！请检查是否在预约前后十五分钟内', '提示');
        // }
      })
    },
    cancelSeat(item,type){
      let id=item['Id'];
      let roomId=item['SeatInfo_Code'].substring(7,11);
      let seatNo=item['SeatInfo_Code'].substring(11,15);
      console.log(roomId+','+seatNo);
      this.$confirm('确定要进行该操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('cancelSeat',{
          token:localStorage.getItem('token'),
          id:id,
          roomID:roomId,
          seatNo:seatNo,
          type:type
        }).then(r=>{
          if(r.data.code==0){
            this.$message.success(r.data.msg);
          }else{
            this.$message.error(r.data.msg);
          }
          this.getSeats();
          // this.submit('Form');
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    sign(){
      this.$http.post('sign',{
        token:localStorage.getItem('token')
      }).then(r=>{
        if(r.data.code==0){
          this.$message.success(r.data.msg);
        }else{
          this.$message.error(r.data.msg);
        }
        this.getSeats();
        // this.submit('Form');
      })
    }
  },
  created() {
    this.getSeats();
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

#head {
  background-color: rgb(64, 158, 255);
  color:white;
  display: -webkit-flex;
  align-items: center;
  font-size: 20px;
}

#head>div{
  font-size: 15px;
  width: 100%;
  position: absolute;
  text-align: center;
}

#showSeats .attribute{
  padding-left: 20px;
}

#showSeats .button-group{
  text-align: right;
}

.el-button {

  padding: 6px 5px;
  font-size: 5px;
  border-radius: 2px;
}

.seatHead{
  font-size: 15px;
  font-weight: bold;
}
</style>