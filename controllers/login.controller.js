const Employee = require('../models/employee')
const jwt = require('jsonwebtoken');

const signin = async (req, res) => {
    const { employeeId, employeePassword } = req.body;
  try {
    const employee = await Employee.findOne({ employeeId, employeePassword });
    if (employee) {
      const token = generateAuthToken(employee);
      const role = employee.employeeRole ;
      const name = employee.name + " " + employee.surName;
      res.status(200).json({ status:200, message: 'Login successful.', token, employeeId, role ,name});
    } else {
      res.status(401).json({ status:401,  message: 'Invalid credentials.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({status :500,  error: 'Internal Server Error' });
  }
}

//Generate JWT token
function generateAuthToken(employee) {
    const token = jwt.sign({ _id: employee._id, userId: employee.employeeId, role: employee.employeeRole }, process.env.SECRET_KEY, { expiresIn: '6h' });
    return token; //Return Token
}

module.exports ={ signin }