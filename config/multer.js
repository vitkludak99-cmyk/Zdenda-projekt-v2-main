const multer = require('multer');
const { extname } = require('path');

// Extrakce hodnot do konstant pro snazší úpravy v budoucnu
const UPLOAD_DIR = 'public/uploads/';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const VALID_TYPES = /jpeg|jpg|png|webp/i;

const diskStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  
  filename(req, file, cb) {
    const timestamp = Date.now();
    const randomHash = Math.floor(Math.random() * 1e9);
    const extension = extname(file.originalname);
    
    // Použití template literálu místo sčítání řetězců
    cb(null, `${timestamp}-${randomHash}${extension}`);
  }
});

function validateImage(req, file, cb) {
  const isExtValid = VALID_TYPES.test(extname(file.originalname));
  const isMimeValid = VALID_TYPES.test(file.mimetype);

  if (isExtValid && isMimeValid) {
    return cb(null, true);
  } 
  
  return cb(new Error('Povoleny jsou pouze obrázky (jpg, png, webp)'));
}

const uploadMiddleware = multer({
  storage: diskStorage,
  fileFilter: validateImage,
  limits: { 
    fileSize: MAX_FILE_SIZE 
  }
});

module.exports = uploadMiddleware;