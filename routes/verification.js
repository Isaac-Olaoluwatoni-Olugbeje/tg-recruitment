const express = require('express');
const router = express.Router();
const Operator = require('../models/operators');
const Admin = require('../models/admins');
const checkAdmin = require ('../middleware/check_admin');

// Verify operator
router.post('/operator/verify/:operatorId', checkAdmin, async (req, res) => {
    try {
      const { operatorId } = req.params;
      const { adminId, verificationStatus, reason } = req.body;
  
      // Check if operator exists
      const operator = await Operator.getOperatorById (operatorId);
      if (!operator) {
        return res.status(404).json({ error: 'Operator not found' });
      };
  
      // Check if operator is already verified
      const currentStatus = await Operator.checkVerificationStatus (operatorId);
      if (currentStatus === 'approved') {
        return res.status(400).json({ error: 'Operator is already verified' });
      };
  
      // Create a new verification record
      const verification = await Admin.createOperatorVerification(
        operatorId,
        adminId,
        verificationStatus,
        reason,
        new Date()
      );
  
      // Update verification status in the operators table
      await Operator.updateOperatorVerification (operatorId, verificationStatus);

      res.json({ verificationId });
    } catch (error) {
      console.log(error);
      res.status(500).send('An error occurred');
    }
  });

module.exports = router;
  
