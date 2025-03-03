<template>
	<div class="em-menu">
		<Row type="flex" align="middle">
			<template v-for="(item, index) in menuList">
				<Col
					:key="index"
					:span="3"
					v-if="!item.hideInMenu"
					class="em-menu-option"
				>
					<div
						v-if="
							item.children.length == 1 &&
							!item.children[0].children
						"
						class="em-menu-item"
						@click="handleSelect(item.children[0].name)"
					>
						<div class="em-menu-item-main">
							<div class="em-menu-icon">
								<Icon
									:type="item.children[0].meta.icon"
									size="45"
									class="em-menu-icon-con"
								/>
							</div>
							<div class="em-menu-name">
								{{ item.children[0].meta.title }}
							</div>
						</div>
					</div>
					<div
						v-else-if="
							item.children.length == 1 &&
							item.children[0].children &&
							item.children[0].children.length == 1
						"
						class="em-menu-item"
						@click="handleSelect(item.children[0].children[0].name)"
					>
						<div class="em-menu-item-main">
							<div class="em-menu-icon">
								<Icon
									:type="
										item.children[0].children[0].meta.icon
									"
									size="45"
									class="em-menu-icon-con"
								/>
							</div>
							<div class="em-menu-name">
								{{ item.children[0].children[0].meta.title }}
							</div>
						</div>
					</div>
					<div
						v-else
						class="em-menu-item"
						@mouseover="showSubMenu"
						@mouseout="hideSubMenu"
					>
						<div class="em-menu-item-main">
							<div class="em-menu-icon">
								<Icon
									:type="item.meta.icon"
									size="45"
									class="em-menu-icon-con"
								/>
							</div>
							<div class="em-menu-name">
								{{ item.meta.title }}
							</div>
						</div>
						<div
							class="em-submenu-wrap"
							:style="
								'width:' + 150 * item.children.length + 'px'
							"
						>
							<div
								v-for="(sub, j) in item.children"
								class="em-submenu"
								:key="j"
							>
								<template
									v-if="sub.children && sub.children.length"
								>
									<div class="em-submenu-title">
										{{ sub.meta.title }}
									</div>
									<template v-for="(lSub, k) in sub.children">
										<div
											@click="handleSelect(lSub.name)"
											class="em-submenu-item flex"
											:key="k"
											v-if="!lSub.hideInMenu"
										>
											<Icon
												:type="lSub.meta.icon"
												size="20"
												class="em-submenu-icon"
											/>
											<div class="em-submenu-name">
												{{ lSub.meta.title }}
											</div>
										</div>
									</template>
								</template>
								<template
									v-if="
										!(sub.children && sub.children.length)
									"
								>
									<div
										class="em-submenu-item flex"
										v-if="!sub.hideInMenu"
										@click="handleSelect(sub.name)"
									>
										<Icon
											:type="sub.meta.icon"
											size="20"
											class="em-submenu-icon"
										/>
										<div class="em-submenu-name">
											{{ sub.meta.title }}
										</div>
									</div>
								</template>
							</div>
						</div>
					</div>
				</Col>
			</template>
		</Row>
	</div>
</template>
<script>
export default {
	props: {
		menuList: {
			type: Array,
			default: () => {
				return [];
			},
		},
	},
	methods: {
		// 展示二级目录
		showSubMenu(e) {
			let op = $(e.target).parents(".em-menu-option");
			let hArr = [];
			op.find(".em-submenu").map(function () {
				hArr.push($(this).outerHeight());
			});
			hArr.sort((a, b) => {
				return b - a;
			});
			op.find(".em-submenu-wrap").css("height", hArr[0]);
		},
		// 隐藏二级目录
		hideSubMenu(e) {
			$(e.target)
				.parents(".em-menu-option")
				.find(".em-submenu-wrap")
				.css("height", 0);
		},
		// 选择
		handleSelect(name) {
			this.$emit("on-select", name);
		},
	},
	watch: {
		menuList(n) {
			console.log(n);
		},
	},
	mounted() {
		console.log(this.menuList);
	},
};
</script>
<style lang="less">
@import "./top-menu.less";
</style>
