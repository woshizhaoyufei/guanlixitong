<template>
  <div class="account-msg">
    <card>
      <!-- 标题 -->
      <span slot="title">管理员信息</span>
      <div slot="content">
        <!-- 内容 -->
        <template>
          <span>管理员id:{{info.id}}</span>
          <el-divider></el-divider>
          <span>账户:{{info.account}}</span>
          <el-divider></el-divider>
          <span>用户组:{{info.userGroup}}</span>
          <el-divider></el-divider>
          <span>创建时间:{{info.ctime|filterTime}}</span>
          <el-divider></el-divider>

          <div>
            管理员头像：
            <el-upload
              class="avatar-uploader"
              action="http://127.0.0.1:5000/users/avatar_upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imgUrl" :src="baseUrl+imgUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-button type="primary" @click="savePic">修改头像</el-button>
          </div>
        </template>
      </div>
    </card>
  </div>
</template>
  

<script>
import card from "../../components/Card";
// import {personMsg} from "../../api/account"
import moment from "moment";
import local from "../../utils/local";
import { changePic } from "../../api/account";

export default {
  components: {
    card
  },
  data() {
    return {
      info: {},
      baseUrl: "http://127.0.0.1:5000/upload/imgs/acc_img/",
      imgUrl: ""
    };
  },
  methods: {
    handleAvatarSuccess(res) {
      let { code, msg, imgUrl } = res;
      if (code === 0) {
        this.imgUrl = imgUrl;

        this.$message({
          type: "success",
          message: msg
        });
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    async savePic() {
    let{code}=  await changePic({ imgUrl: this.imgUrl });
      if(code===0){
        // 不需传数据
        this.$bus.$emit('touppdatapic')
      }
    }
  },
  created() {
    /* let{accountInfo}= await personMsg()
    // console.log(id);

    this.info=accountInfo */
    this.info = local.get("info");
  },
  filters: {
    filterTime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  &:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 16px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
}
</style>