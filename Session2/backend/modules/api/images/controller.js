const imageModel = require("./model");
const fs = require("fs");

const createImage = ({
    title,
    description,
    userId,
    imageFile
  }) =>
  new Promise((resolve, reject) => {
    imageModel
      .create({
        image: fs.readFileSync(imageFile.path),
        contentType: imageFile.mimetype,
        title,
        description,
        createdBy: userId
      })
      .then(data => resolve({
        id: data._id
      }))
      .catch(err => reject(err));
  });

const getAllImages = page =>
  new Promise((resolve, reject) => {
    imageModel
      .find({
        active: true
      })
      .sort({
        createdAt: -1
      })
      .skip((page - 1) * 20)
      .limit(20)
      .select("_id title description createdAt view like")
      .populate("createdBy", "username avatarUrl")
      .exec()
      .then(data => {
        resolve(
          data.map(img =>
            Object.assign({}, img._doc, {
              imageUrl: `/api/images/${img._id}/data`
            })
          )
        );
      })
      .catch(err => reject(err));
  });

const updateImage = (id, {
    imageFile,
    title,
    description
  }) =>
  new Promise((resolve, reject) => {
    imageModel
      .update({
        _id: id
      }, {
        image: fs.readFileSync(imageFile.path),
        contentType: imageFile.mimetype,
        title,
        description
      })
      .then(data => resolve({
        id: data._id
      }))
      .catch(err => reject(err));
  });

const deleteImage = (id, userId) =>
  new Promise((resolve, reject) => {
    imageModel
      .update({
        _id: id,
        createdBy: userId
      }, {
        active: false
      })
      .then(data => resolve({
        id: data
      }))
      .catch(err => reject({
        status: 500,
        err
      }));
  });

const getImage = id =>
  new Promise((resolve, reject) => {
    imageModel
      .update({
        active: true,
        _id: id
      }, {
        $inc: {
          view: 1
        }
      })
      .then(result =>
        imageModel
        .findOne({
          active: true,
          _id: id
        })
        .select("_id title description createdAt view like comment")
        .populate("comment.createdBy", "username avatarUrl")
        .populate("createdBy", "username avatarUrl")
        .exec()
      )
      .then(data =>
        resolve(
          Object.assign({}, data._doc, {
            imageUrl: `/api/images/${id}/data`
          })
        )
      )
      .catch(err => reject(err));
  });

const getImageData = id =>
  new Promise((resolve, reject) => {
    imageModel
      .findOne({
        active: true,
        _id: id
      })
      .select("image contentType")
      .exec()
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const addComment = (imageId, {
    userId,
    content
  }) =>
  new Promise((resolve, reject) => {
    imageModel
      .update({
        _id: imageId
      }, {
        $push: {
          comment: {
            createdBy: userId,
            content
          }
        }
      })
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const deleteComment = (imageId, commentId, userId) =>
  new Promise((resolve, reject) => {
    imageModel
      .update({
        _id: imageId
      }, {
        $pull: {
          comment: {
            _id: commentId,
            createdBy: userId
          }
        }
      })
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const likeImage = imageId =>
  new Promise((resolve, reject) => {
    imageModel
      .update({
        _id: imageId
      }, {
        $inc: {
          like: 1
        }
      })
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const unlikeImage = imageId =>
  new Promise((resolve, reject) => {
    imageModel
      .update({
        _id: imageId
      }, {
        $inc: {
          like: -1
        }
      })
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

module.exports = {
  createImage,
  getAllImages,
  getImage,
  updateImage,
  deleteImage,
  addComment,
  deleteComment,
  likeImage,
  unlikeImage,
  getImageData
};