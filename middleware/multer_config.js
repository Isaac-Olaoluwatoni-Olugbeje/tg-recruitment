// Import multer
const multer = require('multer');

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        cb(null, Date.now() + '.' + ext);
    }
});

// Set up multer upload object
const upload = multer({ storage: storage });

module.exports = upload;

