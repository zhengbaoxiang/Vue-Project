<!--
 * @Descripttion:
 * @version:
 * @Author: zbx
 * @Date: 2021-09-20 09:09:42
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-08 14:50:58
-->
<template>
	<Layout style="height: 100%" class="main ">
		<Header class="header-menu">
			<div class="logoCon">
				<img :src="emLogo" alt="" class="logoImg" />
				<p class="loginTitle" v-show="!collapsed">平台名称</p>
			</div>
			<div style="flex: 1">
				<route-menu
					ref="menuRef"
					:active-name="$route.name"
					:collapsed="collapsed"
					:mode="'horizontal'"
					@on-select="turnToPage"
					:menu-list="menuList"
				>
				</route-menu>
			</div>
			<div class="userCon">
				<user :user-avatar="userAvatar" />
			</div>
		</Header>
		<Layout class="main-layout-con">
			<Content class="content-wrapper thinWrapper">
				<keep-alive :include="cacheList">
					<router-view />
				</keep-alive>
				<ABackTop
					:height="100"
					:bottom="80"
					:right="50"
					container=".content-wrapper"
				></ABackTop>
			</Content>
		</Layout>
	</Layout>
</template>
<script>
import emLogo from "@/assets/images/u12.png";

import RouteMenu from "./components/route-menu";
import HeaderBar from "./components/header-bar";
// import TagsNav from "./components/tags-nav";
import User from "./components/user";
import ABackTop from "./components/a-back-top";
import Language from "./components/language";
import { mapMutations, mapActions, mapGetters, mapState } from "vuex";
import { getNewTagList, routeEqual } from "@/libs/util";
import routers from "@/router/routers";
import "./main.less";
export default {
	name: "Main",
	components: {
		RouteMenu,
		HeaderBar,
		Language,
		// TagsNav,
		User,
		ABackTop,
	},
	data() {
		return {
			emLogo,
			collapsed: false,
			// minLogo,
			// maxLogo,
		};
	},
	computed: {
		...mapGetters(["errorCount"]),
		...mapState({
			userName: (state) => state.user.userName,
			companyList: (state) => state.user.companyList,
			currentCompanyId: (state) => state.user.currentCompanyId,
		}),
		tagNavList() {
			return this.$store.state.app.tagNavList;
		},
		tagRouter() {
			return this.$store.state.app.tagRouter;
		},
		userAvatar() {
			return this.$store.state.user.avatarImgPath;
		},
		cacheList() {
			const list = [
				"selfDefine",
				...(this.tagNavList.length
					? this.tagNavList
							.filter(
								(item) => !(item.meta && item.meta.notCache)
							)
							.map((item) => item.name)
					: []),
			];
			return list;
		},
		menuList() {
			return this.$store.getters.menuList;
		},
		local() {
			return this.$store.state.app.local;
		},
		hasReadErrorPage() {
			return this.$store.state.app.hasReadErrorPage;
		},
		unreadCount() {
			return this.$store.state.user.unreadCount;
		},
	},
	methods: {
		...mapMutations([
			"setBreadCrumb",
			"setTagNavList",
			"addTag",
			"setLocal",
			"setHomeRoute",
			"closeTag",
			"setCurrentCompanyId",
		]),
		...mapActions([
			"handleLogin",
			"getUnreadMessageCount",
			"addMenuList",
			// 'updateMenuCount'
		]),
		turnToPage(route) {
			let { name, params, query } = {};
			if (typeof route === "string") name = route;
			else {
				name = route.name;
				params = route.params;
				query = route.query;
			}
			if (name.indexOf("isTurnByHref_") > -1) {
				window.open(name.split("_")[1]);
				return;
			}
			if (name === this.$route.name) {
				console.log("路由重复:", name);
				return;
			}

			this.$router.push({
				name,
				params,
				query,
			});
		},
		handleCollapsedChange(state) {
			this.collapsed = state;
		},
		handleCloseTag(res, type, route) {
			if (type !== "others") {
				if (type === "all") {
					this.turnToPage(this.$config.homeName);
				} else {
					if (routeEqual(this.$route, route)) {
						this.closeTag(route);
					}
				}
			}
			this.setTagNavList(res);
		},
		handleClick(item) {
			this.turnToPage(item);
		},
	},
	watch: {
		$route(newRoute) {
			const { name, query, params, meta } = newRoute;
			this.addTag({
				route: { name, query, params, meta },
				type: "push",
			});
			this.setBreadCrumb(newRoute);
			this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
			this.$refs.menuRef &&
				this.$refs.menuRef.updateOpenName(newRoute.name);
		},
	},
	beforeCreate() {},
	created() {},
	mounted() {
		/**
		 * @description 初始化设置面包屑导航和标签导航
		 */
		this.setTagNavList();
		this.setHomeRoute(routers);
		this.addMenuList();
		// this.updateMenuCount();
		const { name, params, query, meta } = this.$route;
		this.addTag({
			route: { name, params, query, meta },
		});
		this.setBreadCrumb(this.$route);
		// 设置初始语言
		// this.setLocal(this.$i18n.locale)
		// 如果当前打开页面不在标签栏中，跳到homeName页
		if (!this.tagNavList.find((item) => item.name === this.$route.name)) {
			this.$router.push({
				name: this.$config.homeName,
			});
		}
		// 获取未读消息条数
		// this.getUnreadMessageCount()
	},
};
</script>
<style lang="less" scoped>
</style>
