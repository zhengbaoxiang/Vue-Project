<!--
 * @Date: 2022-04-07 11:16:03
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-08 14:34:06
 * @FilePath: \management\src\components\main\components\route-menu\submenu-item.vue
-->
<template>
	<Submenu :name="`${parentName}`">
		<template slot="title">
			<common-icon :type="parentItem.icon || ''" />
			<span>{{ showTitle(parentItem) }}</span>
		</template>
		<template v-for="item in children">
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
				<common-icon :type="getCurrentItem(item).icon || ''" /><span>{{
					showTitle(getCurrentItem(item))
				}}</span></menu-item
			>
		</template>
	</Submenu>
</template>
<script>
import mixin from "./mixin";
import itemMixin from "./item-mixin";
export default {
	name: "SubmenuItem",
	mixins: [mixin, itemMixin],
};
</script>
