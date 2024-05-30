const uuid = require('uuid');
// const sgMail = require('@sendgrid/mail');

const sgMail = require('sib-api-v3-sdk');

const bcrypt = require('bcrypt');
require('dotenv').config();


const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');



const tranEmailApi = new sgMail.TransactionalEmailsApi();

// Set the Sendinblue API key during the application initialization
const client = sgMail.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SENGRID_API_KEY;

const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        // console.log(user.id)
        const userid = user.id;
        if (user) {
            const id = uuid.v4();
            const userPassword = new Forgotpassword({
                id: id,
                active: true,
                userId: userid
            })
            await userPassword.save()
                .catch((err) => {
                    throw new Error(err);
                })

            const sender = {
                email: 'akashdutta222001@gmail.com',
                name: 'Akash dutta'
            };

            const receivers = [
                {
                    email: email,
                },
            ];

            const resetLink = `http://localhost:3000/password/resetpassword/${id}`
            console.log("Your resetpassword link", resetLink)


            await tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'Reset the password',
                htmlContent: `<p>Visit the following link to reset your password:</p>
                          <a href="${resetLink}">click here to reset password</a>`
            })
                .then((response) => {
                    // console.log(response);
                    res.status(200).json({ message: 'Password reset email sent successfully' });
                })
                .catch((error) => {
                    console.log(error.message)
                    // res.status(401).json({ message: 'Internal server error' });

                    throw new Error('Internal server error')
                });
        } else {
            throw new Error('User doesnt exist')
        }
    } catch (err) {
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

const resetpassword = (req, res) => {
    const id = req.params.id;
    // console.log(id)
    Forgotpassword.findOne({ where: { id } }).then(forgotpasswordrequest => {
        if (forgotpasswordrequest) {
            forgotpasswordrequest.update({ active: false });
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
            )
            res.end()

        }
    })
}

const updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        // console.log(newpassword)

        const { resetpasswordid } = req.params;
        // console.log(resetpasswordid)
        Forgotpassword.findOne({ where: { id: resetpasswordid } }).then(resetpasswordrequest => {
            User.findOne({ where: { id: resetpasswordrequest.userId } }).then(user => {
                // console.log('userDetails', user)
                if (user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function (err, salt) {
                        if (err) {
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function (err, hash) {
                            // Store hash in your password DB.
                            if (err) {
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({ message: 'Successfuly update the new password' })
                            })
                        });
                    });
                } else {
                    return res.status(404).json({ error: 'No user Exists', success: false })
                }
            })
        })
    } catch (error) {
        return res.status(403).json({ error, success: false })
    }

}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}