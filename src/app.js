const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const leadRoutes = require('./routes/lead.routes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/leads', leadRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong!' });
});




module.exports = app;


