<template>
	<div class="side-menu-wrapper">
		<slot></slot>
		<Menu
			ref="menu"
			v-show="!collapsed"
			:active-name="activeName"
			:mode="mode"
			:accordion="accordion"
			:theme="theme"
			width="auto"
			@on-select="handleSelect"
			:open-names="mode === 'vertical' ? openedNames : []"
		>
			<template v-for="item in menuList">
				<submenu-item
					v-if="showChildren(item)"
					:key="`menu-${item.name}`"
					:parent-item="item"
				></submenu-item>
				<menu-item
					v-else
					:name="getNameOrHref(item)"
					:key="`menu-${getCurrentItem(item).name}`"
				>
					<common-icon :type="getCurrentItem(item).icon || ''" /><span
						>{{ showTitle(getCurrentItem(item)) }}</span
					></menu-item
				>
			</template>
		</Menu>
		<div class="menu-collapsed" v-show="collapsed" :list="menuList">
			<template v-for="item in menuList">
				<collapsed-menu
					v-if="item.children && item.children.length > 1"
					@on-click="handleSelect"
					hide-title
					:root-icon-size="rootIconSize"
					:icon-size="iconSize"
					:theme="theme"
					:parent-item="item"
					:key="`drop-menu-${item.name}`"
				></collapsed-menu>
				<Tooltip
					transfer
					v-else
					:content="
						showTitle(
							item.children && item.children[0]
								? item.children[0]
								: item
						)
					"
					placement="right"
					:key="`drop-menu-${item.name}`"
				>
					<a
						@click="handleSelect(getNameOrHref(item, true))"
						class="drop-menu-a"
						:style="{ textAlign: 'center' }"
					>
						<common-icon
							:size="rootIconSize"
							:color="textColor"
							:type="
								item.icon ||
								(item.children && item.children[0].icon) ||
								''
							"
						/>
					</a>
				</Tooltip>
			</template>
		</div>
	</div>
</template>
<script>
import SubmenuItem from "./submenu-item.vue";
import CollapsedMenu from "./collapsed-menu.vue";
import { getUnion } from "@/libs/tools";
import mixin from "./mixin";

export default {
	name: "RouteMenu",
	mixins: [mixin],
	components: {
		SubmenuItem,
		CollapsedMenu,
	},
	props: {
		menuList: {
			type: Array,
			default() {
				return [];
			},
		},
		collapsed: {
			type: Boolean,
		},
		theme: {
			type: String,
			default: "light",
		},
		mode: {
			type: String,
			default: "vertical",
		},
		rootIconSize: {
			type: Number,
			default: 20,
		},
		iconSize: {
			type: Number,
			default: 16,
		},
		// 开启手风琴模式
		accordion: {
			type: Boolean,
			default: false,
		},
		activeName: {
			type: String,
			default: "",
		},
		openNames: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			openedNames: [],
		};
	},
	methods: {
		handleSelect(name) {
			this.$emit("on-select", name);
		},
		getOpenedNamesByActiveName(name) {
			return this.$route.matched
				.map((item) => item.name)
				.filter((item) => item !== name);
		},
		updateOpenName(name) {
			if (name === this.$config.homeName) this.openedNames = [];
			else this.openedNames = this.getOpenedNamesByActiveName(name);
		},
	},
	computed: {
		textColor() {
			return this.theme === "dark" ? "#fff" : "#495060";
		},
	},
	watch: {
		activeName(name) {
			if (this.accordion)
				this.openedNames = this.getOpenedNamesByActiveName(name);
			else
				this.openedNames = getUnion(
					this.openedNames,
					this.getOpenedNamesByActiveName(name)
				);
		},
		openNames(newNames) {
			this.openedNames = newNames;
		},
		openedNames() {
			this.$nextTick(() => {
				this.$refs.menu.updateOpened();
			});
		},
	},
	mounted() {
		this.openedNames = getUnion(
			this.openedNames,
			this.getOpenedNamesByActiveName(name)
		);
	},
};
</script>
<style lang="less">
@import "./route-menu.less";
</style>
