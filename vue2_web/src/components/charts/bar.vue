<template>
	<div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import * as echarts from "echarts";
import tdTheme from "./theme.json";
import { on, off } from "@/libs/tools";
echarts.registerTheme("tdTheme", tdTheme);
export default {
	name: "ChartBar",
	props: {
		dataList: Array,
		text: String,
		subtext: String,
	},
	data() {
		return {
			dom: null,
		};
	},
	methods: {
        initial(){
            let xAxisData = this.dataList.map((_) => _.name);
			let seriesData = this.dataList.map((_) => _.value);
			let option = {
				title: {
					text: this.text,
					subtext: this.subtext,
					x: "center",
				},
				grid: {
					top: 20,
					bottom: 30,
				},
				xAxis: {
					type: "category",
					data: xAxisData,
					axisLine: {
						show: true,
					},
					axisTick: {
						show: false,
					},
					splitLine: {
						show: false,
					},
				},
				yAxis: {
					type: "value",
					axisLine: {
						show: false,
					},
					axisTick: {
						show: false,
					},
					splitLine: {
						show: true,
					},
				},
				series: [
					{
						type: "bar",
						data: seriesData,
						label: {
							show: true,
                            position: 'top'
						},
                         barCategoryGap:"50%"
					},
				],
			};
			this.dom = echarts.init(this.$refs.dom, "tdTheme");
			this.dom.setOption(option);
        },
		resize() {
			this.dom.resize();
		},
	},
    watch:{
        dataList(value){
            console.log('-watch->',value,'<-');
            this.initial()
        }
    },
	mounted() {
		this.$nextTick(() => {
            this.initial()
			on(window, "resize", this.resize);
		});
	},
	beforeDestroy() {
		off(window, "resize", this.resize);
	},
};
</script>

<style lang="less">
.charts {
	width: 100%;
	height: 100%;
}
</style>
