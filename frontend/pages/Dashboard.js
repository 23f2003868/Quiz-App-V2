export default {
    template: `
    <div class="container mt-4">
        <h2 class=" mb-3 text-center"><span class="badge text-bg-secondary">Subjects List</span></h2>
        <div class="row">
            <div v-for="subject in subjects" :key="subject.id" class="col-md-6 col-lg-4">
                <div class="card shadow p-3 mb-4">
                    <h3 class="text-center"><span class="badge rounded-pill text-bg-info">{{subject.name}}</span></h3>
                    <div class="btn-group mt-3 d-flex justify-content-center">
                        <button class="btn btn-sm btn-warning me-2 rounded" @click="EditSubjectModal(subject.id)">Edit Subject</button>
                        <button class="btn btn-sm btn-danger me-2 rounded" @click="DeleteSubjectModal(subject.id)">Delete Subject</button>
                        <button class="btn btn-sm btn-primary rounded" @click="AddChapterModal(subject.id)">Add Chapter</button>
                    </div>

                    <table v-if="subject.chapters.length > 0" class="table table-bordered mt-3">
                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Chapter Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(chapter, index) in subject.chapters" :key="chapter.id">
                                <td>{{index+1}}</td>
                                <td><button class="btn btn-link p-0 text-primary fw-bold" @click="chapterDetails(chapter.id)">{{chapter.name}}</button></td>
                                <td><button class="btn btn-warning btn-sm rounded" @click="editChapter(chapter.id)" >Edit</button> | <button class="btn btn-danger btn-sm rounded" @click="DeleteChapter(chapter.id)">Delete</button></td>
                            </tr>
                        </tbody>
                    </table>
                    <p class="text-muted" v-else>No chapters available</p>
                </div>
            </div>
        </div>
        <div class="text-center mt-5">
            <button class="btn btn-success mb-5" @click="AddSubjectModal">+ Add Subjects</button>
        </div>
    </div>
    `,
    data() {
        return {
            subjects: [],
        }
    },
    methods: {
        async fetchSubjects() {
            const response = await fetch(location.origin + '/api/subjects', {
                headers: {
                    "Authentication-Token": this.$store.state.auth_token
                }
            })

            if(response.ok){
                this.subjects = await response.json()
                this.fetchChapters()
            }
        },

        async fetchChapters(){
            for (let subject of this.subjects) {
                
                const response = await fetch(location.origin+`/api/subjects/${subject.id}/chapters`,{
                    headers : {
                        "Authentication-Token" : this.$store.state.auth_token
                    }
                })
                
                if(response.ok){
                    subject.chapters = await response.json()
                }else{
                    subject.chapters = [];
                }
            }

            this.$forceUpdate()
        },
        AddSubjectModal() {
            this.$router.push('/admin_dashboard/addSubject')
        },
        EditSubjectModal(id) {
            this.$router.push(`/admin_dashboard/editSubject/${id}`)
        },
        async DeleteSubjectModal(id) {
            if (!confirm("Are you want to Delete?")) return;

            const response = await fetch(location.origin + `/api/subjects/${id}`, {
                method: "DELETE",
                headers: {
                    "Authentication-Token": this.$store.state.auth_token
                }
            })

            if (response.ok) {
                await this.fetchSubjects()
            } else {
                alert("Failed to delete Subject.")
            }
        },
        AddChapterModal(id){
            this.$router.push(`/admin_dashboard/addChapter/${id}`)
        },
        editChapter(id){
            this.$router.push(`/admin_dashboard/editChapter/${id}`)
        },
        async DeleteChapter(id) {
            if (!confirm("Are you want to Delete?")) return;

            const response = await fetch(location.origin + `/api/chapters/${id}`, {
                method: "DELETE",
                headers: {
                    "Authentication-Token": this.$store.state.auth_token
                }
            })

            if (response.ok) {
                alert('Chapter deleted successfully')
                await this.fetchSubjects()
            } else {
                alert("Failed to delete chapter.")
            }
        },
        chapterDetails(chapterId){
            this.$router.push(`/admin_dashboard/chapters/${chapterId}`)
        }
    },
    async mounted() {
        await this.fetchSubjects();
    },
}