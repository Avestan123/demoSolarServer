const User = require('../models/user')

const addUser = async (req, res) =>{
    const { userId, password, role ,email } = req.body;
  
    try {
        const isUser = await User.findOne({ userId });
        if(isUser){
            return  res.status(500). json({status: 500, message : "UserId already present"})
        }
        const newUser = new User({ userId, password, role ,email });
        await newUser.save();
        res.status(200).json({ status: 200, message: 'User added successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, error: 'Internal Server Error' }); 
    }
}


module.exports = { addUser }