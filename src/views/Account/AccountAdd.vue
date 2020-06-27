<template>
  <div class="account-add">
    <card>
      <span slot="title">账号添加</span>
      <div slot="content">
        <el-form
          :model="ruleForm"
          :rules="rules"
          size="small"
          status-icon
          ref="ruleForm"
          label-width="100px"
        >
          <el-form-item label="账号" prop="account">
            <el-input v-model="ruleForm.account"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="用户组" prop="userGroup">
            <el-select v-model="ruleForm.userGroup" placeholder="请选择用户组">
              <el-option label="超级管理员" value="超级管理员"></el-option>
              <el-option label="普通管理员" value="普通管理员"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">添加</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </card>
  </div>
</template>

<script>
import card from "../../components/Card";
import { ACC_REG, PWD_REG } from "../../utils/reg";
import {addAccount} from '../../api/account'
export default {
  components: {
    card
  },
  data() {
    /**
     * rule:  一个对象, 里面有很多验证规则的信息
     * value:  用户输入的值
     * callback: 一个函数
     *    如果成功:  callback()
     *    如果失败:  callback(new Error('失败提示信息'))
     */
    // console.log("rule:", rule);
    // console.log("value:", value);
    // console.log("callback:", callback);
    const checkAcc = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入账号"));
      } else if (!ACC_REG.test(value)) {
        callback(new Error("4到16位（字母，数字，下划线，减号）"));
      } else {
        callback();
      }
    };
    const checkPwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else if (!PWD_REG.test(value)) {
        callback(new Error("4到16位（字母，数字，下划线，减号）"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        account: "",
        password: "",
        userGroup: ""
      },
      rules: {
        account: { required: true, validator: checkAcc, trigger: "blur" },
        password: { required: true, validator: checkPwd, trigger: "blur" },
        userGroup: { required: true, message: "请选择管理员", trigger: "change" }
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          // console.log("前端验证通过 发送ajax");
          let {code,userGroup}=await addAccount(this.ruleForm)
          if(code===0){
           
          this.$router.push("/account/account-list")
          }
        } else {
          console.log("填写正确在提交哦");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.el-input {
  width: 217px;
}
</style>