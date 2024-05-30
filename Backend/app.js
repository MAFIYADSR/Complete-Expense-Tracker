const path = require('path');
const fs = require('fs');
const https = require('https');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const User = require('./models/user');
const Expense = require('./models/expenses');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');
const Filesdownloaded = require('./models/filesdownloaded');

const privateKey = fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cert');

var cors = require('cors');

const app = express();
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

//get config vars
dotenv.config();

app.use(cors());


const { nextTick } = require('process');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense')
const purchasepremiumRoutes = require('./routes/purchase');
const premiumFeatureRoutes = require('./routes/premiumFeature');
const resetPasswordRoutes = require('./routes/resetpassword');


const exp = require('constants');



// app.use(bodyParser.json({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchasepremiumRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', resetPasswordRoutes);

app.use((req, res) => {
    console.log('urlll', req.url);
    res.sendFile(path.join(__dirname, `/${req.url}`));
})



User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);


app.use(errorController.get404);

sequelize
    // .sync({force: true})
    .sync()
    .then(result => {
        // console.log(result);
        app.listen(3000);
        // https.createServer({key: privateKey, cert: certificate}, app).listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

