const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', auth, async (req, res) => {
  try {
    const { serviceName, location, description } = req.body;
    
    let service = await prisma.service.findFirst({ where: { name: serviceName } });
    if (!service) return res.status(400).json({ error: 'Invalid service selected.' });
    
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, include: { vehicles: true } });
    if (!user.vehicles || user.vehicles.length === 0) {
       return res.status(400).json({ error: 'Please update your vehicle info in your profile first.' });
    }

    const request = await prisma.serviceRequest.create({
      data: {
        userId: req.user.id,
        serviceId: service.id,
        vehicleId: user.vehicles[0].id,
        pickupLocation: { address: location },
        description,
        status: "requested"
      }
    });
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const requests = await prisma.serviceRequest.findMany({
      where: { userId: req.user.id },
      include: {
        service: true,
        mechanic: { include: { user: true } },
        review: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
