<!--
 * @Date: 2025-03-03 16:41:18
 * @LastEditors: zbx
 * @LastEditTime: 2025-03-03 19:42:35
 * @descript: 文件描述
-->
<template>
    <section class="main_con">
        <div class="list_zone ">
            <div id="grid" :class="[setLength === 15 ? 'r3' : 'r2']">
                <ol
                    class="pageList"
                    id="pageList"
                    :class="{ active: tabId === 1 }"
                >
                    <li v-for="(item, index) in dataList" :key="index">
                        <pageCard
                            :paramsObj="item"
                            @editInfo="editInfo"
                            @delInfo="delInfo"
                            @getPicName="getPicName"
                        ></pageCard>
                    </li>
                </ol>
            </div>
        </div>
        <div v-if="showPopup" class="overlay" :class="{ active: showPopup }" @click="cancel">
            <div class="drawer" @click.stop>
                <form @submit.prevent="confirm(currentData)">
                    <div class="form-group">
                        <label for="title">标题</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            v-model="currentData.title"
                            autocomplete="off"
                            placeholder="标题"
                            autofocus
                        />
                    </div>
                    <div class="form-group">
                        <label for="url">网址</label>
                        <input
                            type="text"
                            id="url"
                            name="url"
                            v-model="currentData.url"
                            autocomplete="off"
                            placeholder="网址"
                        />
                    </div>
                    <div class="button-group">
                        <button type="button" @click="cancel">取消</button>
                        <button type="submit">添加</button>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>
<script>
import Sortable from 'sortablejs'
import pageCard from './pageCard'
export default {
    name: 'pageContain',
    components: { pageCard },
    props: {
        tab_index: {
            default: 0
        }
    },
    data() {
        return {
            tabId: 1,
            dataList: [],
            setLength: 15,
            currentData: {},
            showPopup: false
        }
    },
    created() {
        this.getDataList(`myUrlList_${this.tabId}`)
    },
    mounted() {
        // 监听change事件，同时附带回调函数处理传值
        EVENT_BUS.$on('gridNumChange', this.handleChange)
        this.initialSort()
    },
    activated() {},
    methods: {
        initialSort() {
            const el = document.getElementById('pageList')
            new Sortable(el, {
                animation: 150,
                ghostClass: 'self-define-class'
            })
            // const sortableInstance = Sortable.create(el)
        },
        handleChange(par) {
            // console.log('change:参数：',a,b)
            this.getDataList(`myUrlList_${this.tabId}`)
        },
        tabChange(value) {
            this.tabId = value
            this.getDataList(`myUrlList_${value}`)
        },
        getDataList(name) {
            // 获取布局个数
            let temp = window.localStorage.getItem('gridNum')
            this.setLength = temp ? Number(temp) : this.setLength

            // 从localStorage中读取
            const myUrlListStr = window.localStorage.getItem(name)
            
            // 读取初始值
            const initialDataList = []
            const initialDataListLength = initialDataList.length

            let tempList = [],myUrlList=[]
            // 如果本地没有存储过，则使用初始数据
            if (!myUrlListStr) {
                for (
                    let i = 0;
                    i < this.setLength - initialDataListLength;
                    i++
                ) {
                    tempList.push({
                        id: initialDataListLength + i
                    })
                }
                myUrlList = initialDataList.concat(tempList)
            } else {
                myUrlList = JSON.parse(myUrlListStr)
            }
            this.dataList = myUrlList.slice(0, this.setLength)
            console.log('->', this.dataList, '<')
        },

        editInfo(data) {
            try {
            console.log('editInfo:', data)
            // 直接=赋值是浅拷贝，数据会联动
            this.currentData = this.dataAssign(data)
            this.showPopup = true
        }catch(e) {
                console.log('e:',e)
            }
        },
        cancel() {
            this.currentData = {}
            this.showPopup = false
        },
        confirm(data) {
            if (!data.title) {
                console.log('不能为空')
                return
            }
            this.dataList[data.id] = this.dataAssign(data)
            this.showPopup = false
            this.updatePage()
        },
        delInfo(data) {
            // this.dataList[data.id] = { id: data.id }
            // 上一行虽然能改，但是不会刷新数据，$set强制刷新
            this.$set(this.dataList, data.id, { id: data.id })
            this.updatePage()
        },
        getPicName(data, name) {
            // this.dataList[data.id].picName = name
            const item = this.dataAssign(data, name)
            this.$set(this.dataList, data.id, item)
            this.updatePage()
        },
        updatePage() {
            const name = `myUrlList_${this.tabId}`
            const dataListStr = JSON.stringify(this.dataList)
            window.localStorage.setItem(name, dataListStr)
        },
        dataAssign(data, name) {
            let tempObj = {
                id: data.id,
                dataId: data.id + 1,
                url: data.url || '',
                picName: name || data.picName || '',
                title: data.title?data.title.slice(0,5):''
            }
            return tempObj
        }
    }
}
</script>
<style lang="less" scoped>
section.main_con {
    position: fixed;
    top:28%;
    width: 100%;
    margin: auto;
    .list_zone {
        position: relative;
        margin: 0 auto;
        width: 55%;
        min-width: 300px;
        // height: ~'calc(100% - 130px)';
        overflow: hidden;
        .tab_con {
            height: 30px;
            .tab {
                margin: 0 auto;
                max-width: 1650px;
                width: ~'calc(100% - 200px)';
                button {
                    // float: left;
                    height: 30px;
                    width: 60px;
                    // border: 1px;
                    margin: 0 1px;
                    outline: none;
                    background: rgb(200, 197, 197);
                }
                .current {
                    background-color: #fff;
                    border-style: none;
                    font: normal 16px/24px 'Microsoft Yahei';
                }
            }
        }
        #grid {
            height: 100%;
            margin: 0 auto;
            overflow: hidden;
            transition: left 400ms linear 0s;
            ol.pageList.active {
                display: block;
            }
            ol.pageList {
                display: none;
                overflow: hidden;
                font-size: 0;
                & > li {
                    display: inline-block;
                    width: 20%;
                    min-width: 100px;
                    box-sizing: border-box;
                }
            }
        }
        #grid.r3 {
            margin: 0 auto 0;
        }
        #grid.r2 {
            margin: 50px 0 0;
        }
    }

    .overlay {
        background: rgba(25, 25, 25, 0.3);
        position: fixed;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        margin: auto;
        z-index: 100;
        opacity: 0;
        transition: opacity 0.3s ease;
        &.active {
            opacity: 1;
        }
        .drawer {
            position: fixed;
            top: 0;
            right: 0;
            height: 100%;
            width: 300px;
            padding: 20px;
            background: white;
            box-shadow: rgba(0, 0, 0, 0.85) 0 0 6px 0;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            form {
                display: flex;
                flex-direction: column;
                .form-group {
                    margin-bottom: 15px;
                    label {
                        display: block;
                        margin-bottom: 5px;
                        font-weight: bold;
                    }
                    input {
                        width: 100%;
                        padding: 8px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                    }
                }
                .button-group {
                    display: flex;
                    justify-content: flex-end;
                    button {
                        padding: 10px 20px;
                        margin-left: 10px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        &:first-child {
                            background-color: #f5f5f5;
                            color: #333;
                        }
                        &:last-child {
                            background-color: #007bff;
                            color: #fff;
                        }
                    }
                }
            }
        }
        &.active .drawer {
            transform: translateX(0);
        }
    }
}
</style>
