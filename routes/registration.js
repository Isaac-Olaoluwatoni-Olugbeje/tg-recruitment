const express = require('express');
const jwt = require('jsonwebtoken');
const Operator = require('../models/operators');
const Admin = require('../models/admins');
const router = express.Router();
const upload = require('../middleware/multer_config');
const { statesAndLgas } = require('../models/states');
const checkOperator = require('../middleware/check_operator');
const checkAdmin = require('../middleware/check_admin');

// Registration route for admins
router.post('/admin', checkAdmin, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, "root");
    const authLevel = decodedToken.authorizationLevel;

    const { full_name, user_id } = req.body;

    // Complete registration
    const user = await Admin.adminRegistration(
      full_name, user_id
    );
    admin = {id: user.user_id, name: user.full_name};

    res.json({ admin });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occured");
  }
});

// Registration route for operators
router.post('/operator', checkOperator, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, "root");
    const authLevel = decodedToken.authorizationLevel;

    const { full_name, phone_number, nationality, state, lga, sex, date_of_birth, nin } = req.body;

    // Validate state
    const validStates = Object.keys(statesAndLgas);
    if (!validStates.includes(state)) {
      return res.status(400).json({ error: 'Invalid state' });
    };

    // Validate local government area
    const validLgas = statesAndLgas[state];
    if (!validLgas.includes(lga)) {
      return res.status(400).json({ error: 'Invalid local government area' });
    };

    // Complete registration
    const user = await Operator.operatorRegistration(
      full_name, phone_number, nationality, state, lga, sex, date_of_birth, nin
    );

    // Update verification status
    operator = {id: user.id, name: user.full_name, sex: user.sex, };
    const operatorId = operator.id; // assuming the `id` property is present in the `operator` object
    const verificationStatus = await Operator.updateOperatorVerification('pending', operatorId);

    res.json({ operator, verificationStatus });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occured");
  }
});

// Profile picture upload route for operators
router.post('/operator/:operatorId/user-picture', checkOperator, upload.single('user_picture'), async (req, res) => {
  try {
    const { operatorId } = req.params;

    // Save file path to database
    const filePath = req.file.path;
    const operator = await Operator.updateOperatorProfilePicture(filePath, operatorId);

    res.json({ message: 'Profile picture uploaded successfully', operator });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occured");
  }
});


module.exports = router;
