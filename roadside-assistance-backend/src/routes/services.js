const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    let services = await prisma.service.findMany({ where: { isActive: true } });
    
    if (services.length === 0) {
      const initialServices = [
        { name: "Breakdown Repair", basePrice: 25, description: "Engine diagnostics, Minor repairs, Electrical fixing" },
        { name: "Towing Service", basePrice: 45, description: "24/7 towing, Long distance, Safe handling" },
        { name: "Battery Jump-start", basePrice: 15, description: "Jump-start, Battery check, On-site help" },
        { name: "Flat Tire Repair", basePrice: 20, description: "Tire repair, Spare help, Wheel balance" },
        { name: "Fuel Delivery", basePrice: 18, description: "Fuel delivery, Multiple options, Quick service" }
      ];
      await prisma.service.createMany({ data: initialServices });
      services = await prisma.service.findMany();
    }
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
