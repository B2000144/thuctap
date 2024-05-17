const jwt = require("jsonwebtoken");
const middlewareController = {
  verityToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1]; // bỏ khoảng trắng và lấy từ kí tự số 1
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(403).json("token is not valid");
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(403).json("you are not authenticated");
    }
  },
  verifyTokenAndAdminAuth: (req, res, next) => {
    // nếu là người dùng thì có quyền xóa tk của mình admin = true có quyền xóa mọi tk
    middlewareController.verityToken(req, res, () => {
      if (req.user.id == req.params.id || req.user.admin) {
        next();
      } else {
        res.status(403).json("you are not allowed to delete other");
      }
    });
  },
};
module.exports = middlewareController;
