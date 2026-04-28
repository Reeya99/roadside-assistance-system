const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { vehicles: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    let vehicleData = null;
    if (user.vehicles.length > 0) {
      const v = user.vehicles[0];
      vehicleData = { make: v.brand, model: v.model, color: v.color, plate: v.vehicleNumber };
    }

    res.json({
      id: user.id, name: user.name, email: user.email, phone: user.phone, profilePic: user.profileImage,
      vehicle: vehicleData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/vehicle', auth, async (req, res) => {
  try {
    const { make, model, color, plate } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, include: { vehicles: true } });
    let vehicle;
    
    if (user.vehicles.length > 0) {
      vehicle = await prisma.vehicle.update({
        where: { id: user.vehicles[0].id },
        data: { brand: make, model, color, vehicleNumber: plate }
      });
    } else {
      vehicle = await prisma.vehicle.create({
        data: {
          userId: req.user.id, brand: make, model, color, vehicleNumber: plate,
          vehicleType: "Car", year: new Date().getFullYear()
        }
      });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
