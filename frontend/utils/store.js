const store = new Vuex.Store({
    state:{
        auth_token : null,
        role : null,
        user_id :null
    },
    mutations:{
        setUser(state){
            try{
                if(JSON.parse(localStorage.getItem('user'))){
                    const user = JSON.parse(localStorage.getItem('user'))
                    state.auth_token = user.token;
                    state.role = user.role;
                    state.user_id = user.id
                }
            }catch(err){
                console.warn("Not Logged in", err)
            }
        },
        
        logout(state){
            state.auth_token = null;
            state.role = null;
            state.user_id = null;

            localStorage.removeItem('user')

        }
    },
    action:{

    }
})

store.commit('setUser')

export default store