export default {
    template : `
        <div class="container mt-5">
        <div class="d-flex justify-content-evenly">
            <h2 class="mb-3 text-center"><span class="badge rounded-pill text-bg-info">Quizzes</span></h2>
            <button class="btn btn-success mb-3" @click="create_csv">Get Quizzes Data</button>
        </div>
            <table class="table table-bordered table-striped" v-if="quizzes.length>0 && !currentQuiz ">
                <thead class="table-primary">
                    <tr>
                        <th class="text-center">S.No</th>
                        <th class="text-center">Title</th>
                        <th class="text-center">Date</th>
                        <th class="text-center">Duration(min)</th>
                        <th class="text-center" v-if="role==='user'">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(quiz, index) in quizzes" :key="quiz.id">
                        <td class="text-center">{{index+1}}</td>
                        <td class="text-center">{{quiz.title}}</td>
                        <td class="text-center">{{quiz.date_of_quiz}}</td>
                        <td class="text-center">{{quiz.time_duration}}</td>
                        <td class="text-center" v-if="role==='user'"><button class="btn btn-success" @click="startQuiz(quiz)" :disabled="!quiz.isToday">Start</button></td>
                    </tr>
                </tbody>
            </table>
            
            <div class="mt-4" v-if="currentQuiz">
                <div class="d-flex justify-content-evenly mb-5">
                    <h3 class="text-center">{{currentQuiz.title}}</h3>
                    <span class="text-center border border-dark bg-dark text-success px-2 rounded fs-3 fw-bold shadow">{{getTimeLeft(currentQuiz.id)}}</span>
                </div>
                <div v-for="(question, index) in questions" :key="question.id" class="card mt-3">
                    <div class="card-body">
                        <h5 class="card-title">{{index+1}}. {{question.question_statement}}</h5>
                        <div class="form-check" v-for="option in ['option1', 'option2', 'option3', 'option4'].filter(opt=>question[opt].trim()!=='')" :key="option">
                            <input :id="'option-'+question.id+'-'+option" class="form-check-input" type="radio" :name="'question-'+question.id" :value="question[option]" v-model="userAnswers[question.id]"> 
                            <label :for="'option-'+question.id+'-'+option" class="form-check-label">{{question[option]}}</label>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-3">
                    <button class="btn btn-primary" @click="submitQuiz()">Submit Quiz</button>
                </div>
            </div>
            
        </div>
    `,

    data(){
        return{
            quizzes:[],
            questions:[],
            currentQuiz:null,
            userAnswers:{},
            correctAnswers:{},
            activeQuizzes:{},
            timers:{}
        }
    },

    computed : {
        role(){
            return this.$store.state.role;
        }
    },

    watch : {
        userAnswers : {
            deep : true,
            handler(){
                if(this.currentQuiz){
                    localStorage.setItem("activeQuiz", JSON.stringify({
                        quiz : this.currentQuiz,
                        endTime : this.activeQuizzes[this.currentQuiz.id],
                        userAnswers : this.userAnswers
                    }))
                }
            }
        }
    },

    methods : {
        async fetchQuizzes(){
            const response = await fetch(location.origin+`/api/quizzes`,{
                headers :{
                    "Authentication-Token" : this.$store.state.auth_token
                }
            })
            
            if(response.ok){
                const data = await response.json()
                if(Array.isArray(data)){
                    const today = new Date().toISOString().split('T')[0];
                    this.quizzes = data.map(quiz=>({
                        ...quiz,
                        isToday : quiz.date_of_quiz === today
                    }))
                }
            }
        },

        async startQuiz(quiz){
            if(this.activeQuizzes[quiz.id]) return;

            this.currentQuiz = quiz;
            const endTime = Date.now()+quiz.time_duration*60*1000;
            this.activeQuizzes[quiz.id] = endTime

            localStorage.setItem("activeQuiz", JSON.stringify({
                quiz : quiz,
                endTime : endTime,
                userAnswers : this.userAnswers
            }))

            const response = await fetch(location.origin +`/api/questions/${quiz.id}`,{
                headers : {
                    "Authentication-Token" : this.$store.state.auth_token
                }
            })

            if(response.ok){
                const data = await response.json();
                this.questions = data;

                this.correctAnswers = {}
                data.forEach(q=>{
                    this.correctAnswers[q.id] = q.correct_option
                })
            }


            this.timers[quiz.id] = setInterval(()=>{
                const timeLeft = this.getTimeLeft(quiz.id);
                this.$forceUpdate();
                if(timeLeft === "00:00"){
                    clearInterval(this.timers[this.currentQuiz.id])
                    this.submitQuiz()
                }
            },1000)
        },
        
        getTimeLeft(quizId){
            if(!this.activeQuizzes[quizId]) return "--:--"
            
            const timeRemaining = Math.max(0, this.activeQuizzes[quizId]- Date.now());
            const minutes = String(Math.floor(timeRemaining/60000)).padStart(2,"0")
            const seconds = String(Math.floor((timeRemaining%60000)/1000)).padStart(2,"0")
            if(timeRemaining <=0){
                clearInterval(this.timers[this.currentQuiz.id])
                return "00:00"
            }
            return `${minutes}:${seconds}`
        },

        async submitQuiz() {
            if(!this.$store.state.auth_token){
                return
            }
            clearInterval(this.timers[this.currentQuiz.id])

            let totalScore = 0;
            for(const questionId in this.userAnswers){
                if(this.userAnswers[questionId]===this.correctAnswers[questionId]){
                    totalScore += 1
                }
            }

            console.log(this.userAnswers)

            const response = await fetch(location.origin+`/api/submit_quiz`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    "Authentication-Token" : this.$store.state.auth_token
                },

                body : JSON.stringify({
                    quiz_id : this.currentQuiz.id,
                    user_id : this.$store.state.user_id,
                    score : totalScore
                })
        
            })

            const responseData = await response.json()
            console.log(responseData)
            console.log(this.userAnswers)
            
            if(response.ok){
                alert(`Quiz submitted successfully! Your Score: ${totalScore}`)
            }else{
                alert(`Failed to submit quiz.`)
            }
            localStorage.removeItem("activeQuiz")
            this.currentQuiz = null
            this.userAnswers={}
            this.questions=[]
            this.correctAnswers={}
        },

        async create_csv(){
            const response = await fetch(location.origin+`/create-quiz-csv`)
            const id = (await response.json()).task_id

            const wait = setInterval(async()=>{
                const result = await fetch(location.origin+`/get-quiz-csv/${id}`)
                if(result.ok){
                    window.open(location.origin+`/get-quiz-csv/${id}`)
                    clearInterval(wait)
                }
            },100)
        }
    },

    mounted(){
        this.fetchQuizzes()

        const storeQuiz = JSON.parse(localStorage.getItem("activeQuiz"));
        if(storeQuiz){
            const timeRemaining = storeQuiz.endTime-Date.now();
            if(timeRemaining>0){
                this.currentQuiz = storeQuiz.quiz;
                this.activeQuizzes[this.currentQuiz.id] = storeQuiz.endTime;
                this.userAnswers = storeQuiz.userAnswers || {}

                fetch(location.origin +`/api/questions/${this.currentQuiz.id}`,{
                    headers : {
                        "Authentication-Token" : this.$store.state.auth_token
                    }
                })
        
                .then(response=>response.json())
                .then(data=>{

                    this.questions = data;
        
                    this.correctAnswers = {}
                    data.forEach(q=>{
                        this.correctAnswers[q.id] = q.correct_option
                    })
                })
        
        
                this.timers[this.currentQuiz.id] = setInterval(()=>{
                    const timeLeft = this.getTimeLeft(this.currentQuiz.id);
                    this.$forceUpdate();
                    if(timeLeft === "00:00"){
                        clearInterval(this.timers[this.currentQuiz.id])
                        this.submitQuiz()
                    }
                },1000)
            }else{
                localStorage.removeItem('activeQuiz')
            }
        }
    }
}