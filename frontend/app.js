import Navbar from "./components/Navbar.js"
import router from "./utils/router.js"
import store from "./utils/store.js"

const app = new Vue({
    el : '#app',
    template : `
        <div>
            <Navbar v-if="showNav" />
            <div class="main-content">
                <router-view> </router-view>
            </div>
        </div>
    `,
    components : {
        Navbar,
    },
    computed:{
        showNav(){
            return !['/', '/login', '/register'].includes(this.$route.path);
        }
    },
    router,
    store,
})