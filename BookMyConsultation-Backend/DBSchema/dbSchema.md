# Database Schema Structure:

## user
User {
  _id: ObjectId,
  firstName: String,            // Required
  lastName: String,             // Required
  dob: Date,
  mobile: String,               // Required, 10 digits
  emailId: String,              // Required, unique, validated
  password: String,             // Required, min 6 chars, hashed
  role: String,                 // Enum: ['user', 'admin'], default: 'user'
  createdAt: Date,              // Auto-generated
  updatedAt: Date               // Auto-generated
}


## address
Address {
  _id: ObjectId,
  address: String,              // Required
  city: String,                 // Required
  state: String,                // Required
  pincode: String,              // Required, 4-6 digits
  userId: ObjectId,             // Required, references User._id
  createdAt: Date,              // Auto-generated
  updatedAt: Date               // Auto-generated
}

## appointment
Appointment {
  _id: ObjectId,
  userId: ObjectId,             // Required, references User._id
  doctorId: ObjectId,           // Required, references Doctor._id
  appointmentDate: Date,        // Required, must be a future date
  status: String,               // Enum: ['booked', 'completed', 'cancelled'], default: 'booked'
  notes: String,
  createdAt: Date,              // Auto-generated
  updatedAt: Date               // Auto-generated
}

## doctor
Doctor {
  _id: ObjectId,
  name: String,                 // Required
  specialization: String,       // Required
  experience: Number,           // Required, min: 0
  dob: Date,                    // Required
  email: String,                // Required, validated
  mobile: String,               // Required, 10 digits
  availability: Boolean,        // Default: true
  rating: Number,               // Min: 0, Max: 5, Default: 0
  addressId: ObjectId,          // Required, references Address._id
  createdAt: Date,              // Auto-generated
  updatedAt: Date               // Auto-generated
}


## rating
Rating {
  _id: ObjectId,
  appointmentId: ObjectId,      // Required, unique, references Appointment._id
  doctorId: ObjectId,           // Required, references Doctor._id
  userId: ObjectId,             // Required, references User._id
  rating: Number,               // Required, min: 1, max: 5
  comments: String,
  createdAt: Date,              // Auto-generated
  updatedAt: Date               // Auto-generated
}

# Relationships Overview
User → Address: One-to-Many
→ A user can have multiple addresses

User → Appointment: One-to-Many
→ A user can book multiple appointments

Doctor → Appointment: One-to-Many
→ A doctor can have multiple appointments

Appointment → Rating: One-to-One
→ One rating per appointment

User → Rating: One-to-Many
→ A user can submit multiple ratings

Doctor → Rating: One-to-Many
→ A doctor can receive multiple ratings

Doctor → Address: One-to-One
→ A doctor has one address stored in Address collection