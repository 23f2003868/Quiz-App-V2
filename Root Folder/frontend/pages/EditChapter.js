export default {
    template : `
        <div class="modal fade show d-block" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content shadow-lg p-4">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Chapter</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label fw-bold" for="editChapter"><span class="text-danger">* </span>Chapter Name</label>
                            <div class="input-group mb-4">
                                <span class="input-group-text">
                                    <i class="fa-solid fa-signature fa-beat" style="color: #B197FC;"></i>
                                </span>
                                <input class="form-control" v-model="chapter.name" id="editChapter" type="text" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold" for="editDescription"><span class="text-danger">* </span>Description</label>
                            <div class="input-group mb-4">
                                <span class="input-group-text">
                                    <i class="fa-solid fa-list fa-beat" style="color: #B197FC;"></i>
                                </span>
                                <textarea class="form-control" v-model="chapter.description" id="editDescription"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-success" @click="updateChapter">Save</button>
                        <button class="btn btn-danger" @click="closeModal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    data(){
        return{
            chapter :{
                name :"",
                description :""
            }
        }
    },

    async created(){
        const chapterId = this.$route.params.id;
        const response = await fetch(location.origin+`/api/chapters/${chapterId}`,{
            headers : {
                "Authentication-Token" : this.$store.state.auth_token
            }
        })

        if (response.ok){
            this.chapter = await response.json();
        }else{
            alert('Failed to fetch chapter')
        }
    },

    methods :{
        async updateChapter() {
            if (!this.chapter.name.trim()){
                alert("Chapter name empty");
                return
            }

            const response = await fetch(location.origin+`/api/chapters/${this.$route.params.id}`,{
                method : "PUT",
                headers :{
                    "Content-Type" : "application/json",
                    "Authentication-Token" : this.$store.state.auth_token
                },
                body : JSON.stringify(this.chapter)
            })

            if(response.ok){
                alert('Chapter updated successfully')
                this.$router.push('/admin_dashboard')
            }else{
                alert('Failed to update chapter')
            }
        },
        
        closeModal(){
            this.$router.push('/admin_dashboard')
        }
    }


}