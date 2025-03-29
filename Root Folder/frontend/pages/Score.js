export default {
    template : `
        <div class="container mt-3">
            <h2 class="mb-3 text-center"><span class="badge rounded-pill text-bg-info">Quiz Scores</span></h2>
            <table class="table table-striped table-hover">
                <thead class="table-primary">
                    <tr>
                        <th class="text-center">S.No.</th>
                        <th class="text-center">Quiz Title</th>
                        <th class="text-center">Score</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(score, index) in scores" :key="scores.quiz_id">
                        <td class="text-center">{{index+1}}</td>
                        <td class="text-center">{{score.quiz_title}}</td>
                        <td class="text-center">{{score.total_scored}}</td>
                    </tr>
                </tbody>

            </table>
        </div>
    `,

    data(){
        return{
            scores:[]
        }
    },

    mounted(){
        this.fetchScores();
    },

    methods : {
        async fetchScores(){
            const userId = this.$store.state.user_id;
            const response = await fetch(location.origin+`/api/user/${userId}/score`,{
                headers : {
                    "Authentication-Token" : this.$store.state.auth_token
                }
            })

            const data = await response.json();
            if(response.ok){
                this.scores = data;
            }else{
                alert('Failed to fetch scores')
            }
        }
    }
}