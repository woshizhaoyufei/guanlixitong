<template>
  <div class="goods-add">
    <card>
      <span slot="title">商品添加</span>
      <div slot="content">
        <!-- 分类 -->
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.name" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select v-model="form.category" placeholder="商品分类">
              <el-option
                :label="v.cateName"
                :value="v.cateName"
                v-for="v in categories"
                :key="v.cateName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input-number v-model="form.price" @change="handleChange" :min="1" :max="10"></el-input-number>
          </el-form-item>
          <el-form-item label="商品图片">
            <el-upload
              class="avatar-uploader"
              action="http://127.0.0.1:5000/goods/goods_img_upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="form.imgUrl" :src="baseImgUrl+form.imgUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="商品描述">
            <el-input type="textarea" v-model="form.goodsDesc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">添加商品</el-button>
          </el-form-item>
        </el-form>
      </div>
    </card>
  </div>
</template>

<script>
import card from "../../components/Card";
import { getCateNameList, addGoods } from "../../api/goods";

export default {
  components: {
    card
  },
  created() {
    this.cateNames();
  },

  data() {
    return {
      value: "",
      form: { price:'',imgUrl:''},
      categories: [],
      dialogVisible: false,

      baseImgUrl:'http://127.0.0.1:5000/upload/imgs/goods_img/'
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let { code } = await addGoods(this.form);
          if (code === 0) {
            this.$router.push("/goods/goods-list");
          }
        } else {
          return false;
        }
      });
    },
    handleAvatarSuccess(res) {
      let { code, imgUrl, msg } = res;
      if (code === 0) {
        this.form.imgUrl = imgUrl; //路径绑定了form的imgUrl字段 赋值给数据内字段
        this.$message({
          type: "success",
          message: msg
        });
      }
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
    },
    async cateNames() {
      let { categories } = await getCateNameList();
      console.log(categories);
      this.categories = categories;
    },
    handleChange(value) {
        console.log(value);
      }
  }
};
</script>

<style lang="less" scoped>
.el-form-item__content {
  .el-input {
    width: 217px;
  }
}
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