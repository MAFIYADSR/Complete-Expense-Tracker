async function login(e) {
    try{
        e.preventDefault();
        console.log(e.target.email.value);

        const loginDetails = {
            email: e.target.email.value,
            password: e.target.password.value
        }

        console.log(loginDetails)
        const response = await axios.post('http://localhost:3000/user/login', loginDetails)
            if(response.status === 200){
                alert(response.data.message)
                console.log(response.data);
                localStorage.setItem('token', response.data.token)
                window.location.href = "../index.html"
            }
    }
    catch(err){
        console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style="color: red;">${err.message}</div>`;
    }
}

function forgotpassword() {
    window.location.href = "./forgot.html"
    
}