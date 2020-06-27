<template>
  <div class="account-pwd">
    <card>
      <span slot="title">修改密码</span>
      <div slot="content">
        <el-form
          :model="ruleForm"
          :rules="rules"
          size="small"
          status-icon
          ref="ruleForm"
          label-width="100px"
        >
          <el-form-item label="原密码" prop="oldPwd">
            <el-input v-model="ruleForm.oldPwd"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model="ruleForm.newPwd"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="cnewPwd">
            <el-input v-model="ruleForm.cnewPwd"></el-input>
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
import { PWD_REG } from "../../utils/reg";
import local from '../../utils/local'
import { changePwd, changeNewPwd } from "../../api/account";
export default {
  components: {
    card
  },
  data() {
    const checkoldPwd = async (rule, value, callback) => {
      // 问后台要旧密码 先写死
      if (!value) {
        callback(new Error("请输入旧密码"));
      } else {
        let { code, msg } = await changePwd({ oldPwd: this.ruleForm.oldPwd });
        if (code == "00") {
          // this.$message({
          //   type: "success",
          //   message: msg
          // });
          // this.getAccData()
          callback();
        } else {
          callback(new Error(msg));
        }
      }
    };
    const checkPsd = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入新密码"));
      } else if (!PWD_REG.test(value)) {
        callback(new Error("4到16位（字母，数字，下划线，减号）"));
      } else {
        // 如果确认新密码 输入了值 才触发对一个字段的验证 validateField	对部分表单字段进行校验的方法
        //  validateField(array | string) 
        if (this.ruleForm.cnewPwd) {
          this.$refs.ruleForm.validateField("cnewPwd");
        }
        callback();
      }
    };
    const checkCpsd = (rule, value, callback) => {
      if (!value) {
        callback(new Error("确认新密码"));
      } else if (value !== this.ruleForm.newPwd) {
        callback(new Error("密码不一致"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        oldPwd: "",
        newPwd: "",
        cnewPwd: ""
      },
      rules: {
        oldPwd: { required: true, trigger: "blur", validator: checkoldPwd },
        newPwd: { required: true, trigger: "blur", validator: checkPsd },
        cnewPwd: { required: true, trigger: "blur", validator: checkCpsd }
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let { code} = await changeNewPwd({
            newPwd: this.ruleForm.newPwd
          });
          if (code === 0) {
            local.clear();

            this.$router.push("/login");
          } 
        } else {
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