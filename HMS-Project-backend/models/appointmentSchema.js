import mongoose from "mongoose";
import validator from "validator";


const appointmentSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First name must contain atleast 3 characters!"]
    },
    lastName: {
      type: String,
      required: true,
      minLength: [3, "Last name must contain atleast 3 characters!"],
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Please provide a valid email.."]
    },
    phone: {
      type: String,
      required: true,
      minLength: [10, "phone number must contain exact 10 digits!"],
      maxLength: [10, "phone number must contain exact 10 digits!"],
    },
    nic: {
      type: String,
      required: true,
      minLength: [3, "NIC must contain atleast 3 digits!"],
      maxLength: [13, "NIC must contain atmost 13 digits!"],
    },
    dob: {
      type:Date,
      required: [true,"DOB is required"],
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male","Female"],
    },
     appointment_date: {
    type: String,
    required: [true, "Appointment Date Is Required!"],
  },
  department: {
    type: String,
    required: [true, "Department Name Is Required!"],
  },
  doctor: {
    firstName: {
      type: String,
      required: [true, "Doctor Name Is Required!"],
    },
    lastName: {
      type: String,
      required: [true, "Doctor Name Is Required!"],
    },
  },
  hasVisited: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    required: [true, "Address Is Required!"],
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Doctor Id Is Invalid!"],
  },
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Patient Id Is Required!"],
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);
  
