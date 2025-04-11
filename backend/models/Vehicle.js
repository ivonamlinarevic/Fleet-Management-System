const mongoose = require('mongoose');

// Definicija modela vozila
const vehicleSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['car', 'truck', 'motorcycle'],
        required: true,
    },
    maker: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
    },
    availabilityStatus: {
        type: String,
        enum: ['available', 'reserved', 'maintenance'],
        default: 'available',
    },
    damageReported: {  // Polje za prijavljenu štetu
        type: Boolean,
        default: false,
    },
    damageDescription: {  // Polje za opis štete
        type: String,
        default: '',
    },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
