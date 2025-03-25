export default {
    template : `
        <div class="modal fade show d-block" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content shadow-lg p-4">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Subject</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label fw-bold" for="editSubject"><span class="text-danger">* </span>Subjcet Name:</label>
                            <div class="input-group mb-4">
                                <span class="input-group-text">
                                    <i class="fa-solid fa-signature fa-beat" style="color: #B197FC;"></i>
                                </span>
                                <input class="form-control" v-model="subject.name" id="editSubject" type="text" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold" for="editDescription"><span class="text-danger">* </span>Description:</label>
                            <div class="input-group mb-4">
                                <span class="input-group-text">
                                    <i class="fa-solid fa-list fa-beat" style="color: #B197FC;"></i>
                                </span>
                                <textarea class="form-control" v-model="subject.description" id="editDescription"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-success" @click="updateSubject">Save</button>
                        <button class="btn btn-danger" @click="closeModal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    data(){
        return{
            subject :{
                name :"",
                description :""
            }
        }
    },

    async created(){
        const subjectId = this.$route.params.id;
        const response = await fetch(location.origin+`/api/subjects/${subjectId}`,{
            headers : {
                "Authentication-Token" : this.$store.state.auth_token
            }
        })

        if (response.ok){
            this.subject = await response.json();
        }else{
            alert('Failed to fetch subject')
        }
    },

    methods :{
        async updateSubject() {
            if (!this.subject.name.trim()){
                alert("Subject name empty");
                return
            }

            const response = await fetch(location.origin+`/api/subjects/${this.$route.params.id}`,{
                method : "PUT",
                headers :{
                    "Content-Type" : "application/json",
                    "Authentication-Token" : this.$store.state.auth_token
                },
                body : JSON.stringify(this.subject)
            })

            if(response.ok){
                alert('Subject updated successfully')
                this.$router.push('/admin_dashboard')
            }else{
                alert('Failed to update Subject')
            }
        },
        
        closeModal(){
            this.$router.push('/admin_dashboard')
        }
    }


}