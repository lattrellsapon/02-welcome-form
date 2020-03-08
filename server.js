const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const creds = require('./config/config');

const path = require('path');

const app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

const transport = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: false,
  auth: {
    user: creds.USER,
    pass: creds.PASS
  }
};

const transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/send', (req, res) => {
  //   res.send('POST REQUEST WENT HERE');
  //   console.log('post post post');
  //   console.log(req.body.username);

  const username = req.body.username;
  const email = req.body.email;
  const message = req.body.message;
  const content = `${username} - ${email} wants to say: 
    
        ${message}

    `;

  const mail = {
    from: username,
    to: 'lattrellsapon@gmail.com',
    subject: 'Treezy Web Design | New user message',
    text: content
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        msg: 'fail'
      });
    } else {
      res.json({
        msg: success
      });
    }
  });
});

// Serve static asset in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running port ${PORT}`);
});
