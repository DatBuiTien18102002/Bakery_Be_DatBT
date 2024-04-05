const express = require("express");
const router = express.Router();
const userController = require('../controllers/UserController');
const { authMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");

router.post('/sign-up', userController.createUser)
router.post('/sign-in', userController.loginUser)
router.get('/log-out', userController.logoutUser)
router.put('/update-user/:id', authUserMiddleware, userController.updateUser)
router.delete('/delete-user/:id', authMiddleware, userController.deleteUser)
router.delete('/delete-many', authMiddleware, userController.deleteMany)
router.get('/getAll', authMiddleware, userController.getAllUser)
router.get('/get-details/:id', authUserMiddleware, userController.getDetailUser)
router.get('/refresh-token', userController.refreshToken)

module.exports = router;