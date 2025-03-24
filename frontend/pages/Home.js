export default {
    template : `
        <div>
            <header class="hero d-flex flex-column flex-md-row align-items-center text-align-center text-white px-3 px-md-5">
                <div class="hero-text w-100 w-md-50">
                    <h1 class="display-5 fw-bold">Welcome to Quiz Master</h1>
                    <p class="fs-5">Test your knowledge with quizzes on different Subject and their respective topics..</p>
                    <router-link to="/register" class="btn btn-primary btn-lg animate-btn">Get Started</router-link>
                    <router-link to="/login" class="btn btn-outline-light btn-lg ms-3 animate-btn">Login</router-link>
                </div>
                <div class="hero-img w-100 w-md-50">
                    <div class="quiz-img"></div>
                </div>
            </header>

            <section class="container my-5">
                <div class="row text-center">
                    <div class="col-md-4 mb-4">  
                        <div class="card p-4 shadow-lg feature-card" style="min-height:15rem;">
                            <i class="fa-solid fa-book-open-reader text-primary fs-1"></i>
                            <h3 class="mt-3">Different variety of Quizzes</h3>
                            <p>Explore quizzes in differents subjects such as Science, Mathematics, Social Science, and many more...</p>
                        </div>
                    </div>
                    <div class="col-md-4 mb-4">
                        <div class="card p-4 shadow-lg feature-card" style="min-height:15rem;">
                            <i class="fa-solid fa-bars-progress text-primary fs-1"></i>
                            <h3 class="mt-3">Know Your Progress</h3>
                            <p>See your performance with detailed stats and improve over time...</p>
                        </div>
                    </div>
                    <div class="col-md-4 mb-4">
                        <div class="card p-4 shadow-lg feature-card" style="min-height:15rem;">
                            <i class="fa-solid fa-medal text-primary fs-1"></i>
                            <h3 class="mt-3">Compete and Win</h3>
                            <p>Challenge your friends and go up in leaderboard to become winner...</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="start text-white text-center py-5">
                <div class="container">
                    <h2>Start your journey with Quiz Master today!</h2>
                    <router-link to="/register" class="btn btn-light btn-lg mt-3 animate-btn">Sign Up Now</router-link>
                </div>
            </section>

            <footer class="bg-dark text-white text-center py-3">
                <p class="mb-0">&copy; 2025 Quiz Master. All Rights Reserved.</p>
            </footer>
        </div>
    `

}

