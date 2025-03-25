export default {
    template: `
    <div class="login">
        <div class="login-card">
            
            <div>
                <label for="email" class="from-label fw-bold mb-1"><span class="text-danger">* </span>Email</label>
                <div class="input-group mb-4">
                    <span class="input-group-text">
                        <i class="fa-solid fa-envelope fa-beat" style="color: #B197FC;"></i>
                    </span>
                    <input type="email" id="email" class="form-control" placeholder = 'Enter your email' v-model = 'email'/>
                </div>
            </div>
            <div>
                <label for="password" class="form-label fw-bold"><span class="text-danger">* </span>Password</label>
                <div class="input-group mb-4">
                    <span class="input-group-text">
                        <i class="fa-solid fa-lock fa-beat" style="color: #B197FC;"></i>
                    </span>
                    <input type="password" id="password" class="form-control" placeholder = 'Password' v-model = 'password'/>
                </div>
            </div>
            <div>
                <label for="fullname" class="form-label fw-bold"><span class="text-danger">* </span>Fullname</label>
                <div class="input-group mb-4">
                    <span class="input-group-text">
                        <i class="fa-solid fa-file-signature fa-beat" style="color: #B197FC;"></i>
                    </span>
                    <input type="text" id="fullname" class="form-control" placeholder = 'Fullname' v-model = 'fullname'/>
                </div>
            </div>
            <div>
                <label for="dob" class="form-label fw-bold"><span class="text-danger">* </span>DOB</label>
                <div class="input-group mb-4">
                    <span class="input-group-text">
                        <i class="fa-solid fa-calendar-days fa-beat" style="color: #B197FC;"></i>
                    </span>
                    <input type="date" id="dob" class="form-control" placeholder = 'Date of Birth' v-model = 'dob'/>
                </div>
            </div>
            <div>
                <label for="qualification" class="form-label fw-bold"><span class="text-danger">* </span>Qualification</label>
                <div class="input-group mb-4">
                    <span class="input-group-text">
                        <i class="fa-solid fa-school fa-beat" style="color: #B197FC;"></i>
                    </span>
                    <input type="text" id="qualification" class="form-control" placeholder = 'Qualification' v-model = 'qualification'/>
                </div>
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