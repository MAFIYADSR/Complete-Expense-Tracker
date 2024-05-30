const User = require('../models/user');
const Expense = require('../models/expenses');
const sequelize = require('../util/database');

const getUserLeaderBoard = async (req, res) => {
    try{
                    //Most efficient way-------->
                    
                    // const leaderboard = await User.findAll({
                    //     attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'total_cost']],
                    //     include: [
                    //         {
                    //             model: Expense,
                    //             attributes: []
                    //         }
                    //     ],
                    //     group: ['users.id'],
                    //     order: [['total_cost', 'DESC']]
            
                    // })
                    const leaderboard = await User.findAll({
                        order: [['totalExpenses', 'DESC']]
            
                    })
                    res.status(200).json(leaderboard)


                    // const leaderboard = await User.findAll({
                    //     group: ['users.id'],   
                    //     leaderboard.sort((a, b) => b.totalExpenses - a.totalExpenses)
                    // })
                    

                    // User.forEach((user) => {
                    //     leaderboard.push({name: user.name, totalExpenses : totalExpenses[user.id]})
                    //     })
                    //     leaderboard.sort((a, b) => b.totalExpenses - a.totalExpenses)



                    // This is the details. But if you show this infront of interviewer you will get reject because 
                        // it's not efficient way  ------- 
                    
        // const users = await User.findAll({
        //     attributes: ['id', 'name']
        // })
        // // console.log(users);
        // const expenses = await Expense.findAll({
        //     attributes: ['userId', 'expenseamount']
        // });
        // // console.log(expenses);
        // const userAggregetedExpenses = {}
        // expenses.forEach((expense) => {
            
        //     if(userAggregetedExpenses[expense.userId]){
        //         userAggregetedExpenses[expense.userId] =  userAggregetedExpenses[expense.userId] + expense.expenseamount
        //     }
        //     else{
        //         userAggregetedExpenses[expense.userId] = expense.expenseamount
        //     }
        // })

        // var userLeaderBoardDetails = [];

        // users.forEach((user) => {
        //     userLeaderBoardDetails.push({name: user.name, total_cost : userAggregetedExpenses[user.id] || 0})
        // })
        // userLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost)
        // // console.log(userLeaderBoardDetails);
        // res.status(200).json(userLeaderBoardDetails)


    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

module.exports = {
    getUserLeaderBoard
}