var express = require('express');
var router = express.Router();
const {
   getUserData,
   getAllCustomers,
   updateUserRole,
   deleteUser,
   getUserStats,
} = require('../services/user.service');

router.get('/stats', async (req, res) => {
   let respones = await getUserStats();
   res.json(respones);
});

router.get('/customers', async (req, res) => {
   let respones = await getAllCustomers();
   res.json(respones);
});

router.get('/get-user', async (req, res) => {
   let username = req?.username;
   let respones = await getUserData(username);
   res.json(respones);
});

router.put('/update-role', async (req, res) => {
   const body = req.body.params;
   let respones = await updateUserRole(body);
   res.json(respones);
});
router.put('/', async (req, res) => {
   const body = req.body.params;
   let respones = await deleteUser(body);
   res.json(respones);
});
module.exports = router;
