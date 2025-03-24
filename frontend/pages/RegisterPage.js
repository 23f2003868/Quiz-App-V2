export default {
    template: `
    <div class="login">
        <div class="login-card">
            
            <div>
                <label for="email" class="from-label fw-bold mb-1"><span class="text-danger">* </span>Email</label>
                <input type="email" id="email" class="form-control mb-4" placeholder = 'Enter your email' v-model = 'email'/>
            </div>
            <div>
                <label for="password" class="form-label fw-bold"><span class="text-danger">* </span>Password</label>
                <input type="password" id="password" class="form-control mb-4" placeholder = 'Password' v-model = 'password'/>
            </div>
            <div>
                <label for="fullname" class="form-label fw-bold"><span class="text-danger">* </span>Fullname</label>
                <input type="text" id="fullname" class="form-control mb-4" placeholder = 'Fullname' v-model = 'fullname'/>
            </div>
            <div>
                <label for="dob" class="form-label fw-bold"><span class="text-danger">* </span>DOB</label>
                <input type="date" id="dob" class="form-control mb-4" placeholder = 'Date of Birth' v-model = 'dob'/>
            </div>
            <div>
                <label for="qualification" class="form-label fw-bold"><span class="text-danger">* </span>Qualification</label>
                <input type="text" id="qualification" class="form-control mb-4" placeholder = 'Qualification' v-model = 'qualification'/>
            </div>
            <button class='btn btn-primary w-100 mb-4' @click="submitRegister">Register</button>
            <p class="text-center fw-bold">
                Have an account? <router-link to="/login" class="text-decoration-none">Login</router-link>
            </p>
        </div>
    </div>
    `,

    data() {
        return {
            email: null,
            password: null,
            fullname: null,
            dob: null,
            qualification: null
        }

    },

    methods: {
        async submitRegister() {
            try {
                const response = await fetch(location.origin + '/register',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: this.email, password: this.password, fullname: this.fullname, dob: this.dob, qualification: this.qualification })

                    })
                
                const result = await response.json()

                if (response.ok) {
                    console.log("Register successfully:", result.message)
                    this.$router.push('/login')
                }else{
                    console.error("Registration failed:", result.message)
                }
            } catch (err) {
                console.error("An error occurred", err)
            }
        }
    }
}