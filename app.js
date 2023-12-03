const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const exphbs = require('express-handlebars');
const multer = require('multer');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connect = require('./server/db');
const router = require('./controller/router/router');

async function main() {
  const app = express();
  app.use(
      session({
        secret: process.env.SESSION_SECRET || 'fallback-secret-key',
          resave: false,
          saveUninitialized: true,
          store: MongoStore.create({ 
              mongoUrl: 'mongodb+srv://blabdue:iawynikd@blabdue.m4zqcqu.mongodb.net/test2',
          }),
          cookie: { maxAge: 1000 * 60 * 60 * 24 }, // Session cookie will expire after one day
      })
  );
  app.use('/user-profile/styles', express.static('./public/css/styles', { type: 'text/css' }));
  app.use('/user-profile/javascript', express.static('./public/js', { type: 'application/javascript' }));
  app.use('/static', express.static('public'));
  
  app.use(express.static(path.join(__dirname)));

  app.engine("hbs", exphbs.engine({
    extname: "hbs", 
    helpers: {
        formatDate: function(date) {
            return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));
  app.set("view engine", "hbs");
  app.set("views", "views");
  app.use(express.json());
  app.use(router);
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false })); // to parse application/x-www-form-urlencoded


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      console.log('Uploading file:', file.originalname);
      cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
      console.log('Saving as:', filename);
      cb(null, filename)
  }
});


const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));
const fs = require('fs');
const dir = './public/uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
    console.log('Created directory:', dir);
}

// Start the server
app.listen(process.env.SERVER_PORT, async function() {
  console.log(`express app is now listening on port ${process.env.SERVER_PORT}`);
  try {
      await connect();
      console.log(`Now connected to MongoDB`);

  } catch (err) {
      console.log('Connection to MongoDB failed: ');
      console.error(err);
  }
});
}
main();
