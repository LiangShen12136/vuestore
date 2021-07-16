<template>
  <el-container>
    <el-header class="header">
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商管理系统</span>
      </div>
      <el-button type="info"  @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isfoding?'64px':'200px'" overflow="hidden">
        <!-- 折叠按钮 -->
        <div class="folding-button" @click="foding" >|||</div>
         <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409BFF"
            unique-opened
            :collapse="isfoding"
            :collapse-transition=false
            router
            :default-active="$router.path">
            <!-- 一级导航栏 -->
            <el-submenu :index="'/'+item.path" v-for="item in menuList" :key="item.id">
              <!-- 一级导航栏的模板 -->
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级导航栏 -->
                <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                <!-- @click="saveNavStatus('/'+subItem.path)" -->
                  <!-- 二级导航栏的模板 -->
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{subItem.authName}}</span>
                  </template>
                </el-menu-item>
            </el-submenu>
      
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created(){
    this.getMenuList();
    // this.activePath=window.sessionStorage.getItem('activePath');
  },
  data(){
    return{
      menuList:[],
      iconsObj:{
        '125':'iconfont icon-users',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao',
      },
      isfoding:false,
      activePath:'',
    }
  },
  methods:{
    logout(){
      window.sessionStorage.removeItem('token');
      this.$router.push('/login');
    },
    async getMenuList(){
      const {data:res}=await this.$http.get('menus');
      
      if(res.meta.status!=200) return this.$message.error(this.meta.msg);
      this.menuList=res.data;
      // console.log(this.menuList);
    },
    foding(){
      this.isfoding=!this.isfoding;
    },
    // saveNavStatus(activePath){
    //   window.sessionStorage.setItem('activePath',activePath);
    //   this.activePath=activePath;
    // }
  }
}
</script>

<style lang="less" scoped>
.el-header{
  display: flex;
  justify-content: space-between;
  
  background: #373d41;
  color: white;
  font-size: 20px;
  align-items: center;
  padding-left: 0;
}
.el-header div{
  display: flex;
  align-items: center;
}
.el-aside{
  background: #333744;
}
.el-main{
  background: #eaedf1;
}
.el-container{
  height: 100%;
}
.iconfont{
  margin-right:10px ;
}
.folding-button{
  background: #4a5064;
  font-size: 10px;
  height: 24px;
  width: 100%;
  line-height: 24px;
  color: white;
  text-align: center;
  
}
</style>