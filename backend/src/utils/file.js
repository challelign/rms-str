const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uploadDir = "./public/uploads";
		if (!fs.existsSync("./public")) {
			fs.mkdirSync("./public");
		}
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir);
		}
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({ storage: storage }).array("files");

const deleteFile = (fileName) => {
	const filePath = path.join("./public/uploads", fileName);
	fs.unlink(filePath, (err) => {
		if (err) {
			console.error("Error deleting file: ", err);
		} else {
			console.log("File deleted successfully");
		}
	});
};

module.exports = {
	upload,
	deleteFile,
};
