const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files (dashboard.html) from backend root
app.use(express.static(path.join(__dirname)));

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Appointment schema
const appointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  service: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Test route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// API routes
app.post('/appointments', async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res.status(201).json({ message: 'Appointment saved successfully!' });
  } catch (error) {
    console.error('Error saving appointment:', error);
    res.status(500).json({ error: 'Failed to save appointment' });
  }
});

app.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

app.delete('/appointments/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
