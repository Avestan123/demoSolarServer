const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user');
const path = require('path');

// Import routes
const loginRoutes = require("./routes/loginRoutes")
const salesRoutes = require('./routes/sales.routes');
const generalUtilityRoutes = require("./routes/generalUtility.routes");
const developerRoutes = require('./routes/developer.routes')
const adminRoutes = require('./routes/admin.Routes')
const setWorkOrderRoutes = require('./routes/setWorkOrderRoutes');
const bodyParser = require('body-parser');  // Add this line
const bcrypt = require('bcryptjs');
const checkAuth = require('./middleware/checkAuth')

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB using the connection string from the environment variable
require('dotenv').config();
console.log("url", process.env.MONGODB_URL);

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Check MongoDB connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

//developer routes
app.use("/dev", developerRoutes)

//login routes
app.use("/", loginRoutes)

// Serve static files from the 'public' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Default route
app.get('/', (req, res) => {
  res.send('Hello World!123 ');
});
//checkauth
app.use(checkAuth)
//admin routes
app.use("/admin", adminRoutes)

// Use routes
app.use('/sales', salesRoutes);

app.use('/generalUtility', generalUtilityRoutes)



//create Default User
async function createDefaultUser() {
  try {
    const userCount = await User.countDocuments();

    // If no users exist, create a default user
    if (userCount === 0) {
      await User.create({
        userId: process.env.ADMIN_USER,
        password: process.env.ADMIN_PASSWORD,
      });

      console.log('Default user created.');
    }
  } catch (error) {
    console.error('Error creating default user:', error);
  }
}

// set work order  
app.use("/workOrder", setWorkOrderRoutes);

// Ensure that a default user exists when the server starts
createDefaultUser();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
