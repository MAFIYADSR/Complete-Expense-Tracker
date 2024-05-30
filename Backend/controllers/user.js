const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isstringnotvalid(string) {         //This function will return true if string not valid
    if (string == undefined || string.length === 0) {
        return true;
    }
    else {
        return false;
    }
}

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(email, name, password);
        if (isstringnotvalid(name) || isstringnotvalid(email) || isstringnotvalid(password)) {
            return res.status(400).json({ err: "Bad parameters - Something is missing" })
        }

        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async(err, hash) => {
            console.log(err)
            await User.create({name, email, password: hash})
            res.status(201).json({message: 'Successfuly create new user'})
        })
    } catch (err) {
        res.status(500).json(err);
    }
}

function generateAccessToken(id, name, ispremiumuser) {
    return jwt.sign({ userId: id, name: name, ispremiumuser: ispremiumuser}, 'secretCode')
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (isstringnotvalid(email) || isstringnotvalid(password)) {
            return res.status(400).json({ message: "Email id or password is missing", success: false })
        }
        console.log(password);
        const user = await User.findAll({ where: { email } })
        // console.log(user)
        
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if(err){
                    res.status(500).json({ success: false, message: "Something went wrong" })
                }
                if(result == true){
                res.status(200).json({ success: true, message: "User logged in sucessfully" , token: generateAccessToken(user[0].id, user[0].name, user[0].ispremiumuser)})
                }
                else {
                    return res.status(400).json({ success: false, message: "Password is incorrect" })
                }
            })     
        }
        else {
            return res.status(404).json({ success: false, message: "User doesnot exist" })
        }
    }
    catch (err) {
        res.status(500).json({ message: err, success: false })
    }
}

module.exports = {
    signup,
    login,
    generateAccessToken
}