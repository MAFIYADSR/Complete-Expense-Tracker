// const Razorpay = require('razorpay');
const token = localStorage.getItem('token');


async function addNewExpense(e) {
    try {
        e.preventDefault()

        const expenseDetails = {
            expenseamount: e.target.expenseamount.value,
            description: e.target.description.value,
            category: e.target.category.value
        }
        // console.log(expenseDetails)
        const token = localStorage.getItem('token')
        const response = await axios.post('http://localhost:3000/expense/addexpense', expenseDetails, { headers: { "Authorization": token } })
        addNewExpensetoUI(response.data.expense);
    }
    catch (err) {
        // showError(err);
        console.log(err);
    }
}

function showPremiumUserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "You are a premium user"
}

function parseJwt(token) {         //This is the code to decode token in frontend
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const ul = document.getElementById('listofExpenses');// i make listofExpenses globally so i can connect from anywhere.

window.addEventListener('DOMContentLoaded', () => {
    fetchdata(2);
})

async function fetchdata() {
    try {
        const token = localStorage.getItem('token')
        // const token  = req.header('Authorization');

        const decodedToken = parseJwt(token);
        // console.log(decodedToken);
        if (decodedToken.ispremiumuser == true) {
            showPremiumUserMessage();
            showLeaderboard();
        }
        const limit = document.getElementById('ITEM_PER_PAGE').value || 5;

        const response = await axios.get(`http://localhost:3000/expense/getexpenses?page=1&limit=${limit}`, { headers: { "Authorization": token } })
        ul.innerHTML = '';

        for (let i = 0; i < response.data.allExpenses.length; i++) {
            addNewExpensetoUI(response.data.allExpenses[i]);
        }
        showPagination(response.data);
    }
    catch (err) {
        // showError(err);
        console.log(err);
    }
}


function addNewExpensetoUI(expense) // this is the function for showExpense
{
    const parentNode = document.getElementById('listofExpenses');

    const childHTML = `<li id = ${expense.id}> ${expense.expenseamount} - ${expense.category} -> ${expense.description}
                        <button onclick=deleteExpense('${expense.id}')> Delete </button>
                        <button onclick=editExpense('${expense.id}')> Edit </button>

                    </li>`

    parentNode.innerHTML = parentNode.innerHTML + childHTML;
}

function deleteExpense(expenseId) {
    axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseId}`)
        .then((response) => {
            removeExpenseFromScreen(expenseId);
        })
        .catch((err) => {
            // showError(err);
            console.log(err);
        })
}

function editExpense(expenseId) {

    const parentNode = document.getElementById('listofExpenses');
    // const editBtn = document.createElement("input");
    // editBtn.type = "button";
    // editBtn.value = "Edit";

    axios.put(`http://localhost:3000/expense/editexpense/${expenseId}`)
        .then((res) => {
            // console.log(res.data.expenseDetails.expenseamount)
            document.getElementById("expenseamount").value = res.data.expenseDetails.expenseamount;
            document.getElementById("description").value = res.data.expenseDetails.description;
            document.getElementById("category").value = res.data.expenseDetails.category;
            deleteExpense(expenseId);
        })



}




function removeExpenseFromScreen(expenseId) {
    const parentNode = document.getElementById('listofExpenses');
    const childNodeToBeDeleted = document.getElementById(expenseId);
    if (childNodeToBeDeleted) {
        parentNode.removeChild(childNodeToBeDeleted);
    }

}

function download() {
    axios.get('http://localhost:3000/expense/download', { headers: { "Authorization": token } })
        .then((response) => {
            if (response.status === 200) {
                //the bcakend is essentially sending a download link
                //  which if we open in browser, the file would download
                var a = document.createElement("a");
                a.href = response.data.fileURL;
                a.download = 'myexpense.csv';
                a.click();
            } else {
                throw new Error(response.data.message)
            }

        })
        .catch((err) => {
            console.log(err)
            // showError(err)
        });
}


document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: { "Authorization": token } });
    // console.log(response);
    var options =
    {
        "key": response.data.key_id, //Enter the key id generated from the Dashboard
        "order_id": response.data.order.id, //For one time payment
        //This handler function will handle the success payment 
        "handler": async function (response) {
    // console.log(response);

            const res = await axios.post('http://localhost:3000/purchase/updateTransactionStatus', {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Authorization": token } })

            // console.log(res);
            alert('You are a Premium User now')
            document.getElementById('rzp-button1').style.visibility = "hidden"
            document.getElementById('message').innerHTML = "You are a premium user"
            localStorage.setItem('token', res.data.token);

        },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
        console.log(response);
        alert('Something went wrong')
    })
}

function showLeaderboard() {
    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.value = "Show Leaderboard"
    inputElement.onclick = async () => {
        const token = localStorage.getItem('token')
        const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: { "Authorization": token } })
        console.log(userLeaderBoardArray)

        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML += '<h1> Leader Board </h1>'
        userLeaderBoardArray.data.forEach((userDetails) => {

            leaderboardElem.innerHTML += ` <li>Name - ${userDetails.name} Total Expense - ${userDetails.totalExpenses || 0}</li>`

        })
    }
    document.getElementById("message").appendChild(inputElement);
}

// const expenseElemId = `expense-${expenseId}`;
//     document.getElementById(expenseElemId).remove();

function showPagination({
    currentpage,
    hasNextPage,
    hasPreviousPage,
    previousPage,
    nextpage,
}) {
    const ul = document.getElementById("pagination");
    ul.innerHTML = '';
    if (hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.innerHTML = `${previousPage}`;
        btn2.addEventListener('click', () => getdata(previousPage));
        ul.appendChild(btn2);
    }

    const btn1 = document.createElement('button');
    btn1.innerHTML = `${currentpage}`;
    btn1.addEventListener('click', () => getdata(currentpage));
    ul.appendChild(btn1);

    if (hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.innerHTML = nextpage;
        btn3.addEventListener('click', () => getdata(nextpage));
        ul.appendChild(btn3);
    }
}

async function getdata(page) {
    try {
        const token = localStorage.getItem('token')
        // const token  = req.header('Authorization');

        const decodedToken = parseJwt(token);
        // console.log(decodedToken);
        if (decodedToken.ispremiumuser == true) {
            showPremiumUserMessage();
            showLeaderboard();
        }
        const limit = document.getElementById('ITEM_PER_PAGE').value || 5;

        const response = await axios.get(`http://localhost:3000/expense/getexpenses?page=${page}&limit=${limit}`, { headers: { "Authorization": token } })
        ul.innerHTML = '';

        for (let i = 0; i < response.data.allExpenses.length; i++) {
            addNewExpensetoUI(response.data.allExpenses[i]);
        }
        showPagination(response.data);
    }
    catch (err) {
        // showError(err);
        console.log(err);
    }
}

async function updateRows(e) {
    try {
        const token = localStorage.getItem('token');
        const limit = e.target.value;
        localStorage.setItem('ITEM_PER_PAGE', limit);
        const response = await axios.get(`http://localhost:3000/expense/getexpenses?page=1&limit=${limit}`, { headers: { "Authorization": token } })
        ul.innerHTML = '';
        for (let i = 0; i < response.data.allExpenses.length; i++) {
            addNewExpensetoUI(response.data.allExpenses[i]);
        }
        showPagination(response.data);
        fetchdata();
    }
    catch (err) {
        console.log(err);
    }
}