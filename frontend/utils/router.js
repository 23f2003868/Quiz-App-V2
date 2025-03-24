import Home from "../pages/Home.js";
import Dashboard from "../pages/Dashboard.js";
import LoginPage from "../pages/LoginPage.js";
import RegisterPage from "../pages/RegisterPage.js";




const routes = [
    {path : '/', component : Home},
    {path : '/login', component : LoginPage},
    {path : '/register', component : RegisterPage},
    {path : '/admin_dashboard', component : Dashboard},
]

const router = new VueRouter({
    routes
})

export default router;