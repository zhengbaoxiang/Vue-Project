<!--
 * @Date: 2022-02-08 16:02:29
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-06 11:17:29
 * @FilePath: \后台系统通用\src\view\system\dictionaryDetail.vue
-->
<!--
 * @Author: zbx
 * @Date: 2021-09-27 16:11:15
 * @LastEditTime: 2022-01-25 09:47:01
 * @LastEditors: zbx
 * @Description: 员工管理
 * @FilePath: \management\src\view\routine-management\staff.vue
-->
<template>
	<div class="userList">
		<div style="padding: 20px 0">
			<Form inline style="text-align: right">
				<Button type="primary" class="ml10 fr" @click="toAdd"
					>新增</Button
				>
			</Form>
		</div>
		<Table
			:data="tableList"
			:columns="tableColumn"
			:loading="tableLoading"
			max-height="750"
			row-key="id"
		>
			<template slot="operate" slot-scope="{ row }">
				<Button
					type="warning"
					@click="toEdit(row)"
					icon="md-create"
				></Button>
				<Button
					type="error"
					class="ml10"
					@click="del(row)"
					icon="ios-trash-outline"
				></Button>
			</template>
		</Table>
		<Modal
			v-model="showPageModal"
			:title="pageForm.id ? '编辑' : '新增'"
			class="userModal"
		>
			<Form
				:model="pageForm"
				:rules="pageRule"
				:label-width="120"
				ref="pageForm"
			>
				<FormItem prop="text" label="数据名称">
					<Input
						placeholder="请输入"
						style="width: 300px"
						v-model="pageForm.text"
					/>
				</FormItem>

				<FormItem prop="value" label="数据值">
					<Input
						placeholder="请输入"
						style="width: 300px"
						v-model="pageForm.value"
					/>
				</FormItem>
			</Form>
			<template slot="footer">
				<Button @click="closePageModal">关闭</Button>
				<Button
					@click="confirmPage"
					type="primary"
					:loading="confirmLoading"
					>确定</Button
				>
			</template>
		</Modal>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import { dictDetailApi, dictApi } from '@/api/system';
export default {
	props: {
		dictId: {
			required: true
		},
		dictCode: {
			required: true
		}
	},
	computed: {
		...mapState({
			auth: (state) => state.user.auth
		})
	},
	data () {
		return {
			// 表格列表
			tableList: [],
			// 表格配置
			tableColumn: [
				{
					align: 'center',
					title: '数据名称',
					key: 'text',
					minWidth: 80
				},
				{
					align: 'center',
					title: '数据值',
					key: 'value',
					minWidth: 100
				},
				{
					align: 'center',
					title: '操作',
					slot: 'operate',
					minWidth: 120
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
			accountRule: /(?=.*[A-Za-z0-9]).{1,10}/,
			pageRule: {
				value: [
					{
						required: true,
						trigger: 'blur',
						validator: (rule, val, callback) => {
							if (!val) {
								callback(new Error('请输入值'));
							} else if (!this.accountRule.test(val)) {
								callback(
									new Error('数据值只能是数字、字母,1-10位')
								);
							} else {
								callback();
							}
						}
					}
				],
				text: [
					{
						required: true,
						message: '请输入名称',
						trigger: 'blur'
					}
				]
			},
			// 确认按钮loading
			confirmLoading: false,
			// 抽屉页面
			drawerFlag: false
		};
	},
	methods: {
		// 获取表格数据
		getTableList () {
			this.tableLoading = true;

			dictApi
				.getDetail(this.dictCode)
				.then((res) => {
					const list = res.data || [];
					list.forEach((item) => {
						item.id = item.pkDictItem;
						item.value = String(item.value);
					});
					this.tableList = list;

					this.tableLoading = false;
				})
				.catch((err) => {
					this.tableLoading = false;
				});
		},
		// 去新增
		toAdd () {
			this.$refs.pageForm.resetFields();
			this.pageForm = {
				id: null
			};
			this.showPageModal = true;
		},
		// 去编辑
		toEdit (r = {}) {
			this.$refs.pageForm.resetFields();
			this.pageForm = {
				...r
			};
			this.showPageModal = true;
		},
		// 确认
		confirmPage () {
			console.log('this.pageForm:', this.pageForm);

			(this.pageForm.dictId = this.dictId),
				// 整个表单校验
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
		// 添加
		add () {
			this.confirmLoading = true;
			try {
				dictDetailApi
					.add({
						...this.pageForm
					})
					.then((res) => {
						this.$Message.success('添加成功');
						this.confirmLoading = false;
						this.showPageModal = false;
						this.getTableList();
					})
					.catch((err) => {
						this.confirmLoading = false;
					});
			} catch (error) {
				console.log('-->', error, '<-');
			}
		},
		// 编辑
		edit () {
			this.confirmLoading = true;
			dictDetailApi
				.update({
					...this.pageForm
				})
				.then((res) => {
					this.$Message.success('编辑成功');
					this.confirmLoading = false;
					this.showPageModal = false;
					this.getTableList();
				})
				.catch((err) => {
					this.confirmLoading = false;
				});
		},
		// 关闭弹窗
		closePageModal () {
			this.showPageModal = false;
		},
		// 删除
		del (r) {
			this.$Modal.confirm({
				title: '提示',
				content: '确定删除此条数据吗？',
				loading: true,
				onOk: () => {
					dictDetailApi
						.deleteItem({
							pkDictItem: r.id
						})
						.then((res) => {
							this.$Message.success('删除成功');
							this.$Modal.remove();
							this.getTableList();
						})
						.catch((err) => {
							this.$Modal.remove();
						});
				}
			});
		},
		// 切换页面
		changePage (p) {
			this.pageInfo.currPage = p;
			this.getTableList();
		},
		// 且页面大小
		changePageSize (ps) {
			this.pageInfo.pageSize = ps;
			this.pageInfo.currPage = 1;
			this.getTableList();
		},
		// 查询
		lookUp () {
			this.pageInfo.currPage = 1;
			this.getTableList();
		},
		// 重置
		reset () {
			this.pageInfo.data = {};
			this.pageInfo.currPage = 1;
			this.getTableList();
		}
	},
	mounted () {
		this.getTableList();
	}
};
</script>
<style lang="less">
.userModal {
	.ivu-form-item {
		margin-bottom: 18px;
	}
}
</style>
