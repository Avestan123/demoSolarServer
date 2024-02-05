const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises; // Import the fs.promises module for file system operations
const Customers = require("../models/customer");
const Employees = require("../models/employee");
const nodemailer = require("nodemailer"); // npm install nodemailer
const checkAuth = require("../middleware/checkAuth");
const mongoose = require("mongoose");
const moment = require('moment-timezone');
const cloudinary = require('../config/cloudinary')

const addCustomer = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      clientName,
      email,
      number,
      altNumber,
      address,
      city,
      requirement,
      retailProductName,
      remarks,
      clientlevel,
      state,
      contactPerson,
      gst,
      source,
      referralName,
      otherSource,
      pin,
      dob,
      followUpDate
    } = req.body;
    const { electricitybill, pancard, adharcard, taxreceipt } = req.files;
      
    let kilowatts = req.body.kilowatts;

    if (!clientName) {
      return res.status(400).json({ error: 'Client Name is required'});
    }
    if (email) {
      const existingCustomerWithEmail = await Customers.findOne({ email: email });
      if (existingCustomerWithEmail) {
        return res.status(409).json({ error: 'Customer already exists with the email'})
      }
    };
    if (!number) {
      return res.status(400).json({ error: 'Number is required'});
    }
    const existingCustomer = await Customers.findOne({ number: number });
    if (existingCustomer) {
      return res.status(409).json({ error: 'Customer already exists with the number'})
    }
    if (!address) {
      return res.status(400).json({ error: 'Address is required'});
    }
    if (!state) {
      return res.status(400).json({ error: 'State is required'});
    }
    if (!city) {
      return res.status(400).json({ error: 'City is required'});
    }
    if (!followUpDate) {
      return res.status(400).json({ error: 'Follow Up Date is required'});
    }
    if (!requirement) {
      return res.status(400).json({ error: 'Requirement is required'});
    }
    if (!remarks) {
      return res.status(400).json({ error: 'Remarks is required'});
    }
    if (!clientlevel) {
      return res.status(400).json({ error: 'Client Level is required'});
    }
    if (!source) {
      return res.status(400).json({ error: 'Source is required'});
    }
    if (isNaN(kilowatts)) {
        kilowatts = 0;
    }

    let electricityBillFile, pancardFile, adharcardFile, taxReceiptFile;
    if (electricitybill) {
      electricityBillFile = await cloudinary(electricitybill[0].buffer);
    };
    if (pancard) {
      pancardFile = await cloudinary(pancard[0].buffer);
    };
    if (adharcard) {
      adharcardFile = await cloudinary(adharcard[0].buffer);
    };
    if (taxreceipt) {
      taxReceiptFile = await cloudinary(taxreceipt[0].buffer);
    };
    
    await Promise.allSettled([electricityBillFile, pancardFile, adharcardFile, taxReceiptFile]);

    const getUser = await Employees.findOne({ _id: userId });
    const newCustomer = new Customers({
      clientName,
      email,
      number,
      altNumber,
      address,
      city,
      requirement,
      kilowatts,
      retailProductName,
      remarks,
      clientlevel,
      state,
      contactPerson,
      gst,
      source,
      referralName,
      otherSource,
      pin,
      dob,
      followUpDate,
      latestFollowUpDate:followUpDate,
      transferred: true,
      transferredTo: getUser._id,
      electricitybill: electricityBillFile?.secure_url,
      pancard: pancardFile?.secure_url,
      adharcard: adharcardFile?.secure_url,
      taxreceipt: taxReceiptFile?.secure_url,
      createBy: req.user._id,
    });
    await newCustomer.save();
    res.status(200).json({ status: 200, message: "Customer added successfully", customer: newCustomer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: error.message });
  }
};


const saveAndTransfer = async (req, res)=> {
  try {
    const userId = req.user._id;
    const {
      clientName,
      email,
      number,
      altNumber,
      address,
      city,
      requirement,
      retailProductName,
      remarks,
      clientlevel,
      state,
      contactPerson,
      gst,
      source,
      referralName,
      otherSource,
      pin,
      dob,
      followUpDate
    } = req.body;
    const { electricitybill, pancard, adharcard, taxreceipt } = req.files;

    let kilowatts = req.body.kilowatts;
    
    if (!clientName) {
      return res.status(400).json({ error: 'Client Name is required'});
    }
    if (email) {
      const existingCustomerWithEmail = await Customers.findOne({ email: email });
      if (existingCustomerWithEmail) {
        return res.status(409).json({ error: 'Customer already exists with the email'})
      }
    };
    if (!number) {
      return res.status(400).json({ error: 'Number is required'});
    }
    const existingCustomer = await Customers.findOne({ number: number });
    if (existingCustomer) {
      return res.status(409).json({ error: 'Customer already exists with the number'})
    }
    if (!address) {
      return res.status(400).json({ error: 'Address is required'});
    }
    if (!state) {
      return res.status(400).json({ error: 'State is required'});
    }
    if (!city) {
      return res.status(400).json({ error: 'City is required'});
    }
    if (!followUpDate) {
      return res.status(400).json({ error: 'Follow Up Date is required'});
    }
    if (!requirement) {
      return res.status(400).json({ error: 'Requirement is required'});
    }
    if (!remarks) {
      return res.status(400).json({ error: 'Remarks is required'});
    }
    if (!clientlevel) {
      return res.status(400).json({ error: 'Client Level is required'});
    }
    if (!source) {
      return res.status(400).json({ error: 'Source is required'});
    }
    if (isNaN(kilowatts)) {
        kilowatts = 0;
    }

    let electricityBillFile, pancardFile, adharcardFile, taxReceiptFile;
    if (electricitybill) {
      electricityBillFile = await cloudinary(electricitybill[0].buffer);
    };
    if (pancard) {
      pancardFile = await cloudinary(pancard[0].buffer);
    };
    if (adharcard) {
      adharcardFile = await cloudinary(adharcard[0].buffer);
    };
    if (taxreceipt) {
      taxReceiptFile = await cloudinary(taxreceipt[0].buffer);
    };
    
    await Promise.allSettled([electricityBillFile, pancardFile, adharcardFile, taxReceiptFile]);

    let getUser;
    if (req.user.employeeRole === "Sales Manager" ) {
      getUser = await Employees.findOne({ employeeRole: "General Sales Manager" });
    } 
    else {
      getUser = await Employees.findOne({ employeeRole: "Sales Manager"});
    };
    const newCustomer = new Customers({
      clientName,
      email,
      number,
      altNumber,
      address,
      city,
      requirement,
      kilowatts,
      retailProductName,
      remarks,
      clientlevel,
      state,
      contactPerson,
      gst,
      source,
      referralName,
      otherSource,
      pin,
      dob,
      followUpDate,
      latestFollowUpDate:followUpDate,
      transferred: true,
      transferredTo: getUser._id,
      electricitybill: electricityBillFile?.secure_url,
      pancard: pancardFile?.secure_url,
      adharcard: adharcardFile?.secure_url,
      taxreceipt: taxReceiptFile?.secure_url,
      createBy: req.user._id,
    });
    await newCustomer.save();

    getUser.assignedLeads.push(newCustomer._id);
    await getUser.save();

    const loggedInUser = await Employees.findOne({_id: userId })
    loggedInUser.transferredLeads.push(newCustomer._id);
    await loggedInUser.save();

    res.status(200).json({ status: 200, message: "Customer added and transferred successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
}

const setCustomerAsLost = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const { reason } = req.body;

    const customerAlreadySetToLast = await Customers.findOne({ _id: customerId , status: "lost" });
    if (customerAlreadySetToLast) {
      return res.status(409).json({ message: 'Customer already set to lost' });
    }
    const customer = await Customers.findOneAndUpdate({ _id: customerId }, { reason: reason, status: "lost" });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ status: 200, message: "Customer status updated to lost" })
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
};

const get_all_customers = async (req, res) => {
  const userId = req.user._id;
  // Get the current date in IST
  const currentDateAndTimeIST = moment().tz('Asia/Kolkata');
  const currentDateAndTimeInProperFormat = moment().tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  
  const currentDateIST = currentDateAndTimeInProperFormat.split('T')[0];
  
  // Get tomorrow's date
  const tomorrowDateIST = currentDateAndTimeIST.clone().add(1, 'days');
  const formattedTomorrowsDate = tomorrowDateIST.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]').split('T')[0];
  
  // Set the time to 9:00 am IST
  const currentDateWith9AM = currentDateAndTimeIST.set({ hour: 9, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  // Set the time to 5:00 pm IST
  const currentDateWith5PM = currentDateAndTimeIST.set({ hour: 17, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

  const tomorrowsDate = new Date();
  tomorrowsDate.setDate(tomorrowsDate.getDate() + 1);
  

  const user = await Employees.findOne({ _id: userId });

  let allCustomers, totalLeads, lostLeads, todaysFollowUps, nextDaysFollowUps, upcomingFollowUps, missedFollowUps, activeWorkOrders;
  try {
    if (req.user.employeeRole === "Admin") {
      allCustomers = await Customers.aggregate([
        {
          $match: {
            $or: [
              { status: "success" },
              { status: "workOrder" },
            ],
          },
        },
        {
          $lookup: {
            from: "employees", // The name of the referenced collection
            localField: "createBy", // The field from the input documents
            foreignField: "_id", // The field from the referenced documents
            as: "createdByUserDetails", // The name of the new array field
          },
        },
        {
          $unwind: {
            path: "$createdByUserDetails",
            preserveNullAndEmptyArrays: true, // Preserve unmatched documents
          },
        },
        {
          $project: {
            _id: 1,
            clientName: 1,
            email: 1,
            number: 1,
            altNumber:1,
            address: 1,
            city:1,
            pin:1,
            dob:1,
            source:1,
            otherSource:1,
            followUpDate: 1,
            latestFollowUpDate :1,
            requirement: 1,
            remarks: 1,
            clientlevel:1,
            additionalFollowups: 1,
            electricityBill: 1,
            pancard: 1,
            adharcard: 1,
            textRecipe: 1,
            status: 1,
            createdAt:1,
            createBy: 1,
            createByName: {
              $ifNull: ["$createdByUserDetails.name", "NA"],
            },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);

      
      const leads = await Customers.find({ status: "onboarding" }).sort({ createdAt: -1 });
      const createdByIds = leads.map(lead => lead.createBy);
      const employees = await Employees.find({ _id: { $in: createdByIds } });
      const employeeMap = employees.reduce((map, employee) => {
        map[employee._id.toString()] = employee;
        return map;
      }, {});
      
      totalLeads = leads.map(lead => ({
        lead,
        createByName: employeeMap[lead.createBy.toString()].name + " " + employeeMap[lead.createBy.toString()].surName,
        allLeads: true,
      }));
      const leads2 = await Customers.find({ status: "lost" }).sort({ createdAt: -1 });
      const createdByIds2 = leads2.map(lead => lead.createBy);
      const employees2 = await Employees.find({ _id: { $in: createdByIds2 } });
      const employeeMap2 = employees2.reduce((map, employee) => {
        map[employee._id.toString()] = employee;
        return map;
      }, {});
      
      lostLeads = leads2.map(lead => ({
        lead,
        createByName: employeeMap2[lead.createBy.toString()].name + " " + employeeMap2[lead.createBy.toString()].surName,
      }));

      if ( currentDateAndTimeInProperFormat < currentDateWith5PM ) {
        const leads3 = await Customers.find({ latestFollowUpDate: { $eq: currentDateIST }, status: "onboarding" }).sort({ createdAt: -1 });
      
        const createdByIds3 = leads3.map(lead => lead.createBy);
        const employees3 = await Employees.find({ _id: { $in: createdByIds3 } });
        const employeeMap3 = employees3.reduce((map, employee) => {
          map[employee._id.toString()] = employee;
          return map;
        }, {});
        
        todaysFollowUps = leads3.map(lead => ({
          lead,
          createByName: employeeMap3[lead.createBy.toString()].name + " " + employeeMap3[lead.createBy.toString()].surName,
        }));
      } else { todaysFollowUps = [];};
      const leads4 = await Customers.find({
        $and: [
          { latestFollowUpDate: { $eq: formattedTomorrowsDate } },
          { status: "onboarding" },
        ],
      }).sort({ createdAt: -1 });
      const createdByIds4 = leads4.map(lead => lead.createBy);
      const employees4 = await Employees.find({ _id: { $in: createdByIds4 } });
      const employeeMap4 = employees4.reduce((map, employee) => {
        map[employee._id.toString()] = employee;
        return map;
      }, {});
      
      nextDaysFollowUps = leads4.map(lead => ({
        lead,
        createByName: employeeMap4[lead.createBy.toString()].name + " " + employeeMap4[lead.createBy.toString()].surName,
      }));
      const leads5 = await Customers.find({ latestFollowUpDate: { $gt: formattedTomorrowsDate } }).sort({ createdAt: -1 });
      const createdByIds5 = leads5.map(lead => lead.createBy);
      const employees5 = await Employees.find({ _id: { $in: createdByIds5 } });
      const employeeMap5 = employees5.reduce((map, employee) => {
        map[employee._id.toString()] = employee;
        return map;
      }, {});
      
      upcomingFollowUps = leads5.map(lead => ({
        lead,
        createByName: employeeMap5[lead.createBy.toString()].name + " " + employeeMap5[lead.createBy.toString()].surName,
      }));
      let leads6;
      if ( currentDateAndTimeInProperFormat > currentDateWith5PM ) {
        leads6 = await Customers.find({
          $and: [
                { latestFollowUpDate: { $lte: currentDateIST } },
                { status: "onboarding" },
              ],
        }).sort({ createdAt: -1 });
      } else {
        leads6 = await Customers.find({
          $and: [
                { latestFollowUpDate: { $lt: currentDateIST } },
                { status: "onboarding" },
              ],
        }).sort({ createdAt: -1 });
      };
      
      const createdByIds6 = leads6.map(lead => lead.createBy);
      const employees6 = await Employees.find({ _id: { $in: createdByIds6 } });
      const employeeMap6 = employees6.reduce((map, employee) => {
        map[employee._id.toString()] = employee;
        return map;
      }, {});
      
      missedFollowUps = leads6.map(lead => ({
        lead,
        createByName: employeeMap6[lead.createBy.toString()].name + " " + employeeMap6[lead.createBy.toString()].surName,
      }));

      activeWorkOrders = await Customers.find({ status: "workOrder" }).sort({ createdAt: -1 });

    }
    else if ( req.user.employeeRole === "General Sales Manager" ) {

      const salesEmployees = await Employees.find({ employeeRole: { $in: [ "Sales Executive", "Sales Manager" ]}, isEmployee: true  });
      const salesEmployeesIds = salesEmployees.map(employee => employee._id);

      const userIdAndSalesEmployeeIds = [...salesEmployeesIds, userId];

      const leads21 = await Customers.find({ transferredTo: { $in: userIdAndSalesEmployeeIds }, status: "onboarding" }).sort({ createdAt: -1 });
      const createdByIds1 = leads21.map(lead => lead.createBy);
      const employees1 = await Employees.find({ _id: { $in: createdByIds1 } });
      const employeeMap1 = employees1.reduce((map, employee) => {
        map[employee._id.toString()] = employee;
        return map;
      }, {});
      totalLeads = leads21.map(lead => ({
        lead,
        createByName: employeeMap1[lead.createBy.toString()].name + " " + employeeMap1[lead.createBy.toString()].surName,
        allLeads: true,
      }));
      const leads22 = await Customers.find({ transferredTo: { $in: userIdAndSalesEmployeeIds }, status: "lost" }).sort({ createdAt: -1 });
      const createdByIds2 = leads22.map(lead => lead.createBy);
      const employees2 = await Employees.find({ _id: { $in: createdByIds2 } });
      const employeeMap2 = employees2.reduce((map, employee) => {
        map[employee._id.toString()] = employee;
        return map;
      }, {});
      lostLeads = leads22.map(lead => ({
        lead,
        createByName: employeeMap2[lead.createBy.toString()].name + " " + employeeMap2[lead.createBy.toString()].surName,
      }));
      if ( currentDateAndTimeInProperFormat < currentDateWith5PM ) {
        const leads23 = await Customers.find({ transferredTo: { $in: userIdAndSalesEmployeeIds }, latestFollowUpDate: { $eq: currentDateIST }, status: "onboarding" }).sort({ createdAt: -1 });
        const createdByIds3 = leads23.map(lead => lead.createBy);
        const employees3 = await Employees.find({ _id: { $in: createdByIds3 } });
        const employeeMap3 = employees3.reduce((map, employee) => {
        map[employee._id.toString()] = employee;
        return map;
      }, {});
        todaysFollowUps = leads23.map(lead => ({
          lead,
          createByName: employeeMap3[lead.createBy.toString()].name + " " + employeeMap3[lead.createBy.toString()].surName,
        }));
      } else { todaysFollowUps = [];};
      const leads24 = await Customers.find({ 
        $and: [
          { transferredTo: { $in: userIdAndSalesEmployeeIds }},
          { latestFollowUpDate: { $eq: formattedTomorrowsDate } },
          { status: "onboarding" },
        ],
      }).sort({ createdAt: -1 });
      const createdByIds4 = leads24.map(lead => lead.createBy);
      const employees4 = await Employees.find({ _id: { $in: createdByIds4 } });
      const employeeMap4 = employees4.reduce((map, employee) => {
        map[employee._id.toString()] = employee;
        return map;
      }, {});
      nextDaysFollowUps = leads24.map(lead => ({
        lead,
        createByName: employeeMap4[lead.createBy.toString()].name + " " + employeeMap4[lead.createBy.toString()].surName,
      }));
      const leads25 = await Customers.find({ transferredTo: { $in: userIdAndSalesEmployeeIds }, latestFollowUpDate: { $gt: formattedTomorrowsDate }, status: "onboarding" }).sort({ createdAt: -1 });
      const createdByIds5 = leads25.map(lead => lead.createBy);
      const employees5 = await Employees.find({ _id: { $in: createdByIds5 } });
      const employeeMap5 = employees5.reduce((map, employee) => {
        map[employee._id.toString()] = employee;
        return map;
      }, {});
      upcomingFollowUps = leads25.map(lead => ({
        lead,
        createByName: employeeMap5[lead.createBy.toString()].name + " " + employeeMap5[lead.createBy.toString()].surName,
      }));
      let leads26;
      if ( currentDateAndTimeInProperFormat > currentDateWith5PM ) {
        leads26 = await Customers.find({
          $and: [
            { transferredTo: { $in: userIdAndSalesEmployeeIds }},
            { latestFollowUpDate: { $lte: currentDateIST } },
            { status: "onboarding" },
          ],
        }).sort({ createdAt: -1 });
      } else {
        leads26 = await Customers.find({
          $and: [
            { transferredTo: { $in: userIdAndSalesEmployeeIds }},
            { latestFollowUpDate: { $lt: currentDateIST } },
            { status: "onboarding" },
          ],
        }).sort({ createdAt: -1 });
      }
      const createdByIds6 = leads26.map(lead => lead.createBy);
      const employees6 = await Employees.find({ _id: { $in: createdByIds6 } });
      const employeeMap6 = employees6.reduce((map, employee) => {
        map[employee._id.toString()] = employee;
        return map;
      }, {});
      
      missedFollowUps = leads26.map(lead => ({
        lead,
        createByName: employeeMap6[lead.createBy.toString()].name + " " + employeeMap6[lead.createBy.toString()].surName,
      }));
      activeWorkOrders = await Customers.find({ transferredTo: { $in: userIdAndSalesEmployeeIds }, status: "workOrder" }).sort({ createdAt: -1 });

    } 
    else if ( req.user.employeeRole === "Sales Manager" ) {

      const salesEmployees = await Employees.find({ employeeRole: "Sales Executive", isEmployee: true });
      const salesEmployeesIds = salesEmployees.map(employee => employee._id);

      const userIdAndSalesEmployeeIds = [...salesEmployeesIds, userId];

      const leads15 = await Customers.find({ transferredTo: { $in: userIdAndSalesEmployeeIds }, status: "onboarding" }).sort({ createdAt: -1 });
      const createdByIds1 = leads15.map(lead => lead.createBy);
      const employees1 = await Employees.find({ _id: { $in: createdByIds1 } });
      const employeeMap1 = employees1.reduce((map, employee) => {
        map[employee._id.toString()] = employee;
        return map;
      }, {});
      totalLeads = leads15.map(lead => ({
        lead,
        createByName: employeeMap1[lead.createBy.toString()].name + " " + employeeMap1[lead.createBy.toString()].surName,
        allLeads: true,
      }));
      const leads16 = await Customers.find({ transferredTo: { $in: userIdAndSalesEmployeeIds }, status: "lost" }).sort({ createdAt: -1 });
      const createdByIds2 = leads16.map(lead => lead.createBy);
      const employees2 = await Employees.find({ _id: { $in: createdByIds2 } });
      const employeeMap2 = employees2.reduce((map, employee) => {
        map[employee._id.toString()] = employee;
        return map;
      }, {});
      lostLeads = leads16.map(lead => ({
        lead,
        createByName: employeeMap2[lead.createBy.toString()].name + " " + employeeMap2[lead.createBy.toString()].surName,
      }));
      if ( currentDateAndTimeInProperFormat < currentDateWith5PM ) {
        const leads17 = await Customers.find({ transferredTo: { $in: userIdAndSalesEmployeeIds }, latestFollowUpDate: { $eq: currentDateIST }, status: "onboarding" }).sort({ createdAt: -1 });
        const createdByIds3 = leads17.map(lead => lead.createBy);
        const employees3 = await Employees.find({ _id: { $in: createdByIds3 } });
        const employeeMap3 = employees3.reduce((map, employee) => {
        map[employee._id.toString()] = employee;
        return map;
      }, {});
        todaysFollowUps = leads17.map(lead => ({
          lead,
          createByName: employeeMap3[lead.createBy.toString()].name + " " + employeeMap3[lead.createBy.toString()].surName,
        }));
      } else { todaysFollowUps = [];};
      const leads18 = await Customers.find({ 
        $and: [
          { transferredTo: { $in: userIdAndSalesEmployeeIds }},
          { latestFollowUpDate: { $eq: formattedTomorrowsDate } },
          { status: "onboarding" },
        ],
      }).sort({ createdAt: -1 });
      const createdByIds4 = leads18.map(lead => lead.createBy);
      const employees4 = await Employees.find({ _id: { $in: createdByIds4 } });
      const employeeMap4 = employees4.reduce((map, employee) => {
        map[employee._id.toString()] = employee;
        return map;
      }, {});
      nextDaysFollowUps = leads18.map(lead => ({
        lead,
        createByName: employeeMap4[lead.createBy.toString()].name + " " + employeeMap4[lead.createBy.toString()].surName,
      }));
      const leads19 = await Customers.find({ transferredTo: { $in: userIdAndSalesEmployeeIds }, latestFollowUpDate: { $gt: formattedTomorrowsDate }, status: "onboarding" }).sort({ createdAt: -1 });
      const createdByIds5 = leads19.map(lead => lead.createBy);
      const employees5 = await Employees.find({ _id: { $in: createdByIds5 } });
      const employeeMap5 = employees5.reduce((map, employee) => {
        map[employee._id.toString()] = employee;
        return map;
      }, {});
      upcomingFollowUps = leads19.map(lead => ({
        lead,
        createByName: employeeMap5[lead.createBy.toString()].name + " " + employeeMap5[lead.createBy.toString()].surName,
      }));
      
      let leads20;
      if ( currentDateAndTimeInProperFormat > currentDateWith5PM ) {
        leads20 = await Customers.find({
          $and: [
            { transferredTo: { $in: userIdAndSalesEmployeeIds }},
            { latestFollowUpDate: { $lte: currentDateIST } },
            { status: "onboarding" },
          ],
        }).sort({ createdAt: -1 });
      } else {
        leads20 = await Customers.find({
          $and: [
            { transferredTo: { $in: userIdAndSalesEmployeeIds }},
            { latestFollowUpDate: { $lt: currentDateIST } },
            { status: "onboarding" },
          ],
        }).sort({ createdAt: -1 });
      }
      const createdByIds6 = leads20.map(lead => lead.createBy);
      const employees6 = await Employees.find({ _id: { $in: createdByIds6 } });
      const employeeMap6 = employees6.reduce((map, employee) => {
        map[employee._id.toString()] = employee;
        return map;
      }, {});
      
      missedFollowUps = leads20.map(lead => ({
        lead,
        createByName: employeeMap6[lead.createBy.toString()].name + " " + employeeMap6[lead.createBy.toString()].surName,
      }));
      activeWorkOrders = await Customers.find({ transferredTo: { $in: userIdAndSalesEmployeeIds }, status: "workOrder" }).sort({ createdAt: -1 });

    } else {
      allCustomers = await Customers.find({ transferredTo: userId, status: "workOrder" || "success" }).sort({ createdAt: -1 });
      const leads9 = await Customers.find({ transferredTo: userId, status: "onboarding" }).sort({ createdAt: -1 });
      totalLeads = leads9.map(lead => ({
        lead,
        allLeads: true,
      }));
      const leads10 = await Customers.find({ transferredTo: userId, status: "lost" }).sort({ createdAt: -1 });
      lostLeads = leads10.map(lead => ({
        lead,
      }));
      if ( currentDateAndTimeInProperFormat < currentDateWith5PM ) {
        const leads11 = await Customers.find({ transferredTo: userId, latestFollowUpDate: { $eq: currentDateIST }, status: "onboarding" }).sort({ createdAt: -1 });
        todaysFollowUps = leads11.map(lead => ({
          lead,
        }));
      } else { todaysFollowUps = [];};
      const leads12 = await Customers.find({ 
        $and: [
          { transferredTo: userId},
          { latestFollowUpDate: { $eq: formattedTomorrowsDate } },
          { status: "onboarding" },
        ],
      }).sort({ createdAt: -1 });
      nextDaysFollowUps = leads12.map(lead => ({
        lead,
      }));
      const leads13 = await Customers.find({ transferredTo: userId, latestFollowUpDate: { $gt: formattedTomorrowsDate }, status: "onboarding" }).sort({ createdAt: -1 });
      upcomingFollowUps = leads13.map(lead => ({
        lead,
      }));
      let leads14;
      if ( currentDateAndTimeInProperFormat > currentDateWith5PM ) {
        leads14 = await Customers.find({
          $and: [
            { transferredTo: userId},
            { latestFollowUpDate: { $lte: currentDateIST } },
            { status: "onboarding" },
          ],
        }).sort({ createdAt: -1 });
      } else {
        leads14 = await Customers.find({
          $and: [
            { transferredTo: userId},
            { latestFollowUpDate: { $lt: currentDateIST } },
            { status: "onboarding" },
          ],
        }).sort({ createdAt: -1 });
      }
      
      missedFollowUps = leads14.map(lead => ({
        lead,
      }));
      activeWorkOrders = await Customers.find({ transferredTo: userId, status: "workOrder" }).sort({ createdAt: -1 });

    }
    // Fetch all customers from the database
    
    const leads7 = await Customers.find({ _id: { $in: user.assignedLeads } }).sort({ createdAt: -1 });
    const createdByIds7 = leads7.map(lead => lead.createBy);
    const employees7 = await Employees.find({ _id: { $in: createdByIds7 } });
    const employeeMap7 = employees7.reduce((map, employee) => {
      map[employee._id.toString()] = employee;
      return map;
    }, {});
    
    const assignedLeads = leads7.map(lead => ({
      lead,
      createByName: employeeMap7[lead.createBy.toString()].name + " " + employeeMap7[lead.createBy.toString()].surName,
    }));
    const leads8 = await Customers.find({ _id: { $in: user.transferredLeads } }).sort({ createdAt: -1 });
    const createdByIds8 = leads8.map(lead => lead.createBy);
    const employees8 = await Employees.find({ _id: { $in: createdByIds8 } });
    const employeeMap8 = employees8.reduce((map, employee) => {
      map[employee._id.toString()] = employee;
      return map;
    }, {});
    
    const transferredLeads = leads8.map(lead => ({
      lead,
      createByName: employeeMap8[lead.createBy.toString()].name + " " + employeeMap8[lead.createBy.toString()].surName,
    }));

    res.status(200).json({
                          customers: allCustomers, totalLeads: totalLeads, lostLeads: lostLeads, assignedLeads: assignedLeads, transferredLeads: transferredLeads,
                          todaysFollowUps: todaysFollowUps, nextDaysFollowUps: nextDaysFollowUps, upcomingFollowUps: upcomingFollowUps,
                          missedFollowUps: missedFollowUps, activeWorkOrders: activeWorkOrders,
                        });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getHighValueLeads = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await Employees.findOne({ _id: userId });
    let customers;
    
    if (req.user.employeeRole === "General Sales Manager") {
      const salesEmployees = await Employees.find({ employeeRole: { $in: ["Sales Executive", "Sales Manager"] } });
      const salesEmployeesIds = salesEmployees.map(employee => employee._id);

      const userIdAndSalesEmployeeIds = [...salesEmployeesIds, userId];
      customers = await Customers.find({ transferredTo: { $in: userIdAndSalesEmployeeIds }, clientlevel: "High-value", status: "onboarding" }).sort({ createdAt: -1 });
    }
    else if (req.user.employeeRole === "Sales Manager") {
      const salesEmployees = await Employees.find({ employeeRole: "Sales Executive" });
      const salesEmployeesIds = salesEmployees.map(employee => employee._id);

      const userIdAndSalesEmployeeIds = [...salesEmployeesIds, userId];
      customers = await Customers.find({ transferredTo: { $in: userIdAndSalesEmployeeIds }, clientlevel: "High-value", status: "onboarding" }).sort({ createdAt: -1 });
    } else {
      customers = await Customers.find({ transferredTo: userId, clientlevel: "High-value", status: "onboarding" }).sort({ createdAt: -1 });
    }

    const createdByIds = customers.map(lead => lead.createBy);
    const employees = await Employees.find({ _id: { $in: createdByIds } });
    const employeeMap = employees.reduce((map, employee) => {
      map[employee._id.toString()] = employee;
      return map;
    }, {});
    const leads = customers.map(lead => ({
      lead,
      createByName: employeeMap[lead.createBy.toString()].name + " " + employeeMap[lead.createBy.toString()].surName,
    }));

    return res.status(200).json({ highValueLeads: leads });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// get todays leads
const get_todays_leads = async (req, res) => {
  console.log(req.user);
  const userId = req.user._id;
  const todayDate = new Date().toISOString().split('T')[0]; // Get today's date in "YYYY-MM-DD" format
  try {
    if (req.user.employeeRole === "Admin") {
      todaysLeads = await Customers.aggregate([
        {
          $match: {
            // followUpDate: {
            //   $gte: todayStart.toISOString(),
            //   $lt: todayEnd.toISOString(),
            // },
            followUpDate: todayDate,
          },
        },
        {
          $lookup: {
            from: "employees", // The name of the referenced collection
            localField: "createBy", // The field from the input documents
            foreignField: "_id", // The field from the referenced documents
            as: "createdByUserDetails", // The name of the new array field
          },
        },
        {
          $unwind: {
            path: "$createdByUserDetails",
            preserveNullAndEmptyArrays: true, // Preserve unmatched documents
          },
        },
        {
          $project: {
            _id: 1,
            clientName: 1,
            email: 1,
            number: 1,
            address: 1,
            city:1,
            followUpDate: 1,
            latestFollowUpDate:1,
            requirement: 1,
            remarks: 1,
            clientlevel:1,
            additionalFollowups: 1,
            electricityBill: 1,
            pancard: 1,
            adharcard: 1,
            textRecipe: 1,
            status: 1,
            createdAt :1,
            createBy: 1,
            createByName: {
              $ifNull: ["$createdByUserDetails.name", "NA"],
            },
          },
        },
      ]);
    } else {
      todaysLeads = await Customers.find({
        createBy: userId,
        // followUpDate: {
        //   $gte: todayStart.toISOString(),
        //   $lt: todayEnd.toISOString(),
        // },
        followUpDate: todayDate,
      });
    }
    // Fetch all customers from the database
    console.log(todaysLeads)
    res.status(200).json({ todaysLeads: todaysLeads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCustomerDetails = async (req, res) => {
  const customerId = req.params.customerId;
  const updatedDetails = req.body;
  const { electricitybill, pancard, adharcard, taxreceipt } = req.files;
  let latestFollowUpDate;
  
  let electricityBillFile, pancardFile, adharcardFile, taxReceiptFile;
  if (electricitybill) {
    electricityBillFile = await cloudinary(electricitybill[0].buffer);
  };
  if (pancard) {
    pancardFile = await cloudinary(pancard[0].buffer);
  };
  if (adharcard) {
    adharcardFile = await cloudinary(adharcard[0].buffer);
  };
  if (taxreceipt) {
    taxReceiptFile = await cloudinary(taxreceipt[0].buffer);
  };
  
  await Promise.allSettled([electricityBillFile, pancardFile, adharcardFile, taxReceiptFile]);

  try {
    // Parse the followUps string back into a JavaScript array
    if (updatedDetails.followUps && updatedDetails.followUps !== "undefined" && typeof updatedDetails.followUps === 'string') {
      updatedDetails.followUps = JSON.parse(updatedDetails.followUps);
    }

    // Check if followUps are present in the request body
    if (updatedDetails.followUps && updatedDetails.followUps !== "undefined" && updatedDetails.followUps.length > 0) {
      // Add latestFollowupDate to each object in the followUps array
      latestFollowUpDate = updatedDetails.followUps.slice(-1)[0].followUpDate;
      updatedDetails.followUps = updatedDetails.followUps.map(followUp => ({
        ...followUp,
        latestFollowUpDate,
      }));
      // Filter and map the followUps to keep only those with followUpDate and remarks
      const followUpsWithRemarks = updatedDetails.followUps
        .filter(followUp => followUp.followUpDate && followUp.remarks)
        .map(followUp => ({ followUpDate: followUp.followUpDate, remarks: followUp.remarks }));

      try {
        const filter = { _id: customerId };
        const update = { $set: {
          additionalFollowups: followUpsWithRemarks,latestFollowUpDate:latestFollowUpDate,
          electricitybill: electricityBillFile?.secure_url,
          pancard: pancardFile?.secure_url,
          adharcard: adharcardFile?.secure_url,
          taxreceipt: taxReceiptFile?.secure_url,
        } };
        const options = { new: true };

        const updatedCustomer = await Customers.findOneAndUpdate(filter, update, options);

        if (!updatedCustomer) {
          return res.status(404).json({ message: 'Customer not found' });
        }

        return res.status(200).json({
          status: 200,
          message: 'Customer details updated',
          customer: updatedCustomer
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error - customer update' });
      }
    }

    // If followUps are not present, update other fields without modifying additionalFollowups
    const updatedCustomer = await Customers.findByIdAndUpdate(
      customerId,
      { $set: {
        updatedDetails,
        electricitybill: electricityBillFile?.secure_url,
        pancard: pancardFile?.secure_url,
        adharcard: adharcardFile?.secure_url,
        taxreceipt: taxReceiptFile?.secure_url,
      } },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ status: 200, message: 'Customer details updated', customer: updatedCustomer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error - customer update' });
  }
};


const deleteCustomer = async (req, res) => {
  const customerId = req.body;
 try {
   const deleteCustomer = await  Customers.deleteOne({ _id: customerId.customerId });
   if(deleteCustomer){
    res.status(200).json({ message: 'Customer Deleted'});
   }
 } catch (error) {
  console.error(error);
    res.status(500).json({ error: "Internal Server Error- customer deletion" });
 }

}
const verify_user = async (req, res) => {
  const { role, userId } = req.body;
  try {
    const user = await User.findOne({ role, userId });
    if (user) {
      const otp = generateOTP();
      user.passwordResetOTP = otp;
      await user.save();
      // Send OTP to user's email
      await sendOTPEmail(user.userId, otp);
      res
        .status(200)
        .json({ message: "User verify successfully and Sent OTP via mail..." });
    } else {
      res.status(401).json({ message: "Invalid credentials." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verify_otp = async (req, res) => {
  const { passwordResetOTP } = req.body; // Destructure the passwordResetOTP from req.body
  try {
    const user = await User.findOne({ passwordResetOTP: passwordResetOTP });

    if (user) {
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(401).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const submit_password_reset = async (req, res) => {
  const { userId, new_password } = req.body;

  try {
    // Check if userId and new_password are provided
    if (!userId || !new_password) {
      return res
        .status(400)
        .json({ message: "Missing userId or new_password." });
    }

    // Find the user by userId
    const user = await User.findOne({ userId });

    // Check if the user exists
    if (user) {
      // Update password and reset OTP
      user.password = new_password;
      user.passwordResetOTP = undefined;

      // Save changes to the database
      await user.save();

      // Respond with success message
      res.status(200).json({ message: "Password Reset Successfully." });
    } else {
      // If user is not found, respond with an error
      res.status(401).json({ message: "Invalid credentials." });
    }
  } catch (error) {
    // Handle unexpected errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

//send OTP via email
async function sendOTPEmail(userId, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.PASSWORD,
    to: userId,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is : ${otp}`,
  };

  await transporter.sendMail(mailOptions);
}

const getMyLeads = async (req, res) => {
  try {
    const userId = req.user._id;
    const leads = await Customers.find({ transferredTo: userId, status: "onboarding" }).sort({ createdAt: -1 });
    const totalMyLeads = leads.map(lead => ({
      lead,
      allLeads: true,
    }));
    return res.status(200).json({ leads: totalMyLeads });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getMoreThan3FollowUpsLeads = async (req, res) => {
  try {
    const userId = req.user._id;

    let leads;
    if (req.user.employeeRole = "General Sales Manager" ) {
      const salesEmployees = await Employees.find({ employeeRole: { $in: [ "Sales Executive", "Sales Manager" ] } });
      const salesEmployeesIds = salesEmployees.map(employee => employee._id);

      const userIdAndSalesEmployeeIds = [...salesEmployeesIds, userId];
      leads = await Customers.find({ transferredTo: { $in: userIdAndSalesEmployeeIds }, status: "onboarding" }).sort({ createdAt: -1 });
    }
    else if (req.user.employeeRole = "Sales Manager" ) {
      const salesEmployees = await Employees.find({ employeeRole: "Sales Executive" });
      const salesEmployeesIds = salesEmployees.map(employee => employee._id);

      const userIdAndSalesEmployeeIds = [...salesEmployeesIds, userId];
      leads = await Customers.find({ transferredTo: { $in: userIdAndSalesEmployeeIds }, status: "onboarding" }).sort({ createdAt: -1 });
    };
    const filteredLeads = leads.filter(customer => customer.additionalFollowups.length > 2);
    const createdByIds = filteredLeads.map(lead => lead.createBy);
    const employees = await Employees.find({ _id: { $in: createdByIds } });
    const employeeMap = employees.reduce((map, employee) => {
      map[employee._id.toString()] = employee;
      return map;
    }, {});
    const allFilteredLeads = filteredLeads.map(lead => ({
      lead,
      createByName: employeeMap[lead.createBy.toString()].name + " " + employeeMap[lead.createBy.toString()].surName,
    }));
    return res.status(200).json({ leads: allFilteredLeads });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addCustomer,
  saveAndTransfer,
  get_all_customers,
  getHighValueLeads,
  get_todays_leads,
  updateCustomerDetails,
  deleteCustomer,
  verify_user,
  verify_otp,
  submit_password_reset,
  setCustomerAsLost,
  getMyLeads,
  getMoreThan3FollowUpsLeads,
};
