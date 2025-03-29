import Home from "../pages/Home.js";
import Dashboard from "../pages/Dashboard.js";
import LoginPage from "../pages/LoginPage.js";
import RegisterPage from "../pages/RegisterPage.js";
import AddSubject from "../pages/AddSubject.js"
import EditSubject from "../pages/EditSubject.js"
import AddChapter from "../pages/AddChapter.js"
import EditChapter from "../pages/EditChapter.js"
import Chapter from "../pages/Chapter.js"
import QuizList from "../pages/QuizList.js"
import Score from "../pages/Score.js"
import Summary from "../pages/Summary.js"




const routes = [
    {path : '/', component : Home},
    {path : '/login', component : LoginPage},
    {path : '/register', component : RegisterPage},
    {path : '/admin_dashboard', component : Dashboard},
    {path : '/admin_dashboard/addSubject', component : AddSubject},
    {path : '/admin_dashboard/editSubject/:id', component : EditSubject},
    {path : '/admin_dashboard/addChapter/:id', component : AddChapter},
    {path : '/admin_dashboard/editChapter/:id', component : EditChapter},
    {path : '/admin_dashboard/chapters/:chapter_id', component : Chapter},
    {path : '/quiz', component : QuizList},
    {path : '/user_dashboard', component : QuizList},
    {path : '/user_dashboard/quiz/:quizID', component : QuizList},
    {path : '/score', component : Score},
    {path : '/summary', component : Summary}
]

const router = new VueRouter({
    routes
})

export default router;