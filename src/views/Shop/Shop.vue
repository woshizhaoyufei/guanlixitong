<template>
  <div class="shop">
    <card>
      <span slot="title">
        店铺管理
        <el-button
          size="mini"
          type="primary"
          @click="onSubmit"
          style="float:right"
        >{{disabled?'编辑':"保存"}}</el-button>
      </span>
      <div slot="content">
        <!-- 分类 -->
        <el-form
          :disabled="disabled"
          ref="form"
          :model="form"
          size="small"
          label-width="80px"
          :label-position="labelPosition"
        >
          <el-form-item label="店铺名称">
            <el-input v-model="form.name" placeholder="店铺名称"></el-input>
          </el-form-item>
          <el-form-item label="店铺公告">
            <el-input type="textarea" v-model="form.bulletin"></el-input>
          </el-form-item>
          <el-form-item label="店铺头像">
            <el-upload
              class="avatar-uploader"
              action="http://127.0.0.1:5000/shop/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imgUrl" :src="baseUrl+imgUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="店铺图片">
            <el-upload
              action="http://127.0.0.1:5000/shop/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :on-success='handleImgSuccess'
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>

          <el-form-item label="配送费">
            <el-input v-model="form.deliveryPrice" placeholder="店铺名称"></el-input>
          </el-form-item>
          <el-form-item label="配送时间">
            <el-input v-model="form.deliveryTime" placeholder="配送时间"></el-input>
          </el-form-item>
          <el-form-item label="配送描述">
            <el-input v-model="form.description" placeholder="配送描述"></el-input>
          </el-form-item>
          <el-form-item label="店铺评分">
            <el-input v-model="form.score" placeholder="店铺评分"></el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input v-model="form.sellCount" placeholder="销量"></el-input>
          </el-form-item>
          <el-form-item label="活动">
            <el-checkbox-group v-model="form.supports">
              <el-checkbox label="在线支付满28减5" name="activity"></el-checkbox>
              <el-checkbox label="VG无限橙汁全场8折" name="activity"></el-checkbox>
              <el-checkbox label="单人精彩套餐" name="activity"></el-checkbox>
              <el-checkbox label="特价饮品8折抢购" name="activity"></el-checkbox>
              <el-checkbox label="单人特色套餐" name="activity"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="营业时间" required>
            <el-time-picker
              is-range
              v-model="form.date"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            ></el-time-picker>
          </el-form-item>
        </el-form>
      </div>
    </card>
  </div>
</template>

<script>
import card from "../../components/Card";
import { shopList, shopEdit } from "../../api/shop";

export default {
  components: {
    card
  },
  data() {
    return {
      disabled: true,
      form: {
        supports: [],
        date: []
      },
      rulers: {
        activity: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ]
      },
      labelPosition: "right",
      imgUrl: "",
      dialogVisible: false,
      dialogImageUrl: "",
      baseUrl: "http://127.0.0.1:5000/upload/shop/",
      pics: [], //图片名字列表
      fileList: [] //图片列表
    };
  },

  methods: {
    onSubmit() {
      this.disabled = !this.disabled;
      if (this.disabled) {
        console.log("发送ajax");
        this.goEdit()
      }
    },
    handleAvatarSuccess(res, file) {
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
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.pics.splice(this.pics.indexOf(file.name), 1);
    },
    handlePictureCardPreview(file) {
       this.dialogImageUrl = file.url;
        this.dialogVisible = true;
    },
    handleImgSuccess(res){
      this.pics.push(res.imgUrl)

    },
    // 修改
    async goEdit() {
     
      
      let { code } = await shopEdit({
        id: this.form.id,
        name: this.form.name,
        bulletin: this.form.bulletin,
        avatar: this.imgUrl,
        deliveryPrice: this.form.deliveryPrice,
        deliveryTime: this.form.deliveryTime,
        description:this.form.description,
        score:this.form.score,
        sellCount:this.form.sellCount,
        supports:JSON.stringify(this.form.supports),
        date:JSON.stringify(this.form.date),
        pics:JSON.stringify(this.pics)
        // 传名字
      });

      if(code===0){
        this.disabled=!this.disabled
      }
    },
    // 获取店铺详情
    async getShop() {
      let { data } = await shopList();
      console.log(data);
      this.form = data;
      this.imgUrl = data.avatar;
      // 保存图片的名字
      this.pics = data.pics;
      // 回填店铺图片列表
      let arr = [];
      data.pics.forEach(v=> {
        arr.push({
          name: v,
          url: this.baseUrl + v
        });
      });
      this.fileList = arr;
    }
  },
  created() {
    this.getShop();
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
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
.el-form-item {
  width: 400px;
}
</style>