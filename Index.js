require('dotenv').config();
const express = require('express')
const Db = require('./DB/DB')
const app = express()
const singup = require('./Route/Singup')
const Login = require('./Route/Singup')
const ForgetPassword = require('./Route/Singup')
const getuserDetails = require('./Route/Singup')
const AllgetuserDetails = require('./Route/Singup')
const updateprofile = require('./Route/Singup')
const ChangePassword = require('./Route/Singup')
const friendRequest = require('./Route/Singup')
const Unfriend = require('./Route/Singup')
const getFrienddetails = require('./Route/Singup')
const Conversation = require('./Route/Conversation')
// const get_conversation_one = require('./Route/Conversation')
const regis = require('./Route/change')
const otp = require('./Route/change')
const verify = require('./Route/change')
const loginhistory = require('./Route/loginHistoy')
const get_loginhistory = require('./Route/loginHistoy')
const ConversationMessage = require('./Route/ConversationMessage')
const ConversationMessagebyUser = require('./Route/ConversationMessage')
const personalDetails = require('./Route/PersonalDetail')
const Socialaccount = require('./Route/Socialaccount')
var bodyParser = require('body-parser')
const GoogleLogin = require('./Route/Googlelogin')
const FaceBookLogin = require('./Route/FaceBookLogin')
const post = require('./Route/post')
const postDelete = require('./Route/post')
const coverphoto = require('./Route/coverphotos')
const friends = require('./Route/friends')
const CPost = require('./Route/CreatePost')
const User = require('./Route/User')
const CreatePost = require('./Route/CreamyNewPost')
const CreamyComment = require('./Route/CreamyComment')
const CreamyKycForm = require('./Route/CreamyKycForm')
const CreamyTransaction = require('./Route/CreamyTransaction')
const CreamyStripe = require('./Route/CreamyStripe')
const CreamySubscribe = require('./Route/CreamySubscribe')

var cors = require('cors')
const port = 8041

app.use('/uploads', express.static('uploads'));
app.use('/postImage', express.static('postImage'));

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/api', singup)
app.use('/api', Login)
app.use('/api', GoogleLogin)
app.use('/api', FaceBookLogin)
app.use('/api', ForgetPassword)
app.use('/api', getuserDetails)
app.use('/api', AllgetuserDetails)
app.use('/api', updateprofile)
app.use('/api', ChangePassword)
app.use('/api', regis)
app.use('/api', loginhistory)
app.use('/api', get_loginhistory)
app.use('/api', friendRequest)
app.use('/api', Unfriend)
app.use('/api', getFrienddetails)
app.use('/api', Conversation)
app.use('/api', ConversationMessage)
// app.use('/api', get_conversation_one)
app.use('/api', ConversationMessagebyUser)
app.use('/api', post)
app.use('/api', postDelete)
app.use('/api', personalDetails)
app.use('/api', Socialaccount)
app.use('/api', coverphoto)
app.use('/api', friends)
app.use('/api', CPost)
app.use('/api', User)
app.use('/api', CreatePost)
app.use('/api', CreamyComment)
app.use('/api', CreamyKycForm)
app.use('/api', CreamyTransaction)
app.use('/api', CreamyStripe)
app.use('/api', CreamySubscribe)



// app.use('/api', otp)
// app.use('/api', verify)

/* app.get('/auth', authUser);

app.get('/auth/instagram/callback', authUser);

app.get('/instalogin', function (request, response) {
    response.redirect(config.instagram.auth_url);
}); */



app.get('/', (req, res) => {
    res.send('RAM!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    Db
})


