const mongoose = require('mongoose');
const uri = "mongodb+srv://yui:F7pj300pqrnAZkMP@cluster0.mxzwz7j.mongodb.net/yui-tracking?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESSFULLY CONNECTED");
    process.exit(0);
  })
  .catch(err => {
    console.error("CONNECTION ERROR:", err.message);
    process.exit(1);
  });
