const express = require('express');
const logger = require('morgan');

const base64 = require('base-64');
const User = require("./models/users");

const app = express();
const port = 5000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/', (req, res) => {
  res.send({hello: "world"});
});

app.get('/prescription', (req, res) => {
  if (!req.headers['x-auth']) {
    return res.status(401).json({
      success: false,
      error: "Authentification parameter(s) missing"
    });
  }

  const username = base64.decode(req.headers['x-auth']).toLowerCase();

  User.findOne({username: username}, (err, user) => {
    if (err)
      return res.status(401).json({
        success: false,
        error: err
      });

    else if (user)
      return res.status(200).json({
        success: true,
        red: user.prescription.red,
        blue: user.prescription.blue
      });

    else
      return res.status(401).json({
        success: false,
        error: "Username not found"
      })
  });

});

app.post('/prescription', (req, res) => {
  if (!req.headers['x-auth']) {
    return res.status(401).json({
      success: false,
      error: "Authentification parameter(s) missing"
    });
  }

  if (req.body.red === null || req.body.blue === null)
    return res.status(400).json({
      success: false,
      error: "Not a proper prescription"
    });

  const username = base64.decode(req.headers['x-auth']).toLowerCase();
  User.findOne({username: username}, (err, user) => {
    if (err)
      return res.status(401).json({
        success: false,
        error: err
      });

    else if (user) {
      user.prescription = {red: req.body.red, blue: req.body.blue}
      user.save((err, savedUser) => {
        if (savedUser)
          return res.status(201).json({
            success: true
          });

        else
          return res.status(400).json({success: false});
      });
    }

    else
      return res.status(401).json({
        success: false,
        error: "Username not found"
      })
  });
});

app.get('/logs', (req, res) => {
  if (!req.headers['x-auth']) {
    return res.status(401).json({
      success: false,
      error: "Authentification parameter(s) missing"
    });
  }

  const username = base64.decode(req.headers['x-auth']).toLowerCase();

  User.findOne({username: username}, (err, user) => {
    if (err)
      return res.status(401).json({
        success: false,
        error: err
      });

    else if (user)
      return res.status(200).json({success: true, logs: user.log});

    else
      return res.status(401).json({
        success: false,
        error: "Username not found"
      })
  });

});

app.post('/logs', (req, res) => {
  if (!req.headers['x-auth']) {
    return res.status(401).json({
      success: false,
      error: "Authentification parameter(s) missing"
    });
  }
  
  if (req.body.red === null || req.body.blue === null || req.body.time === null || req.body.isPrescription === null)
    return res.status(400).json({
      success: false,
      error: "Missing required attributes for log object"
    })

  const username = base64.decode(req.headers['x-auth']).toLowerCase();

  User.findOne({username: username}, (err, user) => {
    if (err)
      return res.status(401).json({
        success: false,
        error: err
      });

    else if (user) {
      user.log.push({
        red: req.body.red,
        blue: req.body.blue,
        time: req.body.time,
        isPrescription: req.body.isPrescription
      });

      user.machineRedCount -= req.body.red;
      user.machineBlueCount -= req.body.blue;

      user.save((err, savedUser) => {
        if (savedUser)
          return res.status(201).json({success: true});
        else
          return res.status(400).json({success: false});
      });
    }

    else
      return res.status(401).json({
        success: false,
        error: "Username not found"
      })
  });

});

app.get('/machineTotals', (req, res) => {
  if (!req.headers['x-auth']) {
    return res.status(401).json({
      success: false,
      error: "Authentification parameter(s) missing"
    });
  }

  const username = base64.decode(req.headers['x-auth']).toLowerCase();

  User.findOne({username: username}, (err, user) => {
    if (err)
      return res.status(401).json({
        success: false,
        error: err
      });

    else if (user)
      return res.status(200).json({
        success: true,
        red: user.machineRedCount,
        blue: user.machineBlueCount
      });

    else
      return res.status(401).json({
        success: false,
        error: "Username not found"
      })
  });

});

app.post('/account', (req, res) => {
  if (req.body.username === null)
    return res.status(401).json({
      success: false,
      error: "Missing username in body"
    });

  let lowercase = req.body.username.toLowerCase();
  console.log(lowercase)

  User.findOne({username: lowercase}, (err, user) => {
    if (err)
      return res.status(401).json({
        success: false,
        error: err
      });

    else if (user)
      return res.status(200).json({success: true});

    else
      return res.status(401).json({
        success: false,
        error: "Username not found"
      })
  });

});

app.post('/register', (req, res) => {
  if (req.body.username === null || req.body.red === null || req.body.blue === null)
    return res.status(400).json({
      success: false,
      error: "Missing required parameters from body"
    });

  let lowercase = req.body.username.toLowerCase();

  User.findOneAndDelete({username: lowercase}, (err, removedUser) => {
    const newUser = new User({
      username: lowercase,
      log: [],
      prescription: {
        red: req.body.red,
        blue: req.body.blue
      },
      machineRedCount: 14,
      machineBlueCount: 14
    });

    newUser.save((err, savedUser) => {
      if (err)
        return res.status(400).json({
          success: false,
          error: err
        });

      else if (savedUser)
        return res.status(201).json({success: true});

      else
        return res.status(400).json({success: false});
    });

  });
});

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});
