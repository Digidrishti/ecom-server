var express = require('express');
var router = express.Router();
const loginModel = require('../models/user.model');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const productModel = require('./../models/productCategory')
const nodemailer = require("nodemailer");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await loginModel.findOne({ email });
    if (user) {
      return res.status(404).json({ msg: 'Email Already Present DataBase, please try different email', status: 'error' });
    }
    else {
      await loginModel.create({
        email: email,
        // password: await bcrypt.hash(password, 10),
      })
        .then(() => {
          res.status(200).json({ msg: 'user added successful', status: 'success' });
        })
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginModel.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send('Invalid password');
    }
    const token = jwt.sign({ email: user.email }, 'secret_key', { expiresIn: '1h' });
    res.status(200).json({ token, status: 'success' });
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});



const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'shawn.beatty7@ethereal.email',
      pass: 'hKEH7uurnKZrdaP7RZ'
  }
});
router.post('/verifyEmail', async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const user = await loginModel.findOne({ email });
    if (user) {
      var otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
      res.status(200).json({ msg: 'otp send successful', status: 'success' });

      // main(otp).catch(console.error);
      // const info = await transporter.sendMail({
      //   from: '"Maddison Foo Koch 👻" <shawn.beatty7@ethereal.email>', // sender address
      //   to: "rushimore302@gmail.com", // list of receivers
      //   subject: "Hello ✔", // Subject line
      //   text: "Hello world?", // plain text body
      //   html: "<b>Hello world?</b>", // html body
      // });
      // console.log("Message sent: %s", info);
    
      // console.log("Message sent: %s", info.messageId);
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }
    else {
      res.status(404).send('User not found');
    }
  }
  catch (error) {
    res.status(500).send('Error logging in');
  }
});

// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   secure: false, 
//   auth: {
//     user: "maddison53@ethereal.email",
//     pass: "jn7jnAPss4f63QBp6D",
//   },
// });

// async function main(otp) {
//   const info = await transporter.sendMail({
//     from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', 
//     to: "rushimore302@gmail.com", 
//     subject: "Hello ✔", 
//     text: "Hello world?", 
//     html: "<b>Hello world?</b>", 
//   });

//   console.log("Message sent: %s", otp);
// }


// const verifyToken = (req, res, next) => {
//   const token = req.headers['authorization'];
//   if (!token) {
//     return res.status(401).send('Access denied. Token not provided');
//   }
//   try {
//     const decoded = jwt.verify(token, 'secret_key');
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(400).send('Invalid token');
//   }
// };

router.get('/getAllProduct', async (req, res) => {
  console.log(req)

  try {
    const student = await productModel.findOne();
    console.log(student);
    res.status(200).json(student);
} catch(error) {
    res.status(404).json({message: error.message});
  }
  

})

module.exports = router;
