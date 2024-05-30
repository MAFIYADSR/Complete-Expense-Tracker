async function forgotpassword(e){
    try{
    e.preventDefault();
    const form = new FormData(e.target);
    // console.log(form)

    const userDetails = {
        email: form.get("email")
    }

    // console.log(userDetails)
    const response = await axios.post('http://localhost:3000/password/forgotpassword', userDetails)
    if(response.status === 202){
    document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent</div>'

    }
    else{
        throw new Error('Something went wrong!!!')
    }
}
catch(err){
    document.body.innerHTML += `<div style="color:red;">${err}</div>`
}
}