const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definicija korisničkog modela
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['employee', 'admin'],
        default: 'employee',
    },
});

/* // Hashiranje lozinke prije spremanja u bazu
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Metoda za usporedbu lozinki
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}; */

module.exports = mongoose.model('User', userSchema);
