<!--
 * @Author: zbx
 * @Date: 2021-09-27 16:11:15
 * @LastEditTime: 2022-04-06 11:16:16
 * @LastEditors: zbx
 * @Description: 部门管理页面
 * @FilePath: \后台系统通用\src\view\system\module.vue
-->
<template>
    <div>
        <div style="padding: 20px 0;">
            <Form 
                inline
            >
                <Button
                    icon="md-search"
                    class="ml10"
                    @click="lookUp"
                >刷新</Button>
                <Button
                    type="success" 
                    class="ml10"
                    @click="toAdd"
                >新增</Button>
            </Form>
        </div>
        <Table
            :data="tableList"
            :columns="tableColumn"
            :loading="tableLoading"
            border
            max-height="750"
            row-key="id"
        >
            <template slot="operate" slot-scope="{row}">
                <Button 
                    type="primary" 
                    @click="toEdit(row)"
                >编辑</Button>
                <Button 
                    class="ml10"
                    @click="del(row)"
                    :disabled="!!row.isDisabled"
                >禁用</Button>
            </template>
        </Table>
        <Modal
            v-model="showPageModal"
            :title="pageForm.id ? '编辑' : '新增'"
        >
            <Form
                :model="pageForm"
                :rules="pageRule"
                :label-width="120"
                ref="pageForm"
            >
               
                <FormItem prop="name" label="模块名称">
                    <Input
                        placeholder="请输入"
                        style="width: 300px;"
                        v-model="pageForm.name"
                    />
                </FormItem>
                 <FormItem prop="pid" label="所属模块">
                    <treeselect
                        v-model="pageForm.pid"
                        placeholder="请选择"
                        style="width: 300px"
                        :options="moduleTree"
                        flattenSearchResults
                    />
                </FormItem>
                 <FormItem prop="path" label="路径">
                    <Input
                        placeholder="请输入"
                        style="width: 300px;"
                        v-model="pageForm.path"
                    />
                </FormItem>
                <!-- authorityList -->
                 <FormItem prop="authorityIdArr" label="权限">
                     <Select
                        placeholder="请选择"
                        style="width: 300px;"
                        v-model="pageForm.authorityIdArr"
                        :clearable="true"
                        multiple
                    >
                        <Option :value="item.id" v-for="item in authorityList" :key="item.id" >{{item.value}}</Option>
                    </Select>
                </FormItem>
                 <FormItem prop="isDisabled" label="状态">
                     <Select
                        placeholder="请选择"
                        style="width: 300px;"
                        v-model="pageForm.isDisabled"
                    >
                        <Option :value="0">启用</Option>
                        <Option :value="1">禁用</Option>
                    </Select>
                </FormItem>
            </Form>
            <template slot="footer">
                <Button @click="closePageModal">关闭</Button>
                <Button @click="confirmPage" type="primary" :loading="confirmLoading">确定</Button>
            </template>
        </Modal>
    </div>
</template>
<script>
import {
    moduleApi
} from '@/api/system'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            // 表格列表
            tableList: [],
            // 表格配置
            tableColumn: [
                {
                    align: 'left',
                    title: '模块名称',
                    key: 'title',
                    minWidth: 150,
                    tree: true
                },
                {
                    align: 'left',
                    title: '路径',
                    key: 'path',
                    minWidth: 80,
                },
                {
                    align: 'left',
                    title: '权限',
                    key: 'authorityNameStr',
                    minWidth: 150,
                },
                {
                    align: 'center',
                    title: '操作',
                    slot: 'operate',
					minWidth: 120,
                }
            ],
            // 表格loading
            tableLoading: false,
            // 查询信息
            pageInfo: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
                data: {},
            },
            // 展示页面modal
            showPageModal: false,
            // 弹窗页面表单
            pageForm: { },
            // 弹窗页面表单规则
            pageRule: {
                name: [
                    {
                        required: false,
                        message: '请输入名字',
                        trigger: 'blur'
                    }
                ],
                path: [
                    {
                        required: false,
                        message: '请输入路径',
                        trigger: 'blur'
                    }
                ],
                authorityIdArr: [
                    {
                        required: false,
                        message: '请选择权限',
                        trigger: 'change',
                        type:'array'

                    }
                ],
            },   
            // 确认按钮loading
            confirmLoading: false,
             // 导出loading
            exportLoading: false,
            moduleTree:[],
            authorityList:[
                { id:1,value:'新增'},
                { id:2,value:'删除'},
                { id:3,value:'编辑'},
                { id:4,value:'查看'},
            ]
        }
    },
    methods: {
        // 获取表格数据
        getList() {
            this.tableLoading = true;
            moduleApi.getModList(this.pageInfo).then(res => {
                const list = res.data || [];
                list.forEach(item => {
                    item.authorityNameStr = item.authorityNames.join(',')
                    
                });
                this.tableList = list
                this.tableLoading = false;
                this.moduleTree =this.makeCompanyOptions(this.tableList)
            }).catch(err => {
                this.$Message.error(err.msg);
                this.tableLoading = false;
            });
        },
        // 制作模块树
        makeCompanyOptions(list) {
            let arr = list.map(item => {
                return {
                    id: item.id,
                    label: item.title,
                    children: (item.children && item.children.length && this.makeCompanyOptions(item.children)) || undefined
                }
            });
            return arr;
        },
         // 去新增
        toAdd() {
            this.pageForm = {
                "id": null,
                "name": null,
                "pid": null,
                "path": null,
                authorityIdArr: [],
                "isDisabled": 0,
            }
            this.$refs.pageForm.resetFields();
            this.showPageModal = true;
        },
        // 去编辑
        toEdit(r = {}) {
            // 根节点为0，0的时候前端置为null
            this.pageForm = {
                "id": r.id,
                "name": r.title,
                "pid": r.pid || null,
                "path": r.path,
                authorityIdArr : r.authorityIds || [],
                "isDisabled":r.isDisabled || 0,

            }
            this.$refs.pageForm.resetFields();
            this.showPageModal = true;
            
        },
        // 确认
        confirmPage() {
            console.log('this.pageForm:',this.pageForm);
            this.pageForm.authorityIds = this.pageForm.authorityIdArr.join(';') || null
            this.$refs.pageForm.validate(v => {
                if (v) {
                    // 编辑
                    if (this.pageForm.id) {
                        this.edit();
                    // 添加
                    } else {
                        this.add();
                    }
                }else{
                    console.log('校验失败');
                }
            });
        },
        
        // 添加
        add() {
            this.confirmLoading = true;
             moduleApi.addModule({
                 ...this.pageForm,
                pid: this.pageForm.pid || 0

            }).then(res => {
                this.$Message.success('添加成功');
                this.confirmLoading = false;
                this.showPageModal = false;
                this.getList();
            }).catch(err => {
                this.$Message.error(err.msg);
                this.confirmLoading = false;
            });
        },
        // 编辑
        edit() {
            this.confirmLoading = true;
            moduleApi.updateMod({
                 ...this.pageForm,
                pid: this.pageForm.pid || 0
                 
            }).then(res => {
                this.$Message.success('编辑成功');
                this.confirmLoading = false;
                this.showPageModal = false;
                this.getList();
            }).catch(err => {
                this.$Message.error(err.msg);
                this.confirmLoading = false;
            });
        },
        
        // 关闭弹窗
        closePageModal() {
            this.showPageModal = false;
        },
        // 删除、禁用
        del(r) {
            this.$Modal.confirm({
                title: '提示',
                content: '确定禁用此条数据吗？',
                loading: true,
                onOk: () => {
                    moduleApi.deleteMod({
                        id: r.id
                    }).then(res => {
                        this.$Message.success('禁用成功');
                        this.$Modal.remove();
                        this.getList();
                    }).catch(err => {
                        this.$Message.error(err.msg);
                        this.$Modal.remove();
                    });
                }
            });
        },
        // 切换页面
        changePage(p) {
            this.pageInfo.pageNum = p;
            this.getList();
        },
        // 且页面大小
        changePageSize(ps) {
            this.pageInfo.pageSize = ps;
            this.pageInfo.pageNum = 1;
            this.getList();
        },
        // 查询
        lookUp() {
            this.pageInfo.pageNum = 1;
            this.getList();
        },
        // 重置
        reset() {
            this.pageInfo.data = {};
            this.pageInfo.pageNum = 1;
            this.getList();
        }
    },
    mounted() {
        this.getList();
    }
}
</script>