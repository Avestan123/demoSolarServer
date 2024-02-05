const Employee = require("../models/employee");
const Customers = require("../models/customer");
const cron = require('node-cron');
const moment = require('moment-timezone');
const { ObjectId } = require('mongodb');

function calculateDelayForTomorrow() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(18, 29, 0, 0);

  const delay = tomorrow - now;
  return delay;
};

const getAllEmployeesNameForContextOtherThanUser = async (req, res) => {
  try {
    const userId = req.user._id;
    let employees;
    if ( req.user.employeeRole === "Admin" ) {
      employees = await Employee.find({
        _id: { $ne: userId },
        isEmployee: true,
      }).select({ name: 1, surName: 1 });
    }
    else if ( req.user.employeeRole === "General Sales Manager" ) {
      employees = await Employee.find({
        _id: { $ne: userId },
        employeeRole: { $in: [ "Sales Executive", "Sales Manager" ] },
        isEmployee: true,
      }).select({ name: 1, surName: 1 });
    } 
    else {
      employees = await Employee.find({
        _id: { $ne: userId },
        employeeRole: { $in: [ "Sales Executive"] },
        isEmployee: true,
      }).select({ name: 1, surName: 1 });
    };
    
    return res.status(200).json({ status: 200, employees: employees });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const assignLead = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const customerId = req.params.customerId;
    const userId = req.user._id;

    const employee = await Employee.findOne({ _id: employeeId });

    const customerAssignedToSameEmployee = await Customers.findOne({ _id: customerId, transferredTo: employeeId });
    if (customerAssignedToSameEmployee) {
        return res.status(409).json({ error: 'customer already assigned to same employee'});
    }
    const customer = await Customers.findOne({ _id: customerId });
    const existingTransferredToField = customer.transferredTo;

    const loggedInUser = await Employee.findOne({ _id: userId });

    // Schedule the task
    setTimeout(async () => {
      try {
          // set previous assignedLeads to employee
          const updatedAssignedLeads = employee.assignedLeads.filter(leadId => {
            return leadId.toString() !== customerId
          });
          // const updatedAssignedLeads = employee.assignedLeads;
          await Employee.findOneAndUpdate({ _id: employeeId }, { assignedLeads: updatedAssignedLeads } );
  
          // set previous transferredLeads to loggedInUser
          const updatedTransferredLeads = loggedInUser.transferredLeads.filter(leadId => {
            return leadId.toString() !== customerId
          });
          await Employee.findOneAndUpdate({ _id: userId }, { transferredLeads: updatedTransferredLeads } )

          await Customers.findOneAndUpdate({ _id: customerId }, { transferredTo: existingTransferredToField })
      } catch (error) {
          console.error(error);
      }
    }, calculateDelayForTomorrow());
    employee.assignedLeads.push(customerId)
    const updatedAssignedLeads = employee.assignedLeads;
    await Employee.findOneAndUpdate({ _id: employeeId }, { assignedLeads: updatedAssignedLeads } );
    await Customers.findOneAndUpdate({ _id: customerId }, { transferredTo: employeeId })
    loggedInUser.transferredLeads.push(customerId)
    const updatedTransferredLeads = loggedInUser.transferredLeads;
    await Employee.findOneAndUpdate({ _id: userId }, { transferredLeads: updatedTransferredLeads } )
      
    return res.status(200).json({ message: "Lead assigned successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const deActivateEmployee = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    const employee = await Employee.findOneAndUpdate({ _id: employeeId }, { isEmployee: false }, { new: true });
    if (!employee) {
      return res.status(404).json({ status: 404, message: "employee not found with id" });
    };
    return res.status(200).json({ status: 200, message: "employee deactivated", employee: employee });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const assignLeadsPermanently =  async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const inactiveEmployeeId = req.params.inactiveEmployeeId;
    const userId = req.user._id;

    const employee = await Employee.findOne({ _id: employeeId });
    if (!employee) {
      return res.status(404).json({ status: 404, message: "employee not found with id" });
    };
    const inactiveEmployee = await Employee.findOne({ _id: inactiveEmployeeId });
    if (!inactiveEmployee) {
      return res.status(404).json({ status: 404, message: "inactive employee not found with id" });
    };
    const loggedInUser = await Employee.findOne({ _id: userId });

    const customersOfInactiveEmployee = await Customers.find({ transferredTo: inactiveEmployeeId });
    for (const customer of customersOfInactiveEmployee) {
      customer.transferredTo = employeeId;
      await customer.save();
      employee.assignedLeads.push(customer._id);
      loggedInUser.transferredLeads.push(customer._id);
    };
    await employee.save();
    await loggedInUser.save();

    return res.status(200).json({ message: "Permanently Leads assigned successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllEmployeesNameForContextOtherThanUser, assignLead, deActivateEmployee, assignLeadsPermanently };
