<template>
    <Modal
        title="重置密码"
        v-model="resetShow"
    >
        <Form 
            :model="resetForm" 
            ref="resetForm" 
            :rules="resetRules"
            :label-width="100"
        >
            <FormItem label="旧密码" prop="oldPwd">
                <Input
                    type="password"
                    v-model="resetForm.oldPwd"
                    placeholder="请输入旧密码"
                    password
                />
            </FormItem>
            <FormItem label="新密码" prop="password">
                <Input
                    type="password"
                    v-model="resetForm.password"
                    placeholder="请输入新密码"
                    password
                />
            </FormItem>
            <FormItem label="新密码确认" prop="passwordCheck">
                <Input
                    type="password"
                    v-model="resetForm.passwordCheck"
                    placeholder="请再次输入新密码"
                    password
                />
            </FormItem>
        </Form>
        <template slot="footer">
            <Button @click="closeResetModal">关闭</Button>
            <Button @click="confirmResetModal" type="primary" :loading="confirmLoading">确认</Button>
        </template>
    </Modal>
</template>
<script>
import {
    updatePassword
} from '@/api/user'
export default {
    data() {
        return {
            resetShow: false,
            resetForm: {
                oldPwd: '',
                password: '',
                passwordCheck: '',
            },
            passwordRule: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,20}/,

            resetRules: {
                oldPwd: [
                    {
                        required: true,
                        message: '请输入旧密码',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: (rule, value, callback) => {    
                            if (value === '') {
                                callback(new Error('请输入密码'));
                            } else if (!this.passwordRule.test(value)) {
                                callback(new Error('密码必须数字加特殊字符加字母大小写,长度需8-20位'));
                            } else {
                                callback();
                            }
                        }, 
                    }
                ],
                passwordCheck: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: (rule, value, callback) => {
                            if (value !== this.resetForm.password) {
                                callback(new Error('两次输入的新密码不一致'));
                            } else {
                                callback();
                            }
                        },
                    }
                ]
            },

            // 按钮loading
            confirmLoading: false
        }
    },
    methods: {
        // 显示重置密码框
        resetPsw() {
            console.log('--->',3333,'<---');
            
            this.resetForm = {
                oldPwd: '',
                password: '',
                passwordCheck: ''
            };
            this.$refs.resetForm.resetFields();
            this.resetShow = true;
        },
        // 关闭重置密码框
        closeResetModal() {
            this.resetShow = false;
        },
        // 确认重置密码框
        confirmResetModal() {
            
            this.$refs.resetForm.validate(v => {
                if (v) {
                    this.confirmLoading = true;
                    updatePassword({
                        passwordCheck: this.resetForm.passwordCheck,
                        password: this.resetForm.password,
                        oldPwd: this.resetForm.oldPwd
                    }).then(res => {
                        this.$Message.success('修改成功');
                        this.resetShow = false;
                        this.confirmLoading = false;
                        setTimeout(() => {
                            this.$emit('confirm');
                        }, 500);
                    }).catch(err => {
                        this.$Message.error(err.msg);
                        this.confirmLoading = false;
                    });
                }else{
                    console.log('校验失败');
                }
            })
        }
    }
}
</script>