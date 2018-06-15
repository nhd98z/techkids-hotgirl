const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const imageController = require("./controller");
const authMiddleware = require("../auth/auth");

router.get("/", (req, res) => {
  imageController
    .getAllImages(req.query.page || 1)
    .then(images => res.send(images))
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.get("/:imageId", (req, res) => {
  imageController
    .getImage(req.params.imageId)
    .then(image => res.send(image))
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.get("/:imageId/data", (req, res) => {
  imageController
    .getImageData(req.params.imageId)
    .then(data => {
      res.contentType(data.contentType);
      res.send(data.image);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.post(
  "/",
  authMiddleware.authorize,
  upload.single("image"),
  (req, res) => {
    req.body.userId = req.session.userInfo.id;
    req.body.imageFile = req.file;

    imageController
      .createImage(req.body)
      .then(result => res.send(result))
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  }
);

router.delete("/:id", authMiddleware.authorize, (req, res) => {
  imageController
    .deleteImage(req.params.id, req.session.userInfo.id)
    .then(image => res.send(image))
    .catch(error => {
      console.error(error);
      res.status(error.status).send(error.err);
    });
});

router.post("/:imageId/comments", authMiddleware.authorize, (req, res) => {
  req.body.userId = req.session.userInfo.id;

  imageController
    .addComment(req.params.imageId, req.body)
    .then(result => res.send(result))
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.delete(
  "/:imageId/comments/:commentId",
  authMiddleware.authorize,
  (req, res) => {
    imageController
      .deleteComment(
        req.params.imageId,
        req.params.commentId,
        req.session.userInfo.id
      )
      .then(result => res.send(result))
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  }
);

router.post("/:imageId/like", authMiddleware.authorize, (req, res) => {
  imageController
    .likeImage(req.params.imageId)
    .then(result => res.send(result))
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.delete("/:imageId/like", authMiddleware.authorize, (req, res) => {
  imageController
    .unlikeImage(req.params.imageId)
    .then(result => res.send(result))
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

module.exports = router;
