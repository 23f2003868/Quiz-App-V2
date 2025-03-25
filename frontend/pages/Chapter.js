export default{
    template : `
        <div class="container mt-4">
            <div class="card shadow-lg p-4">
                <div class="card-body">
                    <h2> <span class="card-title badge rounded-pill text-bg-secondary">{{chapter.name}}</span></h2>
                    <p class="card-description fs-5 fw-medium fst-italic">{{chapter.description}}</p>
                    <button class="btn btn-primary" @click="showQuiz = true"><i class="fa-solid fa-plus fa-beat me-2"></i> Add Quiz</button>
                </div>
            </div>

            <!--Add Quiz-->
            <div v-if = "showQuiz" class="card shadow-lg p-4 mt-5">
                <h4 class="mb-5">Create Quiz</h4>
                <div class="mb-3">
                    <label for="title" class="form-label fw-bold"><span class="text-danger">* </span>Quiz Title</label>
                    <div class="input-group mb-4">
                        <span class="input-group-text">
                            <i class="fa-solid fa-info fa-beat" style="color: #B197FC;"></i>
                        </span>
                        <input id="title" v-model="quiz.title" type="text" class="form-control" placeholder="Enter quiz title" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="date" class="form-label fw-bold"><span class="text-danger">* </span>Quiz Date</label>
                    <div class="input-group mb-4">
                        <span class="input-group-text">
                            <i class="fa-solid fa-calendar-days fa-beat" style="color: #B197FC;"></i>
                        </span>
                        <input id="date" v-model="quiz.date_of_quiz" type="date" class="form-control" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="time" class="form-label fw-bold"><span class="text-danger">* </span>Quiz Duration(min.):</label>
                    <div class="input-group mb-4">
                        <span class="input-group-text">
                            <i class="fa-solid fa-clock fa-beat" style="color: #B197FC;"></i>
                        </span>
                        <input id="time" v-model="quiz.time_duration" type="number" class="form-control" required>
                    </div>
                </div>
            
                <div class="text-center mt-3">
                    <button class="btn btn-success" @click="submitQuiz">Save</button>
                    <button class="btn btn-secondary ms-2" @click="showQuiz = false">Close</button>
                </div>
            </div>
            
            
            <!--Quiz List-->
            <div class="mt-5 card p-4 shadow-lg mb-5">
                <h4 class="text-center"><span class="badge rounded-pill text-bg-info mb-4">Quizzes</span></h4>
                <div class="row">
                    <div class="col-md-4" v-for="quiz in quizzes" :key="quiz.id">
                        <div class="card shadow-lg p-3 mb-3">
                            <div class="card-body">
                                <h5 class="card-title">{{quiz.title}}</h5>
                                <p>Date: {{quiz.date_of_quiz}}</p>
                                <p>Duration: {{quiz.time_duration}} min</p>
                                <div class="btn-group mt-3 d-flex justify-content-center">
                                    <button class="btn btn-warning btn-sm me-2 rounded" @click="openEditModal(quiz)"><i class="fa-solid fa-pen fa-beat me-2"></i> Edit</button>
                                    <button class="btn btn-danger btn-sm me-2 rounded" @click="deleteQuiz(quiz.id)"><i class="fa-solid fa-trash fa-beat me-2"></i> Delete</button>
                                    <button class="btn btn-info btn-sm rounded" @click="openAddQuestionModal(quiz.id)"><i class="fa-solid fa-plus fa-beat me-2"></i> Add Question</button>
                                </div>
                                <div class="d-flex justify-content-center mt-3">
                                    <button class="btn btn-info btn-sm rounded" @click="toggleQuestions(quiz.id)">View Questions</button>
                                </div>
                            </div>
                            <div v-if="quiz.questions && quiz.questions.length">
                                <table class="table mt-3">
                                    <thead>
                                        <tr>
                                            <th class="text-center">S.No</th>
                                            <th class="text-center">Title</th>
                                            <th class="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(question, index) in quiz.questions" :key="question.id">
                                            <td class="text-center">{{index+1}}</td>
                                            <td class="text-center">{{question.title}}</td>
                                            <td class="text-center"><button class="btn btn-sm btn-warning" @click="openEditQuestionModal(question,quiz.id)"><i class="fa-solid fa-pen fa-beat me-2"></i> Edit</button> | <button class="btn btn-sm btn-danger" @click="deleteQuestion(question.id, quiz.id)"><i class="fa-solid fa-trash fa-beat me-2"></i> Delete</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <!--Add Question-->
            <div class="card shadow-lg p-4 mb-5" v-if="showAddQuestion">
                <div class="modal-content">
                    <h4 class="mb-5">Add Question</h4>
                    
                    <div class="mb-3">
                        <label for="title" class="form-label fw-bold"><span class="text-danger">* </span>Question Title</label>
                        <div class="input-group mb-4">
                            <span class="input-group-text">
                                <i class="fa-solid fa-info fa-beat" style="color: #B197FC;"></i>
                            </span>
                            <input id="title" v-model="newQuestion.title" class="form-control" type="text" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="question" class="form-label fw-bold"><span class="text-danger">* </span>Question Statement</label>
                        <div class="input-group mb-4">
                            <span class="input-group-text">
                                <i class="fa-solid fa-rectangle-list fa-beat" style="color: #B197FC;"></i>
                            </span>
                            <input id="question" v-model="newQuestion.question_statement" class="form-control" type="text" required>
                        </div>
                    </div>
                    <div v-for="(option, index) in newQuestion.options" class="mb-3" :key="index">
                        <label :for="index" class="form-label fw-bold"><span class="text-danger">* </span>Option {{index+1}}</label>
                        <div class="input-group mb-4">
                            <span class="input-group-text">
                                <i class="fa-solid fa-square-check fa-beat" style="color: #B197FC;"></i>
                            </span>
                            <input :id="index" v-model="newQuestion.options[index]" type="text" class="form-control" required>
                        </div>
                    </div>

                    <button class="btn btn-sm btn-success" v-if="newQuestion.options.length<4" @click="addOption"><i class="fa-solid fa-plus fa-beat me-2"></i>  Add Option</button>
                    <button class="btn btn-sm btn-danger mt-3" v-if="newQuestion.options.length>2" @click="removeOption">- Remove Option</button>
               
                    <div class="mb-3 mt-3">
                        <label for="correct" class="form-label fw-bold"><span class="text-danger">* </span>Correct Option</label>
                        <div class="input-group mb-4">
                            <span class="input-group-text">
                                <i class="fa-solid fa-square-check fa-beat" style="color: #B197FC;"></i>
                            </span>
                            <select id="correct" class="form-control" v-model="newQuestion.correct_option">
                                <option v-for="(option, index) in newQuestion.options" :value="option">{{option}}</option>
                            </select>
                        </div>
                    </div>

                    <div class="text-center mt-3">
                        <button class="btn btn-success" @click="submitQuestion">Submit</button>
                        <button class="btn btn-secondary ms-2" @click="showAddQuestion = false">Close</button>
                    </div>

                </div>

            </div>
            
            <!--Edit Question-->
            <div class="card shadow-lg p-4 mb-5" v-if="showEditQuestion">
                <div class="modal-content">
                    <h4 class="mb-5">Edit Question</h4>
                    
                    <div class="mb-3">
                        <label for="title" class="form-label">Question Title</label>
                        <div class="input-group mb-4">
                            <span class="input-group-text">
                                <i class="fa-solid fa-info fa-beat" style="color: #B197FC;"></i>
                            </span>
                            <input id="title" v-model="editQuestionData.title" class="form-control" type="text" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="question" class="form-label">Question Statement</label>
                        <div class="input-group mb-4">
                            <span class="input-group-text">
                                <i class="fa-solid fa-rectangle-list fa-beat" style="color: #B197FC;"></i>
                            </span>
                            <input id="question" v-model="editQuestionData.question_statement" class="form-control" type="text" required>
                        </div>
                    </div>
                    <div v-for="(option, index) in editQuestionData.options" class="mb-3" :key="index">
                        <label :for="index" class="form-label">Option {{index+1}}</label>
                        <div class="input-group mb-4">
                            <span class="input-group-text">
                                <i class="fa-solid fa-square-check fa-beat" style="color: #B197FC;"></i>
                            </span>
                            <input :id="index" v-model="editQuestionData.options[index]" type="text" class="form-control" required>
                        </div>
                    </div>
               
                    <div class="mb-3 mt-3">
                        <label class="form-label">Correct Option</label>
                        <div class="input-group mb-4">
                            <span class="input-group-text">
                                <i class="fa-solid fa-square-check fa-beat" style="color: #B197FC;"></i>
                            </span>
                            <select class="form-control" v-model="editQuestionData.correct_option">
                                <option v-for="(option, index) in editQuestionData.options" :value="option">{{option}}</option>
                            </select>
                        </div>
                    </div>

                    <div class="text-center mt-3">
                        <button class="btn btn-success" @click="updateQuestion">Submit</button>
                        <button class="btn btn-secondary ms-2" @click="showEditQuestion = false">Close</button>
                    </div>

                </div>

            </div>


            <!--Edit Quiz-->
            <div v-if="showEditQuiz" class="card shadow-lg p-4 mb-5">
                    <div class="modal-content">
                        <h4 class="mb-5">Edit Quiz</h4>
                        <div class="mb-3">
                            <label class="form-label">Quiz Title</label>
                            <div class="input-group mb-4">
                                <span class="input-group-text">
                                    <i class="fa-solid fa-info fa-beat" style="color: #B197FC;"></i>
                                </span>
                                <input v-model="editQuizData.title" type="text" class="form-control" placeholder="Enter quiz title" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Quiz Date</label>
                            <div class="input-group mb-4">
                                <span class="input-group-text">
                                    <i class="fa-solid fa-calendar-days fa-beat" style="color: #B197FC;"></i>
                                </span>
                                <input v-model="editQuizData.date_of_quiz" type="date" class="form-control" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Quiz Duration(min.)</label>
                            <div class="input-group mb-4">
                                <span class="input-group-text">
                                <i class="fa-solid fa-clock fa-beat" style="color: #B197FC;"></i>
                                </span>
                                <input v-model="editQuizData.time_duration" type="number" class="form-control" required>
                            </div>
                        </div>
                    
                        <div class="text-center mt-3">
                            <button class="btn btn-success" @click="updateQuiz">Update</button>
                            <button class="btn btn-secondary ms-2" @click="showEditQuiz = false">Close</button>
                        </div>
                    </div>
                </div>
            </div>
                `,
                
    data(){
        return{
            chapter :{
                id: null,
                name : "",
                description : "",
            },

            quizzes : [],
            showQuiz: false,
            showEditQuiz: false,
            showAddQuestion: false,
            quiz :{
                title : "",
                date_of_quiz : "",
                time_duration : null,
            },
            editQuizData :{
                id : null,
                title : "",
                date_of_quiz : "",
                time_duration : null,
            },
            newQuestion :{
                title : "",
                question_statement:"",
                options:["",""],
                correct_option:null,
                quizId:null
            },
            showEditQuestion : false,
            editQuestionData : {
                id : null,
                title:"",
                question_statement:"",
                options:[],
                correct_option : 0,
                quizId :null
            }
        }
    },

    created(){
        this.fetchChapter();
        this.fetchQuizzes();
    },

    methods : {
        async fetchChapter(){
            const chapterId = this.$route.params.chapter_id;
            const response = await fetch(location.origin+`/api/chapters/${chapterId}`,{
                headers : {
                    "Authentication-Token" : this.$store.state.auth_token
                }
            })

            if(response.ok){
                this.chapter = await response.json()
            }else{
                alert('Failed to fetch chapter details');
            }
        },

        async fetchQuizzes(){
            const chapterId = this.$route.params.chapter_id;
            const response = await fetch(location.origin+`/api/chapters/${chapterId}/quizzes`,{
                headers : {
                    "Authentication-Token" : this.$store.state.auth_token
                }
            })

            if(response.ok){
                this.quizzes = await response.json();
                this.quizzes = this.quizzes.map(quiz=>({...quiz, questions :[]}))
                
            }else{
                this.quizzes = []
            }
        },

        async submitQuiz(){
            if(!this.quiz.title.trim() || !this.quiz.date_of_quiz || !this.quiz.time_duration.trim()){
                alert('Please fill all fields')
                return
            }

            const response = await fetch(location.origin+`/api/chapters/${this.chapter.id}/quizzes`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    "Authentication-Token" : this.$store.state.auth_token
                },
                
                body : JSON.stringify(this.quiz)
            })
            
            if(response.ok){
                alert('Quiz added successfully')
                this.quiz = {
                    title : "",
                    date_of_quiz : "",
                    time_duration : null

                }
                this.showQuiz = false
                this.fetchQuizzes()
            }else{
                alert('Failed to add quiz')
            }
        },
        
        openEditModal(quiz){
            this.editQuizData = {...quiz, date_of_quiz: quiz.date_of_quiz ? quiz.date_of_quiz.split("T")[0] : ""};
            this.showEditQuiz = true;
        },
        
        async updateQuiz(){
            const response = await fetch(`${location.origin}/api/quizzes/${this.editQuizData.id}`, {
                method : "PUT",
                headers : {
                    "Content-Type" : "application/json",
                    "Authentication-Token" : this.$store.state.auth_token,
                },
                body : JSON.stringify(this.editQuizData)
            });

            if(response.ok){
                alert('Quiz Update Successfully')
                this.showEditQuiz = false;
                this.fetchQuizzes();
            }else{
                alert('Failed to update quiz')
            }
        },

        async deleteQuiz(quizId){
            if(!confirm('Are you sure to delete quiz')) return

            const response = await fetch(location.origin+`/api/quizzes/${quizId}`,{
                method : "DELETE",
                headers : {
                    "Authentication-Token" : this.$store.state.auth_token
                }
            })

            if(response.ok){
                alert('Quiz deleted successfully')
                this.fetchQuizzes()
            }else{
                alert('Failed to delete quiz')
            }
        },

        openAddQuestionModal(quizId){
           this.newQuestion = {
            title : "",
            question_statement : "",
            options : ["",""],
            correct_option : 0,
            quizId : quizId
           }
           this.showAddQuestion = true;
        },

        async submitQuestion(){

            while(this.newQuestion.options.length<4){
                this.newQuestion.options.push("")
            }

            const response = await fetch(`${location.origin}/api/quizzes/${this.newQuestion.quizId}/questions`, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    "Authentication-Token" : this.$store.state.auth_token
                },
                body : JSON.stringify(this.newQuestion)
            });

            if(response.ok){
                alert('Question added successfully');
                this.showAddQuestion = false;
                this.fetchQuizzes()
                this.toggleQuestions(this.newQuestion.quizId)
            }else{
                alert('Failed to add question')
            }
        },

        addOption(){
            if(this.newQuestion.options.length < 4){
                this.newQuestion.options.push("");
            }
        },

        removeOption(){
            if(this.newQuestion.options.length > 2){
                this.newQuestion.options.pop()
            }
        },

        async toggleQuestions(quizId){
            const quizIndex = this.quizzes.findIndex(q=> q.id === quizId);
            if (quizIndex === -1) return
                
                const response = await fetch(`${location.origin}/api/quizzes/${quizId}/questions`,{
                    headers : {
                        "Authentication-Token" : this.$store.state.auth_token
                    }
                });

                if(response.ok){
                    const questions = await response.json()
                    this.$set(this.quizzes,quizIndex,{...this.quizzes[quizIndex], questions})
                    
                }else{
                    this.$set(this.quizzes,quizIndex,{...this.quizzes[quizIndex], questions:[]})
                    
                }
        },

        async deleteQuestion(questionId, quizId){
            if(!confirm('Are you sure to delete question?')) return;

            const response = await fetch(`${location.origin}/api/questions/${questionId}`,{
                method : "DELETE",
                headers : {
                    "Authentication-Token" : this.$store.state.auth_token
                }
            });

            if(response.ok){
                alert('Question deleted successfully')
                this.toggleQuestions(quizId)
            }else{
                alert('Failed to delete question')
            }
        },

        openEditQuestionModal(question, quizId){
            console.log(question)
            this.editQuestionData = {
                id : question.id,
                title : question.title,
                question_statement : question.question_statement,
                options : [question.option1, question.option2, question.option3, question.option4].filter(opt => opt !== ""),
                correct_option : question.correct_option,
                quizId : quizId
            };
            console.log(this.correct_option)
            this.showEditQuestion = true;
        },

        async updateQuestion() {
            const response = await fetch(`${location.origin}/api/questions/${this.editQuestionData.id}`,{
                method : "PUT",
                headers : {
                    "Content-Type" : "application/json",
                    "Authentication-Token" : this.$store.state.auth_token
                },

                body : JSON.stringify(this.editQuestionData)
            })

            if(response.ok){
                alert('Question updated successfully')
                this.showEditQuestion = false
                this.toggleQuestions(this.editQuestionData.quizId)
            }else{
                alert('Failed to update question')
            }
        }

    }
}