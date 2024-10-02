const express = require('express');
const mongoose = require('mongoose');
const { URI } = require('./environment.js');
const app = express();
const authrouter = require('./routes/auth.js');
const teamrouter = require('./routes/teams.js');
const taskrouter = require('./routes/tasks.js');
const checkrouter = require('./routes/checklistitem.js');
const commentrouer = require('./routes/comments.js');
const cors = require('cors');
const backend_port = 5001;
//add cors

app.use(express.json());
app.use(cors());
app.use('/api/auth', authrouter);
app.use('/api/team', teamrouter)
app.use('/api/tasks', taskrouter);
app.use('/api/checklistitem', checkrouter);
app.use('/api/comments', commentrouer);

mongoose.connect(URI)
  .then(() => {
    console.log('DB Connected');
    app.listen(backend_port, () => {
      console.log(`Tasker backend listening on port ${backend_port}`);
    });
  })
  .catch((err) => {
    console.log(`Backend connection failure\n${err}`);
  });
