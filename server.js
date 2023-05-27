const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// MONGOOSE connection string pds
mongoose.connect('mongodb://localhost:27017/SRP', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB', error);
  });

// Farmer

const FarmerSchema = new mongoose.Schema({
  name: String,
  role: String,
  aadhar: String,
  password: String,
  location: String,
  grains: Number,
  ready: Number
});

const Farmer = mongoose.model('Farmer', FarmerSchema);

app.post('/add-farmer', (req, res) => {
  const data = req.body;
  console.log("sdf"+JSON.stringify(data));
  Farmer.findOneAndUpdate({ name: data.name } , {$inc: {grains: data.grains}})
    .then(() => {
      res.status(200).send('Grains added successfully');
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Error adding grains');
    });
    
});

app.put("/farmer-ready", (req, res) => {
  const data = req.body;
  Farmer.findOneAndUpdate({ name: data.name }, { ready: 1 })
    .then(() => {
      res.status(200).send(`Ready to sell status updated for test`);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error updating ready to sell status");
    });
});

//signup
app.post("/signup",(req,res) => {
  const { sname, srole, spassword , saadhar , slocation , sgrains , sready} = req.body;
  console.log("signupsd" +  sname +  srole + spassword  + saadhar + slocation + sgrains + sready);
  const data = { 
    name: sname,
    role: srole,
    aadhar: saadhar,
    password: spassword,
    location: slocation,
    grains: sgrains,
    ready: sready
  }
  console.log("output " + JSON.stringify(data));
  if(data.role === "Farmer") {
    const farmer = new Farmer(data);
    farmer.save()
      .then(() => {
        res.status(200).send('Farmer added successfully');
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send('Error adding farmer');
        
      });
  }
  else if(data.role === "Miller") {
    const miller = new Miller(data);
    miller.save()
      .then(() => {
        res.status(200).send('Miller added successfully');
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send('Error adding miller');
      });
  }
  else if(data.role === "Fci") {
    // const data = JSON.stringify(signup_data);
    // var fciObj = JSON.parse(data);
    // console.log("fciObj " + fciObj);
    const fci = new Fci(data);
    fci.save()
      .then(() => {
        res.status(200).send('Fci added successfully');
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send('Error adding dci');
      });
  }
  else if(data.role === "Fps") {
    const fps = new Fps(data);
    fps.save()
      .then(() => {
        res.status(200).send('Fps added successfully');
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send('Error adding Fps');
      });
  }

})

app.post("/login", (req, res) => {
  const data = req.body.data;

  if (data.role === "Fci") {
    Fci.findOne({ password: data.password })
      .then((document) => {
        if (document) {
          res.status(200).send(document);
          return; // Stop execution here after sending the response
        }
        res.status(404).send("Not found");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  } else if (data.role === "Farmer") {
    Farmer.findOne({ aadhar: data.aadhar })
      .then((document) => {
        if (document && document.password === data.password) {
          res.status(200).send(document); 
          return; // Stop execution here after sending the response
        }
        res.status(404).send("Not found");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  } else if (data.role === "Miller") {
    Miller.findOne({ aadhar: data.aadhar })
      .then((document) => {
        if (document && document.password === data.password) {
          res.status(200).send(document); 
          return; // Stop execution here after sending the response
        }
        res.status(404).send("Not found");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  } else if (data.role === "Fps") {
    Fps.findOne({ aadhar: data.aadhar })
      .then((document) => {
        if (document && document.password === data.password) {
          res.status(200).send(document); 
          return; // Stop execution here after sending the response
        }
        res.status(404).send("Not found");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  }
});



// app.post("/login", (req, res) => {
//   const data = req.body.data;
//   if(data.role === "Fci") {
//     Fci.findOne({"password":data.password},function(err,document) {
//       if(err) {
//         console.log(err);
//       }
//       else {
//         if(document) {
//           res.status(200).send(document);
//         }
//         else {
//           res.status(404).send("Not found");
//         }
//       }
//     })
//   }
//   else if(data.role === "Farmer") {
//     Farmer.findOne({"aadhar":data.aadhar},function(err,document) {
//       if(err) {
//         console.log(err);
//       }
//       else {
//         if(document && (document.password === data.password)) {
//           res.status(200).send(document);
          
//         }
//         else {
//           res.status(404).send("Not found");
         
//         }
//       }
//     })
//   }
// });

app.put("/farmer-not-ready", (req, res) => {
  const data = req.body;
  Farmer.findOneAndUpdate({ name: data.name }, { ready: 0 })
    .then(() => {
      res.status(200).send(`Ready to sell status updated`);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error updating ready to sell status");
    });
});

app.get('/show-grains-farmer', async (req, res) => {
  
  try {
    const data = req.query;
    console.log(data);
    const farmer = await Farmer.findOne({ name: data.name });
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    const grains = farmer.grains;
    res.json({ grains });
  } catch (error) {
    console.error('Error retrieving grains:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Miller

const MillerSchema = new mongoose.Schema({
  name: String,
  role: String,
  aadhar: String,
  password: String,
  location: String,
  grains: Number,
  ready: Number
});

const Miller = mongoose.model('Miller', MillerSchema);

// app.post('/add-miller', (req, res) => {
//   const { name, location, grains, ready} = req.body;

//   const miller = new Miller({
//     name: name,
//     location: location,
//     grains: grains,
//     ready: ready
//   });
//   miller.save()
//     .then(() => {
//       res.status(200).send('Miller added successfully');
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(500).send('Error adding Miller');
//     });
// });

app.get('/show-farmers', (req, res) => {
  Farmer.find({ ready: 1 })
    .then((farmers) => {
      res.status(200).json(farmers);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Error retrieving farmers');
    });
});

app.post('/deduct-grains-farmer', async (req, res) => {
  try {
    const { fname, name , grains } = req.body;

    const farmer = await Farmer.findOne({ name: fname });

    if (!farmer) {
      return res.status(404).send('Farmer not found');
    }

    if (grains > farmer.grains) {
      return res.status(400).send('Deduction amount exceeds available grains');
    }

    await Farmer.findOneAndUpdate(
      { name: fname },
      { $inc: { grains: -grains } }
    );

    await Miller.findOneAndUpdate(
      { name: name },
      { $inc: { grains: grains } }
    );

    return res.status(200).send('Grains deducted and added successfully');
  } catch (error) {
    console.log(error);
    return res.status(500).send('Error deducting grains and adding to test miller');
  }
});

app.put("/miller-ready", (req, res) => {
  const data = req.body;
  Miller.findOneAndUpdate({ name: data.name }, { ready: 1 })
    .then(() => {
      res.status(200).send(`Ready to sell status updated for test`);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error updating ready to sell status");
    });
});

app.put("/miller-not-ready", (req, res) => {
  const data = req.body;
  Miller.findOneAndUpdate({ name: data.name }, { ready: 0 })
    .then(() => {
      res.status(200).send(`Ready to sell status updated for test`);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error updating ready to sell status");
    });
});

app.get('/show-grains-miller', async (req, res) => {
  try {
    const data = req.query;
    console.log(data);
    const miller = await Miller.findOne({ name: data.name });
    if (!miller) {
      return res.status(404).json({ error: 'Miller not found' });
    }

    const grains = miller.grains;
    res.json({ grains });
  } catch (error) {
    console.error('Error retrieving grains:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// FCI

const FciSchema = new mongoose.Schema({
  name: String,
  role: String,
  aadhar: String,
  password: String,
  location: String,
  grains: Number,
});

const Fci = mongoose.model('Fci', FciSchema);

app.post('/add-fci', (req, res) => {
  const data = req.body;
  console.log(data);

  const fci = new Fci(data);

  fci.save()
    .then(() => {
      res.status(200).send('FCI added successfully');
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Error adding FCI');
    });
});

app.get('/show-millers', (req, res) => {
  Miller.find({ ready: 1 })
    .then((millers) => {
      res.status(200).json(millers);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Error retrieving farmers');
    });
});

app.post('/deduct-grains-miller', async (req, res) => {
  try {
    const data = req.body;
    console.log("ZZZZZ" + data.mname +"ZZZZZ" + data.mgrains + typeof(parseInt(data.mgrains)));

    const miller = await Miller.findOne({ name: data.mname });

    if (!miller) {
      return res.status(404).send('Farmer not found');
    }

    if (data.mgrains > miller.grains) {
      return res.status(400).send('Deduction amount exceeds available grains');
    }

    await Miller.findOneAndUpdate(
      { name: data.mname },
      { $inc: { grains: -data.mgrains } }
    );

    await Fci.findOneAndUpdate(
      { name: 'Fci' },
      { $inc: { grains: data.mgrains } }
    );

    return res.status(200).send('Grains deducted and added successfully');
  } catch (error) {
    console.log(error);
    return res.status(500).send('Error deducting grains and adding to FCI');
  }
});

app.get('/show-grains-FCI', async (req, res) => {
  try {
    const fci = await Fci.findOne({ name: 'Fci' });
    if (!fci) {
      return res.status(404).json({ error: 'FCI not found' });
    }

    const grains = fci.grains;
    res.json({ grains });
  } catch (error) {
    console.error('Error retrieving grains:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/fci-accept-request', async (req, res) => {
  const data = req.body;

  try {
    const fps = await Fps.findOne({ name:data.fpname });
    const fci = await Fci.findOne({name:'Fci'});
    if (!fps) {
      return res.status(404).json({ message: 'FPS not found' });
    }

    fps.grains += parseInt(data.fpgrains);
    fps.ready = 0;
    await fps.save();
    
    fci.grains-=parseInt(data.fpgrains);
    await fci.save();
    return res.status(200).json({ message: 'Request accepted' });
  } catch (error) {
    console.error('Error accepting request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/fci-deny-request', async (req, res) => {
  const data = req.body;

  try {
    const fps = await Fps.findOne({ name:data.fpname });
    if (!fps) {
      return res.status(404).json({ message: 'FPS not found' });
    }

    fps.ready = 0;
    await fps.save();
    
    return res.status(200).json({ message: 'Request denied' });
  } catch (error) {
    console.error('Error accepting request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.put("/fps-request", (req, res) => {
  const data = req.body;
  Fps.findOneAndUpdate({ name: data.name }, { ready: 1 })
    .then(() => {
      res.status(200).send(`Ready to buy status updated for test`);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error updating ready to buy status");
    });
});

app.get('/show-fps', (req, res) => {
  Fps.find({ ready: 1 })
    .then((fps) => {
      res.status(200).json(fps);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Error retrieving fps');
    });
});




// FPS

const FpsSchema = new mongoose.Schema({
  name: String,
  role: String,
  aadhar: String,
  password: String,
  location: String,
  grains: Number,
  ready : Number
});

const Fps = mongoose.model('Fps', FpsSchema);

app.post('/add-fps', (req, res) => {
  const data = req.body;
  console.log(data);

  const fps = new Fps(data);

  fps.save()
    .then(() => {
      res.status(200).send('FPS added successfully');
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Error adding FPS');
    });
});

app.get('/show-fci', (req, res) => {
  Fci.find()
    .then((fci) => {
      res.status(200).json(fci);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Error retrieving farmers');
    });
});

// app.post('/deduct-grains-fci', async (req, res) => {
//   try {
//     const { name, grains } = req.body;

//     const fci = await Fci.findOne({ name: 'FCI' });

//     if (!fci) {
//       return res.status(404).send('FCI not found');
//     }

//     if (grains > fci.grains) {
//       return res.status(400).send('Deduction amount exceeds available grains');
//     }

//     await Fci.findOneAndUpdate(
//       { name: 'FCI' },
//       { $inc: { grains: -grains } }
//     );

//     await Fps.findOneAndUpdate(
//       { name: 'test' },
//       { $inc: { grains: grains } }
//     );

//     return res.status(200).send('Grains deducted and added successfully');
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send('Error deducting grains and adding to FPS');
//   }
// });

app.get('/show-grains-fps', async (req, res) => {
  try {
    const data = req.query;
    console.log(data);
    const fps = await Fps.findOne({ name: data.name });
    if (!fps) {
      return res.status(404).json({ error: 'FPS not found' });
    }

    const grains = fps.grains;
    console.log("grains : " + grains);
    res.json({ grains });
  } catch (error) {
    console.error('Error retrieving grains:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ...

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
