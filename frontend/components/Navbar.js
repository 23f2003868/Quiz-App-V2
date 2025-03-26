export default {
    template : `
    
    <nav class="navbar navbar-expand-lg sticky-top" style="background-color: #e3f2fd">
        <a class="navbar-brand ms-3">QuizMaster</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 w-100 d-flex justify-content-evenly">
                <li class="nav-item">
                <router-link v-if="role==='admin'"  to="/quiz" class="nav-link fw-medium">Quiz</router-link>
                <router-link v-else to="/score" class="nav-link fw-medium"><i class="fa-brands fa-screenpal fa-beat"></i> Score</router-link>
                </li>
                <li class="nav-item">
                <router-link to="/summary" class="nav-link fw-medium"><i class="fa-solid fa-chart-simple fa-beat"></i> Summary</router-link>
                </li>
                <li class="nav-item">
                <button class="btn btn-danger ms-auto" @click="logout"><i class="fa-solid fa-right-from-bracket fa-beat"></i> Logout</button>
                </li>
                
            </ul>
        </div>
    </nav>
    `,

    computed : {
        role(){
            return this.$store.state.role;
        }
    },

    methods : {
        logout(){
            this.$store.commit('logout')
            localStorage.removeItem('activeQuiz')
            this.$router.push('/')
        }
    }
}



