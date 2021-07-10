const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const Product = require("../../Models/Product");
const checkAuth = require("../../middleware/check-auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

//fetch all products
router.get("/", (req, res, next) => {
  Product.find()
    .select("name productImage price _id size description")
    .exec()
    .then((docs) => {
      const resposne = {
        count: docs.length,
        product: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            size: doc.size,
            description: doc.description,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: "GET",
              url: "http:localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(resposne);
    })
    .catch((error) => {
      res.status(500).json({
        message: error,
      });
    });
});

//create product
router.post(
  "/",
  checkAuth,
  upload.array("productImage", 5),
  (req, res, next) => {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.files.map((img) => {
        return img.path;
      }),
      size: req.body.size,
      description: req.body.description,
    });
    product
      .save()
      .then((result) => {
        res.status(200).json({
          message: "Sending Post request",
          Details: result,
        });
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  }
);

//fetch product with id special
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({ result });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
});

//update product by id
router.patch("/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId;

  const updateOps = {};

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});

//delete product with a id
router.delete("/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((docs) => {
      res.status(200).json({
        message: "product is deleted",
        id: id,
        result: docs,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: error,
      });
    });
});

module.exports = router;
