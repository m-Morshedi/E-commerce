const mongoose = require("mongoose");

const dbconnection = () => {
  mongoose.connect(process.env.DB_URL).then((con) => {
    console.log(`Database Connected ${con.connection.host}`);
  });
};

module.exports = dbconnection;
