import {defineComponent, ref, getCurrentInstance} from 'vue';
import Login from "@/components/loginForm/login.vue";
import Register from "@/components/loginForm/register.vue";
import { message } from 'ant-design-vue';
import router from "@/router";
import {getUserInfoByStorage} from "@/utils/store";

import "@/styles/login/login.scss"


export default defineComponent({
    name: "login",
    components: {Login, Register},
    setup() {
        const formType = ref("login");
        const {proxy}: any = getCurrentInstance();
        const [messageApi, contextHolder] = message.useMessage();
        const userInfo = getUserInfoByStorage()
        if(userInfo?.isLogin){
            router.push('/')
            messageApi.info('Hello, Ant Design Vue!');
        }

        const register = () => {
            formType.value = "register";
        }

        const login = () => {
            formType.value = "login";
        }

        return () => (
            <div class="full">
                <a-row justify="center" align="middle">
                    <a-col span={8}>
                        <a-card style="width:100%;">
                            {
                                formType.value === "login" ? <Login onChangeType={register}/>
                                    : <Register onChangeType={login}/>
                            }
                        </a-card>
                    </a-col>
                </a-row>
            </div>
        )
    }
})