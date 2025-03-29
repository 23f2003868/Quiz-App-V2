export default{
    template:`
        <div class="container mt-5">
            <h3 class="text-center mb-5"><span class="badge text-bg-info">Quiz Summary</span></h3>
            <div v-if="role==='user'" class="d-flex justify-content-center">
                <div class="w-75" style="height:500px">
                    <canvas id="quizChart"></canvas>
                </div>
            </div>
            
            <div v-else-if="role==='admin'">
                <div class="d-flex justify-content-evenly">
                    <h4 class="text-center">Quiz-wise Attempts</h4>
                    <button class="btn btn-success mb-3" @click="create_csv_user">Get User Details</button>
                </div>
                <div class="d-flex justify-content-center">
                    <div class="w-75" style="height:500px">
                        <canvas id="quizAttemptsChart"></canvas>
                    </div>
                </div>
               
                <h4 class="text-center mt-5">Quiz-wise Top Scores</h4>
                <div class="d-flex justify-content-center mb-5">
                    <div class="w-75" style="height:500px">
                        <canvas id="quizTopScoresChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `,

    data(){
        return{
            labels:[],
            scores:[],
            quizAttempts:[],
            topScores:[],
            chartInstance:null,
            attemptsChartInstance:null,
            topScoresChartInstance:null,
            role:this.$store.state.role
        }
    },

    mounted(){
        this.fetchData()
    },

    beforeDestroy(){
        if(this.chartInstance) this.chartInstance.destroy()
        if(this.attemptsChartInstance) this.attemptsChartInstance.destroy()
        if(this.topScoresChartInstance) this.topScoresChartInstance.destroy()
    },

    methods:{
        async fetchData(){
            const response = await fetch(location.origin+`/api/quiz_summary`,{
                method:"GET",
                headers:{
                    "Authentication-Token":this.$store.state.auth_token,
                    "UserId":this.$store.state.user_id,
                    "Role":this.$store.state.role
                }
            })

            const data = await response.json()

            if(this.role==='user' && data.userStats){
                this.labels = data.userStats.map(stat=>stat.quiz_title);
                this.scores = data.userStats.map(stat=>stat.total_scored);
                this.renderUserChart()
            }else if(this.role==='admin'){
                this.quizAttempts = data.quizAttempts;
                this.topScores = data.topScores
                this.renderAdminCharts()
            }
        },

        renderUserChart(){
            const chart = document.querySelector("#quizChart").getContext('2d')

            if (this.chartInstance){
                this.chartInstance.destroy()
            }

            this.chartInstance = new Chart(chart,{
                type:'bar',
                data:{
                    labels:this.labels,
                    datasets:[{
                        label:"Quiz Scores",
                        data:this.scores,
                        backgroundColor:'rgba(75,192,192,0.6)',
                        borderColor:'rgba(75,192,192,1)',
                        borderWidth:1
                    }]
                },
                options:{
                    responsive:true,
                    maintainAspectRatio:false,
                    scales:{
                        y:{
                            beginAtZero:true
                        }
                    }
                }
            })
        },

        renderAdminCharts(){
            const attemptChart = document.querySelector("#quizAttemptsChart").getContext("2d")
            if(this.attemptsChartInstance){
                this.attemptsChartInstance.destroy();
            }

            this.attemptsChartInstance = new Chart(attemptChart,{
                type : "pie",
                data:{
                    labels:this.quizAttempts.map(quiz=>quiz.quiz_title),
                    datasets:[{
                        label:"Total Attempts",
                        data: this.quizAttempts.map(quiz=>quiz.attempts),
                        backgroundColor:[
                            'rgba(255,99,132,0.6)',
                            'rgba(54,162,235,0.6)',
                            'rgba(255,206,86,0.6)',
                            'rgba(75,192,192,0.6)',
                            'rgba(153,102,255,0.6)',
                        ],
                        borderColor:[
                            'rgba(255,99,132,1)',
                            'rgba(54,162,235,1)',
                            'rgba(255,206,86,1)',
                            'rgba(75,192,192,1)',
                            'rgba(153,102,255,1)',
                        ],
                        borderWidth:1
                    }]
                },
                options:{
                    responsive:true,
                    maintainAspectRatio:false
                }
            })

            const topScoresChart = document.querySelector("#quizTopScoresChart").getContext("2d");
            if (this.topScoresChartInstance){
                this.topScoresChartInstance.destroy();
            }

            this.topScoresChartInstance = new Chart(topScoresChart,{
                type:"bar",
                data:{
                    labels:this.topScores.map(score=>score.quiz_title),
                    datasets:[{
                        label:"Top Score",
                        data: this.topScores.map(score=>score.total_scored),
                        backgroundColor:'rgba(54,162,235,0.6)',
                        borderColor:'rgba(54,162,235,1)',
                        borderWidth:1
                    }]
                },
                options:{
                    responsive:true,
                    maintainAspectRatio:false
                }
            })
        },

        async create_csv_user(){
            const response = await fetch(location.origin+`/user-csv`)
            const id = (await response.json()).task_id

            const wait = setInterval(async()=>{
                const result = await fetch(location.origin+`/get-user-csv/${id}`)
                if(result.ok){
                    window.open(location.origin+`/get-user-csv/${id}`)
                    clearInterval(wait)
                }
            },100)
        }
    }
}