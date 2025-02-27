<!--
 * @Author: zbx
 * @Date: 2021-09-27 16:11:15
 * @LastEditTime: 2022-04-27 15:32:09
 * @LastEditors: zbx
 * @Description: 角色管理页面
 * @FilePath: \management\src\view\system\roleManagement.vue
-->
<template>
	<div >
		<div style="padding: 20px 0">
			<Form inline>
				<FormItem>
					模糊搜索:
					<Input
						placeholder="请输入"
						clearable
						style="width: 200px"
						v-model="pageInfo.data.keyword"
					/>
				</FormItem>
				<Button icon="md-search" class="ml10" @click="lookUp"
					>查询</Button
				>
				<Button
					type="primary"
					class="ml10"
					@click="toAdd"
					>新增</Button
				>
			</Form>
		</div>
		<Table
			:data="tableList"
			:columns="tableColumn"
			:loading="tableLoading"
			max-height="750"
		>
			<template slot="operate" slot-scope="{ row }">
				<Button
					type="warning"
					@click="toEdit(row)"
					icon="md-create"
				></Button>
				<Button
					type="error"
					@click="del(row)"
					class="ml10"
					icon="ios-trash-outline"
				></Button>
				<Button
					type="success"
					@click="toAuth(row)"
					class="ml10"
					>授权</Button
				>
			</template>
		</Table>
		<div style="padding: 20px 0; text-align: right">
			<Page
				:current="pageInfo.currPage"
				:page-size="pageInfo.pageSize"
				:total="pageInfo.total"
				show-elevator
				show-total
				show-sizer
				:page-size-opts="[10, 30, 50]"
				@on-change="changePage"
				@on-page-size-change="changePageSize"
			></Page>
		</div>

		<Modal v-model="showPageModal" :title="pageForm.id ? '编辑' : '新增'">
			<Form
				:model="pageForm"
				:rules="pageRule"
				:label-width="120"
				ref="pageForm"
			>
				<FormItem prop="roleCode" label="角色编码">
					<Input
						placeholder="请输入"
						style="width: 320px"
						v-model="pageForm.roleCode"
						:disabled="!!pageForm.id"
					/>
				</FormItem>
				<FormItem prop="roleName" label="角色名称">
					<Input
						placeholder="请输入"
						style="width: 320px"
						v-model="pageForm.roleName"
					/>
				</FormItem>
				<FormItem prop="description" label="角色描述">
					<Input
						placeholder="请输入"
						style="width: 320px"
						v-model="pageForm.description"
					/>
				</FormItem>
			</Form>
			<template slot="footer">
				<Button @click="showPageModal = false">关闭</Button>
				<Button
					@click="confirmPage"
					type="primary"
					:loading="confirmLoading"
					>确定</Button
				>
			</template>
		</Modal>
		<!-- 防止价值组合
对于非固定和多选模式，如果选中了分支节点及其所有后代，则vue-treeselect会将它们组合到值数组中的单个项目中，如以下示例所示。通过使用valueConsistsOf道具，您可以更改该行为。该道具有四个选项：

"ALL" - 选中的所有节点都将包含在 value 数组中
"BRANCH_PRIORITY"（默认）-如果选中了分支节点，则其所有后代将被排除在value 数组之外
"LEAF_PRIORITY" - 如果选中了分支节点，则此节点本身及其分支后代将从value阵列中排除，但其叶后代将包括在内
"ALL_WITH_INDETERMINATE" -选中的任何节点将包括在value 数组中，另外还有不确定的节点 -->
		<!-- <Modal v-model="showPageModal2" :title="'权限配置'">
			<Form
				:model="pageForm2"
				:rules="pageRule2"
				:label-width="120"
				ref="pageForm2"
				class="authModal"
			>
				<FormItem prop="moduleAuthoritys" label="模块权限">
					<treeselect
						:multiple="true"
						:limit="3"
						v-model="pageForm2.moduleAuthoritys"
						placeholder="请选择"
						style="width: 320px"
						:options="moduleTree"
						value-consists-of="ALL_WITH_INDETERMINATE"
						flattenSearchResults
					/>
				</FormItem>
			</Form>
			<template slot="footer">
				<Button @click="showPageModal2 = false">关闭</Button>
				<Button
					@click="confirmChange"
					type="primary"
					:loading="confirmLoading"
					>确定</Button
				>
			</template>
		</Modal> -->

		<Drawer
			v-model="drawerFlag"
			placement="right"
			width="500"
			title="权限配置"
			:closable="false"
			:mask-closable="true"
			class-name="authDraw"
		>
			<div class="treeCon">
				<Tree
					:data="nodeTree"
					ref="authTree"
					show-checkbox
					multiple
				></Tree>
			</div>
			<div class="drawer-footer">
				<Button style="margin-right: 8px" @click="drawerFlag = false"
					>取消</Button
				>
				<Button
					type="primary"
					:loading="confirmLoading"
					@click="saveConfirm"
					>保存</Button
				>
			</div>
		</Drawer>
	</div>
</template>
<script>
import { roleApi, getModuleTree } from '@/api/system';
// import { mapState } from 'vuex';

export default {
	name: 'roleList',
	// computed: {
	// 	...mapState({
	// 		auth: (state) => state.user.auth
	// 	})
	// },
	data () {
		return {
			// 表格列表
			tableList: [],
			// 表格配置
			tableColumn: [
				{
					align: 'center',
					title: '角色code',
					key: 'roleCode',
					minWidth: 100
				},
				{
					align: 'center',
					title: '角色名称',
					key: 'roleName',
					minWidth: 100
				},
				{
					align: 'center',
					title: '描述',
					key: 'description',
					minWidth: 150
				},
				{
					align: 'center',
					title: '修改时间',
					key: 'updateTime',
					minWidth: 120
				},
				{
					align: 'center',
					title: '操作',
					slot: 'operate',
					minWidth: 100
				}
			],
			// 表格loading
			tableLoading: false,
			// 查询信息
			pageInfo: {
				currPage: 1,
				pageSize: 10,
				total: 0,
				data: {}
			},
			// 展示页面modal
			showPageModal: false,
			// 弹窗页面表单
			pageForm: {},
			// 弹窗页面表单规则
			accountRule: /(?=.*[A-Za-z0-9]).{3,20}/,
			pageRule: {
				roleCode: [
					{
						required: true,
						trigger: 'blur',
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入编码'));
							} else if (!this.accountRule.test(value)) {
								callback(new Error('只能是数字、字母,4-20位'));
							} else {
								callback();
							}
						}
					}
				],
				roleName: [
					{
						required: true,
						message: '请输入角色名称',
						trigger: 'blur'
					}
				],
				moduleAuthoritys: [
					{
						required: false,
						message: '请选择模块权限',
						trigger: 'blur',
						type: 'array'
					}
				]
			},
			showPageModal2: false,
			// 弹窗页面表单
			pageForm2: {},
			pageRule2: {},
			// 确认按钮loading
			confirmLoading: false,
			// 导出loading
			exportLoading: false,
			drawerFlag: false,
			moduleTree: [], // 树型选择组件
			nodeTree: [] // 树型节点组件
		};
	},
	methods: {
		// 获取表格数据
		getList () {
			this.tableLoading = true;
			roleApi
				.getRoleList(this.pageInfo)
				.then((res) => {
					console.log('-->', res, '<-');

					const list = res.data.data || [];
					list.forEach((item) => {
						item.id = item.pkRole;
					});
					this.tableList = list;
					this.pageInfo.total = res.data.total;
					this.tableLoading = false;
				})
				.catch((err) => {
					this.tableLoading = false;
					this.pageInfo.total = 0;
				});
		},
		// 切换页面
		changePage (p) {
			this.pageInfo.currPage = p;
			this.getList();
		},
		// 且页面大小
		changePageSize (ps) {
			this.pageInfo.pageSize = ps;
			this.pageInfo.currPage = 1;
			this.getList();
		},
		// 查询
		lookUp () {
			this.pageInfo.currPage = 1;
			this.getList();
		},
		// 重置
		reset () {
			this.pageInfo.data = {};
			this.pageInfo.currPage = 1;
			this.getList();
		},
		// 去新增
		toAdd () {
			this.pageForm = {
				id: null
			};
			this.$refs.pageForm.resetFields();
			this.showPageModal = true;
		},
		// 去编辑
		toEdit (r = {}) {
			this.pageForm = {
				...r
			};
			this.$refs.pageForm.resetFields();
			this.showPageModal = true;
		},
		// 添加
		add () {
			this.confirmLoading = true;
			roleApi
				.addRole({
					...this.pageForm
				})
				.then((res) => {
					this.$Message.success('添加成功');
					this.confirmLoading = false;
					this.showPageModal = false;
					this.getList();
				})
				.catch((err) => {
					this.$Message.error(err.msg);
					this.confirmLoading = false;
				});
		},
		// 编辑
		edit () {
			this.confirmLoading = true;
			roleApi
				.updateRole({
					...this.pageForm
				})
				.then((res) => {
					this.$Message.success('编辑成功');
					this.confirmLoading = false;
					this.showPageModal = false;
					this.getList();
				})
				.catch((err) => {
					this.$Message.error(err.msg);
					this.confirmLoading = false;
				});
		},
		// 确认
		confirmPage () {
			console.log('page', this.pageForm);
			this.$refs.pageForm.validate((v) => {
				if (v) {
					// 编辑
					if (this.pageForm.id) {
						this.edit();
						// 添加
					} else {
						this.add();
					}
				} else {
					console.log('校验失败');
				}
			});
		},
		// 删除
		del (r) {
			this.$Modal.confirm({
				title: '提示',
				content: '确定删除此条数据吗？',
				loading: true,
				onOk: () => {
					roleApi
						.deleteRole({
							pkRole: r.id
						})
						.then((res) => {
							this.$Message.success('删除成功');
							this.$Modal.remove();
							this.getList();
						})
						.catch((err) => {
							this.$Modal.remove();
						});
				}
			});
		},

		// 去授权
		toAuth (r) {
			Promise.all([this.queryRolePermission(r), this.getModule()]).then(
				(resp) => {
					console.log(resp);
					const [roleAuthList, nodeTree] = [...resp];
					this.defaultCheckAuth(roleAuthList, this.nodeTree);
					this.drawerFlag = true;
					// this.showPageModal2 = true;
				}
			);
		},
		queryRolePermission (r) {
			return new Promise((resolve, reject) => {
				roleApi
					.queryRolePermission({
						pkRole: r.id
					})
					.then((res) => {
						const roleAuthList = res.data;
						this.pageForm2 = {
							id: r.id,
							pkRole: r.id,
							moduleAuthoritys: roleAuthList
						};
						resolve(roleAuthList);
					})
					.catch((err) => {
						reject(err);
					});
			});
		},

		// 获取模块数据
		getModule () {
			return new Promise((resolve, reject) => {
				getModuleTree()
					.then((res) => {
						const list = res.data || [];
						this.moduleTree = this.makeCompanyOptions(list);
						this.nodeTree = this.getNodeTree(list);
						console.log('-->', this.moduleTree, '<-');

						resolve(this.nodeTree);
					})
					.catch((err) => {
						this.$Message.error(err.msg);
						reject([]);
					});
			});
		},
		// 制作选项树
		makeCompanyOptions (list) {
			let arr = list.map((item) => {
				return {
					id: item.pkPermission,
					label: item.name,
					children:
						(item.children &&
							item.children.length &&
							this.makeCompanyOptions(item.children)) ||
						undefined
				};
			});
			return arr;
		},
		// 制作节点树
		getNodeTree (list) {
			let arr = list.map((item) => {
				return {
					id: item.pkPermission,
					title: item.name,
					expand: true,
					checked: false,
					children:
						(item.children &&
							item.children.length &&
							this.getNodeTree(item.children)) ||
						null
				};
			});
			return arr;
		},

		// 节点树默认选中
		defaultCheckAuth (authList, menuList) {
			authList.forEach((authItem) => {
				menuList.forEach((menuItem) => {
					if (menuItem.children && menuItem.children.length > 0) {
						const tempList = menuItem.children;
						this.defaultCheckAuth(authList, tempList);
					} else {
						if (menuItem.id === authItem) {
							menuItem.checked = true;
						}
					}
				});
			});
		},
		// draw确认
		saveConfirm () {
			const checkedAndIndeterminateNodes =
				this.$refs.authTree.getCheckedAndIndeterminateNodes();
			this.pageForm2.moduleAuthoritys = checkedAndIndeterminateNodes.map(
				(item) => {
					return item.id;
				}
			);
			this.confirmChange();
		},

		// 确认接口
		confirmChange () {
			this.pageForm2.permissionIds =
				this.pageForm2.moduleAuthoritys.join(',');
			console.log('this.pageForm2:', this.pageForm2);
			this.confirmLoading = true;

			// 整个表单校验
			this.$refs.pageForm2.validate((v) => {
				if (v) {
					roleApi
						.saveRolePermission(this.pageForm2)
						.then((res) => {
							this.$Message.success(
								'权限更改成功，重新登录后生效'
							);
							this.getList();
							this.showPageModal2 = false;
							this.drawerFlag = false;
							this.confirmLoading = false;
						})
						.catch((err) => {
							this.confirmLoading = false;
						});
				} else {
					console.log('校验失败');
				}
			});
		}
	},
	activated () {
	},
	mounted () {
		this.getList();
	}
};
</script>
<style lang="less">
.authModal {
	height: 200px;
	.ivu-form-item {
		margin-bottom: 16px;
	}
}
.authDraw {
	.ivu-drawer-body {
		position: relative;
		p {
			font-size: 16px;
			padding: 10px;
		}
		.treeCon {
			margin-left: 20px;
			height: ~"calc(100% - 53px)";
			overflow: auto;
		}
		.drawer-footer {
			width: 100%;
			position: absolute;
			bottom: 0;
			left: 0;
			border-top: 1px solid #e8e8e8;
			padding: 10px 16px;
			text-align: right;
			background: #fff;
		}
	}
}
</style>
