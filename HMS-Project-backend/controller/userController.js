import req from "express/lib/request.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";


export const patientRegister = catchAsyncErrors(async(req,res,next) => {
    const {firstName, lastName, email, phone, password, gender, dob, nic, role} = req.body;

    if (!firstName || !lastName || !email, !phone || !password || !gender || !dob || !nic || !role) {
        return next(new ErrorHandler("Please fill full form",400));
    }
    let user = await User.findOne({email});
    if(user){
        return next(new ErrorHandler("User already registered!",400));
    }
    user = await User.create({
        firstName, lastName, email, phone, password, gender, dob, nic, role
    });
    generateToken(user, "User Registered!",200,res);

});

export const login = catchAsyncErrors(async(req,res,next)=>{
    const{email, password, confirmPassword, role} = req.body;
    if (!email || !password || !confirmPassword || !role) {
        return next(new ErrorHandler("Please provide all details!",400));
    }
    if (password !== confirmPassword) {
        return next(new ErrorHandler("Password and confirm password do not match!",400));
    }
    const user = await User.findOne({email}).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Password or Email!",400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Password or Email",400));
    }
    // if(role !== user.role){
        // return next(new ErrorHandler("User with this role not found!",400));
    // }
    generateToken(user, "User logged in successfully!",200,res);
});

// export const addNewAdmin = catchAsyncErrors(async(req,res,next)=>{
    // const {firstName, lastName, email, phone, password, gender, dob, nic} = req.body;
    // if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic){
        // return next(new ErrorHandler("please fill full form!",400));
    // }
    // const isRegistered = await User.findOne({email});
    // if(isRegistered){
        // return next(new ErrorHandler("Admin with this Email already Exist"))
    // }
    // const admin = await User.create({firstName, lastName, email, phone, password, gender, dob, nic, role:"Admin"});
    // res.status(200).json({
        // success: true,
        // message: "New Admin Registered!"
    // });
// 
// });
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, password, gender, dob, nic } = req.body;

  // Check for missing fields
  if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic) {
    return next(new ErrorHandler("Please fill the complete form!", 400));
  }

  // Check if admin already exists
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Admin with this email already exists!", 400));
  }

  // Create new admin
  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password, // ensure password is hashed in your User model pre-save hook
    gender,
    dob,
    nic,
    role: "Admin"
  });

  res.status(201).json({
    success: true,
    message: "New Admin Registered!",
    admin: {
      id: admin._id,
      name: `${admin.firstName} ${admin.lastName}`,
      email: admin.email,
      role: admin.role,
    }
  });
}); 

export const getAllDoctors = catchAsyncErrors(async (req,res,next) => {
    const doctors = await User.find({role: "Doctor"})
    res.status(200).json({
        success: true,
        doctors,
    });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

export const getAllPatients = catchAsyncErrors(async (req, res, next) => {
  const patients = await User.find({ role: "Patient" });

  res.status(200).json({
    success: true,
    count: patients.length,
    patients,
  });
});


export const logoutAdmin = catchAsyncErrors(async (req,res,next) => {
    res.status(200).cookie("adminToken","",{
        httpOnly:true,
        expires: new Date(Date.now()),
    })
    .json({
        success: true,
        message: "Admin Logged out successfully!"
    });  
});

export const logoutPatient = catchAsyncErrors(async (req,res,next) => {
    res.status(200).cookie("patientToken","",{
        httpOnly:true,
        expires: new Date(Date.now()),
    })
    .json({
        success: true,
        message: "Patient Logged out successfully!"
    });  
});

export const addNewDoctor = catchAsyncErrors(async(req,res,next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Doctor Avatar Required!",400));
    }
    const { docAvatar } = req.files;
    const allowedFormats = ["image/png","image/jpeg","image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
        return next(new ErrorHandler("File Format not supported!",400));
    }
    const{ firstName, lastName, email, phone, password, gender, dob, nic, doctorDepartment } = req.body;

    if ( !firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !doctorDepartment ) {
        return next(new ErrorHandler("Please provide full details!", 400));
    }
    const isRegistered = await User.findOne({email});
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} already registered with this email!`,400));
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
        docAvatar.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary Error!", cloudinaryResponse.error || "Unknown cloudinary error");
    }
    const doctor = await User.create({
        firstName, lastName, email, phone, password, gender, dob, nic, doctorDepartment,
        role: "Doctor",
        docAvatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });
    res.status(200).json({
        success: true,
        message: "New Doctor Registered",
        doctor
    });

 })