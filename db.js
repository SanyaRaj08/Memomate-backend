
const mongoose = require('mongoose');

async function connectToMongo() {
  try {
    await mongoose.connect('mongodb+srv://rajsanya05:Sanyaraj123@cluster0.6f3exgl.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = connectToMongo;
