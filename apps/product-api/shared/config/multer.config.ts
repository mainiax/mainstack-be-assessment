import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp/");
  },
});
const multerUpload = multer({ storage: storage });

export default multerUpload;
