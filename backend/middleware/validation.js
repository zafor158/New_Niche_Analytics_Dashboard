const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('username')
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-30 characters and contain only letters, numbers, and underscores'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('First name must be less than 50 characters'),
  body('lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Last name must be less than 50 characters'),
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Book validation
const validateBook = [
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('isbn')
    .optional()
    .isLength({ max: 20 })
    .withMessage('ISBN must be less than 20 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('publishedAt')
    .optional()
    .isISO8601()
    .withMessage('Published date must be a valid date'),
  handleValidationErrors
];

// Sale validation
const validateSale = [
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid date'),
  body('units')
    .isInt({ min: 0 })
    .withMessage('Units must be a non-negative integer'),
  body('revenue')
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Revenue must be a valid decimal number'),
  body('royalty')
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Royalty must be a valid decimal number'),
  body('platform')
    .isLength({ min: 1, max: 100 })
    .withMessage('Platform must be between 1 and 100 characters'),
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateBook,
  validateSale,
  handleValidationErrors
};
