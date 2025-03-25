export default{
    template :`
    <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow-lg p-4">
                <div class="modal-header">
                    <h5 class="modal-title">Add Subject</h5>
                    <button type="button" class="btn-close" @click="closeAddSubjectModal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label fw-bold" for="subjectName"><span class="text-danger">* </span>Subject Name</label>
                        <div class="input-group mb-4">
                            <span class="input-group-text">
                                <i class="fa-solid fa-signature fa-beat" style="color: #B197FC;"></i>
                            </span>
                            <input class="form-control" id="subjectName" v-model="newSubject.name" type="text" placeholder="Enter the Subject name" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="description" class="form-label fw-bold" for="subjectDescription"><span class="text-danger">* </span>Description</label>
                        <div class="input-group mb-4">
                            <span class="input-group-text">
                                <i class="fa-solid fa-list fa-beat" style="color: #B197FC;"></i>
                            </span>
                            <textarea id="description" class="form-control" id="subjectDescription" v-model="newSubject.description" placeholder="Enter Subject description" required></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success" @click="submitSubject">Save</button>
                    <button class="btn btn-danger" @click="closeAddSubjectModal">Cancel</button>
                </div>
            </div>
        </div>
    </div>
    `,
    data(){
        return{
            newSubject : {
                name :"",
                description : ""
            }
        }
    },
    methods : {
        closeAddSubjectModal(){
            this.$router.push('/admin_dashboard')
        },
        async submitSubject(){
            if (!this.newSubject.name.trim()) return;
        
            const response = await fetch(location.origin+`/api/subjects`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    "Authentication-Token" : this.$store.state.auth_token
                },
                body : JSON.stringify(this.newSubject)
            });

            if (response.ok){
                this.$router.push('/admin_dashboard')
            }
        }
    }

}