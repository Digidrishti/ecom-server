var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var loginRouter = require('./routes/login');
var authRouter = require('./routes/login');

const bodyParser = require('body-parser');
const multer = require('multer');
// const productRoutes = require('./routes/productRoutes');
const productModel = require('./models/productCategory.js');
const productTypeModel = require('./models/productType.js');

// code for the location traing fot the user its demo code it is for the tesing purpose
const socketIo = require('socket.io');
const http = require('http');

const server = http.createServer(app);
const io = socketIo(server);

// tilll her e the locaiton code is present 

// const fs = require('fs');
// const fs = require('fs-extra')

var app = express();
const nodemailer = require("nodemailer");

var corsOptions = {
  origin: "*"
};
const PORT = process.env.PORT || 3000;



const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'verda.bechtelar@ethereal.email',
      pass: 'CYr3Bzyz4a4aUPkV3A'
  }
});



let clients = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle new location data from client
  socket.on('updateLocation', (data) => {
    console.log('Received location update:', data);
    // Store/update client's location
    clients[socket.id] = data;

    // Broadcast updated location to all clients
    io.emit('locationUpdate', { id: socket.id, location: data });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
    delete clients[socket.id];
  });
  
  // Log status after connection
  console.log(`Socket ${socket.id} connected.`);
});



app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:4200', 'http://localhost:3000'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS', 'POST, OPTIONS', 'PUT, OPTIONS', 'DELETE, OPTIONS', 'PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

app.use(bodyParser.json());


// // // // // // // // // // // // // // // // // // // // // //
app.use(express.static("uploads"))

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })


app.post('/create-products', upload.single('image'), async (req, res, next) => {
  console.log(req.body)
  console.log(req.file.filename)
  const product = new productModel({
    categoryName: req.body.categoryName,
    description: req.body.description,
    discount: req.body.discount,
    image: `http://localhost:3000/` + req.file.filename
  });

  await product.save().then(data => {
    res.send({
      message: "product created successfully!!",
      user: data
    });
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while creating product"
    });
  });
})


// app.post('/addtypes', upload.any('image', 10), async (req, res, next) => {
//   try {
//     // console.log(req.body);
//     console.log(req.files);

//     const images = req.files.map(file => `http://localhost:3000/${file.filename}`);

//     const productType = new productTypeModel({
//       categoryName: req.body.categoryName,
//       productName: req.body.productName,
//       productType: req.body.productType,
//       productPrice: req.body.productPrice,
//       productQuantity: req.body.productQuantity,
//       productWeight: req.body.productWeight,
//       // images: images // Assuming "images" is the field in your productModel for storing multiple images
//     });

//     await productType.save().then(data => {
//       res.send({
//         message: "product created successfully!!",
//         user: data
//       });
//     }).catch(err => {
//       res.status(500).send({
//         message: err.message || "Some error occurred while creating product"
//       });
//     });

//     const savedProduct = await product.save().then((user)=>{

//     });
//     res.send({
//       message: "Product created successfully!!",
//       product: savedProduct
//     });
//   } catch (err) {
//     res.status(500).send({
//       message: err.message || "Some error occurred while creating product"
//     });
//   }
// });






app.post('/addtypes', upload.any('image', 10), async (req, res, next) => {

  try {
    let categoryId = req.body.categoryName;
    const category = await productModel.findById(categoryId);


    const images = req.files.map(file => `http://localhost:3000/${file.filename}`);

    category.productTypes.push({
      categoryName: req.body.categoryName,
      productName: req.body.productName,
      productType: req.body.productType,
      productPrice: req.body.productPrice,
      productQuantity: req.body.productQuantity,
      productWeight: req.body.productWeight,
      images: images

    });

    const savedProduct = await category.save().then((user) => {

    });
    res.send({
      message: "Product created successfully!!",
      product: savedProduct
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating product"
    });


    // const updatedCategory = await category.save();
    // res.status(201).json(updatedCategory.productTypes);
  }
  //   catch (err) {
  //   res.status(400).json({ message: err.message });
  // }

});















app.get('/getAllProduct', async (req, res) => {

  try {
    const student = await productModel.find();
    res.status(200).json(student);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


app.delete('/deleteProduct/:id', async (req, res, next) => {
  try {
    console.log(productModel)
    console.log(req.params.id)
    let customerId = req.params.id;
    await productModel.findByIdAndDelete({ _id: customerId })
      .then((deleteCustomer) => {
        res.status(200).json({ msg: 'customer deleted successfully', status: 200 });
      }).catch((err) => {
        res.status(404).json({ msg: 'Not found', status: 404, Error: err });
      })
  } catch (error) {
    res.status(500).json({ msg: 'sever error', status: 500, Error: error });
  }
});



// router.put('/updatedUser/:id', upload.single('profile'), async (req, res, next) => {
//   const id = req.params.id;
//   // console.log(req.params.id, '=========', req.body, '=========', req.file);
//   try {
//       await userDetailModel.findByIdAndUpdate({ _id: id }, {
//           $set: {
//               firstName: req.body.firstName,
//               middleName: req.body.middleName,
//               lastName: req.body.lastName,
//               email: req.body.email,
//               age: req.body.age,
//               contact: req.body.contact,
//               gender: req.body.gender,
//               role: req.body.role,
//               profiles: 'http://localhost:3000/' + req.file.path,
//           },
//       })
//           .then((user) => {
//               console.log(req.body)
//               console.log(user)
//               if (!user) {
//                   res.status(401).json({ msg: 'user not updated', status: 401 });
//               } else {
//                   res.status(200).json({ msg: 'User Updated success', status: 200, result: user })
//               }
//           }).catch((error) => {
//               res.status(400).json({ msg: 'Users Not Found', status: 404 })
//           })
//   } catch (error) {
//       res.status(500).json({ msg: 'Internal server error', status: 500 })
//   }
// })


app.put('/editProduct/:id', upload.single('image'), async (req, res, next) => {
  const id = req.params.id;
  // console.log(req.params.id, '=========', req.body, '=========', req.file);
  console.log(req.body)
  try {
    await productModel.findByIdAndUpdate({ _id: id }, {
      $set: {
        categoryName: req.body.categoryName,
        description: req.body.description,
        discount: req.body.discount,
        image: `http://localhost:3000/` + req.file.filename
      },
    }).then((user) => {
        console.log('heyt',req.body)
        console.log(user)
        if (!user) {
          res.status(401).json({ msg: 'user not updated', status: 401 });
        } else {
          res.status(200).json({ msg: 'User Updated success', status: 200, result: user })
        }
      }).catch((error) => {
        res.status(400).json({ msg: 'Users Not Found', status: 404 })
      })
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error', status: 500 })
  }
})







///////////////////////////////////////////////////////////////////

// async..await is not allowed in global scope, must use a wrapper





// async function main() {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
//     to: "bar@example.com, baz@example.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }



// app.post('/verifyEmail', async (req, res) => {
//   try {
//     const { email } = req.body;
//     console.log(email);
//     const user = await loginModel.findOne({ email });
//     console.log(user)

//     const info = await transporter.sendMail({
//       from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
//       to: "bar@example.com, baz@example.com", // list of receivers
//       subject: "Hello ✔", // Subject line
//       text: "Hello world?", // plain text body
//       html: "<b>Hello world?</b>", // html body
//     });
  
//     console.log("Message sent: %s", info.messageId);
//     if (user) {
//       var otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
//       res.status(200).json({ msg: 'otp send successful', status: 'success' });

//       main(otp).catch(console.error);
//       // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
//     }
//     else {
//       res.status(404).send('User not found');
//     }
//   }
//   catch (error) {
//     res.status(500).send('Error logging in');
//   }
// });


// main().catch(console.error);




/// this code is written for location real time tracing for the its for the demo pupose 


// make sure the connection is set the less 
// Store connected clients' locations


// server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
// });


//  till here is the code is written for the demo pupose 






////////////////////////////////////////////////////////////////////



mongoose.connect('mongodb://localhost:27017/login')
  .then(() => {
    console.log('db connection established')
  }).catch((err) => {
    console.log(err)
  })



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));
app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/auth/', loginRouter);
app.use('/auth/', authRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
