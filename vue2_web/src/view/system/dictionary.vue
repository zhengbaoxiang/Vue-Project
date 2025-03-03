<template>
	<div class="userList" >
		<div style="padding: 20px 0">
			<Form inline>
				<FormItem>
					字典编码:
					<Input
						placeholder="请输入"
						style="width: 200px"
						clearable
						v-model="pageInfo.data.dictCode"
					/>
				</FormItem>
				<FormItem>
					字典名称:
					<Input
						placeholder="请输入"
						clearable
						style="width: 200px"
						v-model="pageInfo.data.dictName"
					/>
				</FormItem>
				<Button icon="md-search" class="ml10" @click="lookUp"
					>查询</Button
				>
				<Button class="ml10 fr" @click="reset">重置</Button>
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
				<Button
					type="success"
					@click="toSet(row)"
					class="ml10"
					>配置</Button
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
				<FormItem prop="dictCode" label="字典编码">
					<Input
						placeholder="请输入"
						style="width: 300px"
						v-model="pageForm.dictCode"
						:disabled="!!pageForm.id"
					/>
				</FormItem>

				<FormItem prop="dictName" label="字典名称">
					<Input
						placeholder="请输入"
						style="width: 300px"
						v-model="pageForm.dictName"
					/>
				</FormItem>
				<FormItem prop="description" label="描述">
					<Input
						placeholder="请输入"
						style="width: 300px"
						v-model="pageForm.description"
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

		<Drawer
			v-model="drawerFlag"
			placement="right"
			width="700"
			title="字典配置"
			:closable="false"
			:mask-closable="true"
			class-name="dictDraw"
		>
			<dictionaryDetail
				v-if="drawerFlag"
				:dictId="currentPkDict"
				:dictCode="currentDictCode"
			></dictionaryDetail>
		</Drawer>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import { dictApi } from '@/api/system';
import dictionaryDetail from '@/view/system/dictionaryDetail';

export default {
	computed: {
		...mapState({
			auth: (state) => state.user.auth
		})
	},
	components: {
		dictionaryDetail
	},
	data () {
		return {
			// 表格列表
			tableList: [],
			// 表格配置
			tableColumn: [
				{
					align: 'center',
					title: '字典编码',
					key: 'dictCode',
					minWidth: 80
				},
				{
					align: 'center',
					title: '字典名称',
					key: 'dictName',
					minWidth: 100
				},
				{
					align: 'center',
					title: '描述',
					key: 'description',
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
			accountRule: /(?=.*[A-Za-z0-9]).{3,20}/,
			pageRule: {
				dictCode: [
					{
						required: true,
						trigger: 'blur',
                        validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入编码'));
							} else if (!this.accountRule.test(value)) {
								callback(
									new Error('只能是数字、字母,4-20位')
								);
							} else {
								callback();
							}
						}
					}
				],
				dictName: [
					{
						required: true,
						message: '请输入字典名称',
						trigger: 'blur'
					}
				]
			},
			// 确认按钮loading
			confirmLoading: false,
			// 抽屉页面
			drawerFlag: false,
			currentPkDict: null,
			currentDictCode: null
		};
	},
	methods: {
		initial () {},
		toSet (r) {
			this.drawerFlag = true;
			this.currentPkDict = r.id;
			this.currentDictCode = r.dictCode;
		},
		// 获取表格数据
		getTableList () {
			this.tableLoading = true;

			dictApi
				.getList(this.pageInfo)
				.then((res) => {
					const list = res.data.data || [];
					list.forEach((item) => {
						item.id = item.pkDict;
					});
					this.tableList = list;

					this.pageInfo.total = res.data.total;
					this.tableLoading = false;
				})
				.catch((err) => {
					this.tableLoading = false;
					this.tableList = [];
					this.pageInfo.total = 0;
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
				dictApi
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
			dictApi
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
					dictApi
						.deleteItem({
							pkDict: r.id
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
		setTimeout(() => {
			this.initial();
		}, 1000);
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
