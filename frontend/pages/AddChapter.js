export default {
    template : `
        <div class="modal fade show d-block" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content shadow-lg p-4">
                    <div class="modal-header">
                        <h5 class="modal-title">Add Chapter</h5>
                        <button type="button" class="btn-close" @click="closeChapter"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label fw-bold" for="chapterName"><span class="text-danger">* </span>Chapter Name</label>
                            <div class="input-group mb-4">
                                <span class="input-group-text">
                                    <i class="fa-solid fa-signature fa-beat" style="color: #B197FC;"></i>
                                </span>
                                <input class="form-control" id="chapterName" v-model="chapter.name" type="text" placeholder="Enter Chapter Name" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold" for="chapterDescription"><span class="text-danger">* </span>Description</label>
                            <div class="input-group mb-4">
                                <span class="input-group-text">
                                    <i class="fa-solid fa-list fa-beat" style="color: #B197FC;"></i>
                                </span>
                                <textarea class="form-control" id="chapterDescription" v-model="chapter.description" placeholder="Enter Chapter Description" required></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-success" @click="submitChapter">Save</button>
                        <button class="btn btn-danger" @click="closeChapter">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    data(){
        return{
            chapter:{
                name:"",
                description:"",
            },
            subject_id:null
        }
    },

    created(){
        this.subject_id = this.$route.params.id;
    },

    methods :{
        async submitChapter(){
            if(!this.chapter.name.trim()){
                alert("Chapter name empty")
                return
            }

            this.chapter.subject_id = this.subject_id;

            const response = await fetch(location.origin+`/api/subjects/${this.subject_id}/chapters`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    "Authentication-Token" : this.$store.state.auth_token 
                },
                body : JSON.stringify(this.chapter)
            })

            if(response.ok){
                alert("Chapter added successfully")
                this.$router.push("/admin_dashboard")
            }else{
                alert('Failed to add chapter')
            }
        },

        closeChapter(){
            this.$router.push("/admin_dashboard")
        }
    }
}