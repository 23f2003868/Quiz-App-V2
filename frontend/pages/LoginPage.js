export default {
    template: `
        <div class="login">
            <div class="login-card">
                <h2 class="mb-5">Welcome Back to Quiz Master</h2>
                <div>
                    <label for="email" class="form-label fw-bold"><span class="text-danger">* </span>Email</label>
                    <input type="email" id="email" class="form-control mb-4" placeholder = 'Enter your email' v-model = 'email'/>
                </div>
                <div>
                    <label for="password" class="form-label fw-bold"><span class="text-danger">* </span>Password</label>
                    <input type="password" id="password" class="form-control mb-4" placeholder = 'Enetr your password' v-model = 'password'/>
                </div>
                <button class='btn btn-primary w-100 mb-4' @click="submitLogin">Login</button>
                <p class="text-center fw-bold">
                        Don't have an account? <router-link to="/register" class="text-decoration-none">Register</router-link>
                </p>
            
            </div>
        </div>
    `,

    data() {
        return {
            email: null,
            password: null
        }

    },

    methods: {
        async submitLogin() {
            try {
                const response = await fetch(location.origin + '/login',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: this.email, password: this.password })

                    })
                if (response.ok) {
                    console.log("logged in")
                    const data = await response.json()
                    localStorage.setItem('user', JSON.stringify(data))
                    this.$store.commit('setUser')
                    
                    if(data.role == 'admin'){
                        this.$router.push('/admin_dashboard');
                    }else{
                        this.$router.push('/user_dashboard')
                    }
                }
            } catch (err) {
                console.error("An error occurred", err)
            }
        }
    }
}