const Employee= require('../models/employee')
const Customers = require("../models/customer");
const cloudinary = require('../config/cloudinary')


const addEmployee = async (req, res) =>{
    try {
        const { name, middleName, surName, address, pincode, temporaryAddress, mobileNo, alternateNo,
          email, referralName, referralPhoneNo, referralAddress,
          accountHolderName, accountNo, ifscCode,
          employeeDepartment, employeeId, employeePassword, employeeRole} = req.body;

        const { adharCard, panCard, markSheet, drivingLicense, bankDetailPhoto } = req.files;

        if (!name) {
          return res.status(400).json({ status: 400, message: "Name is required" });
        };
        if (!surName) {
          return res.status(400).json({ status: 400, message: "Sur Name is required" });
        };
        const employeeExistsWithEmail = await Employee.findOne({ email: email });
        if (employeeExistsWithEmail) {
          return res.status(409).json({ status: 409, message: "Employee already exists with the same email" });
        }
        if (!employeeId) {
          return res.status(400).json({ status: 400, message: "Employee Id is required" });
        };
        const employeeExistsWithEmployeeId = await Employee.findOne({ employeeId: employeeId });
        if (employeeExistsWithEmployeeId) {
          return res.status(409).json({ status: 409, message: "Employee already exists with the same employee id" });
        }
        if (!employeePassword) {
          return res.status(400).json({ status: 400, message: "Employee Password is required" });
        };

        let adharCardFile, panCardFile, markSheetFile, drivingLicenseFile, bankDetailPhotoFile;
        
        if (adharCard) {
          adharCardFile = await cloudinary(adharCard[0].buffer);
        };
        if (panCard) {
          panCardFile = await cloudinary(panCard[0].buffer);
        };
        if (markSheet) {
          markSheetFile = await cloudinary(markSheet[0].buffer);
        };
        if (drivingLicense) {
          drivingLicenseFile = await cloudinary(drivingLicense[0].buffer);
        };
        if (bankDetailPhoto) {
          bankDetailPhotoFile = await cloudinary(bankDetailPhoto[0].buffer);
        };
        
        await Promise.allSettled([adharCardFile, panCardFile, markSheetFile, drivingLicenseFile, bankDetailPhotoFile]);
        const newEmployee = new Employee({
          name, middleName, surName, address, pincode, temporaryAddress, mobileNo, alternateNo,
          email, referralName, referralPhoneNo, referralAddress,
          adharCard: adharCardFile?.secure_url,
          panCard: panCardFile?.secure_url,
          markSheet: markSheetFile?.secure_url,
          drivingLicense: drivingLicenseFile?.secure_url,
          bankDetailPhoto: bankDetailPhotoFile?.secure_url,
          accountHolderName, accountNo, ifscCode,
          employeeDepartment, employeeId, employeePassword, employeeRole });
        await newEmployee.save();
        res.status(200).json({ status: 200, message: 'Empoyee added successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, error: 'Internal Server Error creating Employee' }); 
    }
}

const getAllEmployees = async (req, res) => {
    const userId = req.user._id;
    let allEmployees;
    try {
        if(req.user.employeeRole==="Admin"){
          allEmployees = await Employee.find({ _id: { $ne: userId }, isEmployee: true });
        } else if (req.user.employeeRole === "Sales Manager") {
          allEmployees = await Employee.find({ employeeRole: "Sales Executive", isEmployee: true });
        } else if (req.user.employeeRole === "General Sales Manager") {
          allEmployees = await Employee.find({ employeeRole: { $in: ["Sales Executive", "Sales Manager"]}, isEmployee: true });
        } ;
        let employeeDetails = [];
        for (const employee of allEmployees) {
          const matchingCustomer = await Customers.find({ transferredTo: employee._id });
          employeeDetails.push({
            employee,
            totalLeads: matchingCustomer.length,
            totalFollowUps: matchingCustomer.reduce((total, customer) => total + customer.additionalFollowups.length + 1, 0)
          })
        };
        res.status(200).json({ status: 200,  employees : employeeDetails });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, error: 'Internal Server Error fetching Employee' });
    }
}


const updateEmpoyeeDetails = async (req, res) => {
  const empId = req.params.empId; // Assuming you're passing the customer ID in the URL
  const updatedDetails = req?.body?.data;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      empId,
      updatedDetails,
      { new: true } // This option returns the modified document instead of the original
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      status: 200,
      message: "Employee details updated",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error - employee update" });
  }
};
  
  const deleteEmployee = async (req, res) => {
    const empId = req.body;
   try {
     const deleteEmpoyee = await  Employee.deleteOne({ _id: empId.empId });
     if(deleteEmpoyee){
      res.status(200).json({ message: 'Employee Deleted'});
     }
   } catch (error) {
    console.error(error);
      res.status(500).json({ error: "Internal Server Error- employee deletion" });
   }
  
  }

module.exports = { addEmployee , getAllEmployees, updateEmpoyeeDetails, deleteEmployee}
