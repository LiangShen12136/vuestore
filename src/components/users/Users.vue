<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
    <div>
      <el-row :gutter="20">
        <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="usersInfo.query" clearable @clear="getUsersList">
              <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
            </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table 
      :data="userList" 
      stripe
      border>
        <el-table-column
          label="#"
          type="index">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="mg_state"
          label="状态">
          <template v-slot="scope">
            <!-- scope.row就是本行的数据 -->
            <el-switch
              v-model="scope.row.mg_state" @change="usersStatusChange(scope.row)">
            </el-switch>
          </template>

        </el-table-column>
        <el-table-column
          label="操作" width="180px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size='mini' @click="editUserShow(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size='mini' @click="deleteUserById(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size='mini'></el-button>
            </el-tooltip>
          </template>
          
        </el-table-column>
      </el-table>

      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="usersInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="usersInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
    </div>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
    title="添加用户"
    :visible.sync="dialogVisible"
    width="50%"
    @close="resetForm">
      <!-- 对话框主体区域 -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="70px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="ruleForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
  title="修改用户"
  :visible.sync="editDialogVisible"
  width="50%"
  @close="editDialogClosed">

  <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="70px">
    <el-form-item label="用户名">
      <el-input v-model="editUserForm.username" disabled></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="editUserForm.email"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model="editUserForm.mobile"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserCommit">确 定</el-button>
  </span>
</el-dialog>
  </div>


  

</template>

<script>
export default {
  created(){
    this.getUsersList();
  },
  data(){
    // 检验邮箱是否合法
    var checkEmail=(rule,value,callback)=>{
      const regEmail=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if(regEmail.test(value)){
        return callback();
      }
      callback(new Error('请输入合法的邮箱'));
    }
    // 检验手机号是否合法
    var checkMobile=(rule,value,callback)=>{
      const regMobile=/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if(regMobile.test(value)){
        return callback();
      }
      callback(new Error('请输入合法的手机号'));
    }
    return {
      usersInfo:{
        query:'',
        // 
        pagenum:1,
        // 当前每页显示多少条数字
        pagesize:2,
      },
      userList:[],
      total:0,
      dialogVisible:false,
      ruleForm:{
        username:'',
        password:'',
        email:'',
        mobile:'',
      },
      rules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // 添加自定义的邮箱验证规则
          { validator: checkMobile, trigger: 'blur' }
        ],
      },
      editDialogVisible:false,
      // 获取到的用户信息
      editUserForm:{},
      // 修改用户信息的表单验证
      editUserFormRules:{
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // 添加自定义的邮箱验证规则
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },

  methods:{
    async getUsersList(){
      const {data:res}=await this.$http.get('users',{params:this.usersInfo});
      if(res.meta.status!=200) return this.$message.error('获取用户列表失败');
      this.userList=res.data.users;
      this.total=res.data.total;
      // console.log(res);
    },
    // 监听每页显示多少条数字的改变
    handleSizeChange(newSize){
      // console.log(newSize);
      this.usersInfo.pagesize=newSize;
      this.getUsersList();
    },
    // 监听当前页码的改变
    handleCurrentChange(newPage){
      // console.log(newPage);
      this.usersInfo.pagenum=newPage;
      this.getUsersList();
    },
    async usersStatusChange(info){
      // console.log(info);
      const {data:res}=await this.$http.put(`users/${info.id}/state/${info.mg_state}`);
      if(res.meta.status!=200){
        info.mg_state=!info.mg_state;
        return this.$message.error('更新用户状态失败');
      }
      this.$message.success('更新用户状态成功');

    },
    // 重置对话框内的表单
    resetForm(){
      this.$refs.ruleFormRef.resetFields();
    },
    // 添加用户
    addUser(){
      this.$refs.ruleFormRef.validate(async value=>{
        // console.log(value);
        if(!value) {
          return 
        }
        // 表单预验证通过，发起网络请求
        const {data:res}=await this.$http.post('users',this.ruleForm);
        if(res.meta.status!=201){
          return this.$message.error('添加用户失败');
        }
        this.$message.success('添加用户成功 ');
        this.dialogVisible=false;
        this.getUsersList();
      })
    },
    async editUserShow(id){
      const {data:res}=await this.$http.get('users/'+id)
      if(res.meta.status!=200) {
        return this.$message.error('获取用户信息失败');
      }
      this.editUserForm=res.data;
      this.editDialogVisible=true;
      // console.log(this.editUserForm);
    },
    // 修改用户对话框关闭时回调
    editDialogClosed(){
      this.$refs.editUserFormRef.resetFields();
    },
    editUserCommit(){
      this.$refs.editUserFormRef.validate(async value=>{
        if(!value){
          return 
        }
        const {data:res}=await this.$http.put('users/'+this.editUserForm.id,this.editUserForm);
        if(res.meta.status!=200){
          return this.$message.error('提交编辑用户信息失败');
        }
        // 关闭对话框
        this.dialogVisible=false;
        // 更新用户列表
        this.getUsersList();
        // 弹出成功消息
        this.$message.success('提交编辑用户信息成功');

      })
    },
    async deleteUserById(id){
        const res=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err);
        // console.log(res);
        if(res!='confirm'){
          return this.$message.info('已取消删除');
        }
        const {data:result}=await this.$http.delete('users/'+id);
        if(result.meta.status!=200){
          return  this.$message.error('删除用户失败');
        }
        this.$message.success('删除用户成功');
        this.getUsersList();
    }
  }
}
</script>

<style>

</style>