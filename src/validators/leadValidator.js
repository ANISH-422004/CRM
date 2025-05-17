const { body, param, validationResult } = require('express-validator');

exports.validateLead = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('company').notEmpty().withMessage('Company is required'),
  body('status')
    .isIn(['NEW', 'CONTACTED', 'CONVERTED'])
    .withMessage('Status must be NEW, CONTACTED, or CONVERTED'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  }
];

exports.validateUUID = [
  param('id').isUUID().withMessage('Invalid UUID'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  }
];
