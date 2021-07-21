<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table 
      :data="rolesList"
      stripe
      border>
        <!-- 展开列 -->
        <el-table-column
          label=""
          type="expand">
          <template v-slot="scope">
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id"
            :class="['bd-bottom',i1==0?'bd-top':'','vcenter']">
              <!-- 渲染一级权限 -->
              <el-col :span="5" >
                <el-tag @close="removeRight(scope.row,item1.id)" closable>
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id"
                :class="[i2==0?'':'bd-top','vcenter']">
                  <el-col :span="6">
                    <el-tag type="success" closable
                    @close="removeRight(scope.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                        <el-tag v-for="(item3) in item2.children" :key="item3.id" type="warning" closable
                        @close="removeRight(scope.row,item3.id)">
                          {{item3.authName}}
                        </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column
          label="#"
          type="index">
        </el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName">
        </el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc">
        </el-table-column>
        <el-table-column
          label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table >
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
    title="分配权限"
    :visible.sync="showSetRightDialogVisible"
    width="50%"
    @close="defKeys=[]">
    <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"
    ref="treeRef"></el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showSetRightDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="allotRights">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      rolesList:[],
      showSetRightDialogVisible:false,
      rightsList:[],
      // 树形控件的数据该怎么取
      treeProps:{
        children:'children',
        label:'authName'
      },
      defKeys:[],
      roleId:'',
    } 
  },
  created(){
    this.getRolesList();
  },
  methods:{
    async getRolesList(){
      const {data:res}=await this.$http.get('roles');
      if(res.meta.status!=200){
        return this.$message.error('获取角色信息失败');
      }
      this.rolesList=res.data;
    },
    async removeRight(roleId,rightId){
        const confirmResult=await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err);

        if(confirmResult!='confirm'){
          return this.$message.info('取消了删除');
        }

        const {data:res}=await this.$http.delete(`roles/${roleId}/rights/${rightId}`);
        if(res.meta.status!=200){
          return this.$message.error('删除权限失败');
        }
        // this.getRolesList();
        role.children=res.data;

    },
    async showSetRightDialog(data){
      this.roleId=data.id;
      // 在显示对话框之前获网络请求数据
      const {data:res}=await this.$http.get('rights/tree');
      if(res.meta.status!=200){
        return this.$message.error('获取权限失败');
      }
      this.rightsList=res.data;
      console.log(this.rightsList);
      this.getLeafKeys(data,this.defKeys);
      this.showSetRightDialogVisible=true;
    },
    getLeafKeys(node,arr){
      if(!node.children){
        return arr.push(node.id);
      }
      node.children.forEach(item => 
       this.getLeafKeys(item,arr)
      );
    },
    async allotRights(){
      const keys=[...this.$refs.treeRef.getCheckedKeys(),
      ...this.$refs.treeRef.getHalfCheckedKeys()];

      const idStr=keys.join(',');
      // console.log(idStr);
      const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr});
      if(res.meta.status!=200){
        return this.$message.error('分权限失败');
      }
      this.$message.success('分权限成功');
      this.getRolesList();
      this.showSetRightDialogVisible=false;
    }
  }

}
</script>

<style>
.bd-top{
  border-top: 1px solid #eee;
}
.bd-bottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>