<template>
  <div class="Login_container">
      <div class="login_box">
        <!-- 头像区域 -->
        <div class="head_portait_box">
          <img src="../assets/logo.png" alt="">
        </div>
        <!-- 表单区域 -->
        <el-form ref="loginFormRef" class="login_form" :model='loginForm' :rules="loginFormRules">
          <el-form-item prop="username">
            <el-input prefix-icon="el-icon-user" v-model="loginForm.username" ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type='password' ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="loginFormReset">重置</el-button>
          </el-form-item>
          </el-form>
      </div>

  </div>
</template>

<script>
export default {
  data(){
    return{
      loginForm:{
        username:'admin',
        password:'123456',
      },
      loginFormRules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods:{
    // 重置是回到初始值
    loginFormReset(){
      this.$refs.loginFormRef.resetFields();
    },
    login(){
      this.$refs.loginFormRef.validate(async valid=>{
        // console.log(valid);
        if(!valid) return;
        const {data:res}=await this.$http.post("login",this.loginForm);
        // console.log(res);
        if(res.meta.status!=200) return this.$message.error("登录失败");
        this.$message.success("登录成功");
        // 登录成功之后返回的res里面有token
        // console.log(res);
        // 1.将token存在sessionStorage里
        window.sessionStorage.setItem("token",res.data.token);
        // 2.deng
        this.$router.push("/home");
      })
    }
  }
}
</script>

// 加入scoped之后，改样式只对该组件生效
<style  lang="less" scoped>
.Login_container{
    background: #2b4b6b;
    height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background: white;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50% );
}
.head_portait_box{
  position: absolute;
  left:50%;
  transform: translate(-50%,-50%);
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  background: white;
}
.head_portait_box img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  
}
.login_form{
  position:absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>