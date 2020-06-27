<template>
  <div class="login">
    <el-form
      :model="loginRuler"
      :rules="rules"
      ref="loginRuler"
      label-width="0px"
      class="loginRuler"
      status-icon
      @keydown.native.13="submitForm"
    >
      <p class="loginRulerTitle">登&nbsp;录&nbsp;系&nbsp;统</p>
      <el-form-item prop="account">
        <el-input
          v-model="loginRuler.account"
          prefix-icon="iconfont icon-yonghu"
          placeholder="请输入账户"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          placeholder="请输入密码"
          @click.native="changeType"
          v-model="loginRuler.password"
          prefix-icon="iconfont icon-iconmm"
          :suffix-icon="isClose ? 'iconfont icon-yanjing-bi':'iconfont icon-yanjing_kai'"
          :type="isClose ? 'password':'text'"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" round>登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { checkLogin,getRole } from "../api/account";
import local from "../utils/local.js";
export default {
  data() {
    return {
      loginRuler: {
        account: "",
        password: ""
      },
      // 验证规则
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: blur },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入账号", trigger: blur },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      // 定义一个字段 类似于标杆，来控制type 和 眼睛图片的切换  前面都要加: 动态设置
      isClose: true
    };
  },
  methods: {
    submitForm() {
      //官网 this.$refs[ruleForm].validate();
      //在实际使用中，会报错。validate未定义
      this.$refs.loginRuler.validate(async valid => {
        if (valid) {
          // console.log("前端验证通过 发送ajax");
          let { code, token ,role} = await checkLogin(this.loginRuler);
          if (code === 0) {
            // 把token存入本地
            local.set("token", token);
            local.set('role',role)
            this.$router.push("/");

          }
        } else {
          console.log("前端验证没通过");
          return false;
        }
      });
    },
    // 点击整个父亲节点  点击到眼睛时才改变isClose的状态
    changeType(e) {
      if (e.target.className.includes("icon-yanjing")) {
        this.isClose = !this.isClose;
      }
    }
  }
};

// 监听键盘按下的值
// document.addEventListener('keydown',e=>{console.log(e.keyCode);
// })
 
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background: url("../assets/imgs/14.jpg") no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  .loginRuler {
    width: 270px;
    // 框前的文字
    /*   /deep/.el-form-item__label {
      color: #fff;
    } */
    background-color: #00000068;
    padding: 80px 50px;
    .el-button--primary {
      width: 270px;
      margin-top: 30px;
      background-image: linear-gradient(to top, #9795f0 0%, #fbc8d4 100%);
      &:hover {
        background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
      }
    }
    .loginRulerTitle {
      color: #fff;
      font-size: 25px;
      text-align: center;
      line-height: 25px;
      margin-bottom: 50px;
    }
  }
}
</style>