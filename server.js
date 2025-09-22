const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..')));


// 👇 MongoDB Atlas connection
mongoose.connect('mongodb+srv://dishawalnekar160_db_user:FRmagMGfeXj08lLV@cliniccluster.ciyxmde.mongodb.net/?retryWrites=true&w=majority&appName=ClinicCluster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('✅ Connected to MongoDB Atlas');
});

// Remove prescription, priority, and status from schema
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

app.post('/appointments', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    const newAppointment = new Appointment({
      name,
      email,
      phone,
      service,
      message
    });

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

// Remove status update endpoint since status is no longer in schema
// If you want to keep the endpoint for future use, you can leave it, but it won't affect the data


// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});