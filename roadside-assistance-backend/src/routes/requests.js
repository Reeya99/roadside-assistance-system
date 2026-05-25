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

// GET all active requests created by OTHER users (broadcasting)
router.get('/active', auth, async (req, res) => {
  try {
    const activeRequests = await prisma.serviceRequest.findMany({
      where: {
        status: "requested",
        userId: { not: req.user.id }
      },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profileImage: true,
            vehicles: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(activeRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET the logged-in user's own current active request status (polling)
router.get('/current-active', auth, async (req, res) => {
  try {
    const currentRequest = await prisma.serviceRequest.findFirst({
      where: {
        userId: req.user.id,
        status: { in: ["requested", "accepted", "on_the_way", "arrived"] }
      },
      include: {
        service: true,
        mechanic: { include: { user: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(currentRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT to accept an active request
router.put('/:id/accept', auth, async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.id;

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { user: true }
    });

    if (!serviceRequest) {
      return res.status(404).json({ error: 'Service request not found.' });
    }

    if (serviceRequest.status !== 'requested') {
      return res.status(400).json({ error: 'This request has already been accepted or handled.' });
    }

    if (serviceRequest.userId === userId) {
      return res.status(400).json({ error: 'You cannot accept your own service request.' });
    }

    // Find or create a mechanic profile for the accepting user
    let mechanic = await prisma.mechanic.findUnique({
      where: { userId }
    });

    if (!mechanic) {
      mechanic = await prisma.mechanic.create({
        data: {
          userId,
          isVerified: true,
          experience: 3,
          isAvailable: false,
          rating: 4.8
        }
      });
    }

    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        status: 'accepted',
        mechanicId: mechanic.id
      },
      include: {
        service: true,
        user: true,
        mechanic: { include: { user: true } }
      }
    });

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET the mechanic's currently active job
router.get('/current-job', auth, async (req, res) => {
  try {
    const mechanic = await prisma.mechanic.findUnique({
      where: { userId: req.user.id }
    });

    if (!mechanic) {
      return res.json(null);
    }

    const activeJob = await prisma.serviceRequest.findFirst({
      where: {
        mechanicId: mechanic.id,
        status: { in: ["accepted", "on_the_way", "arrived"] }
      },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profileImage: true,
            vehicles: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json(activeJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT to update request status (mechanic progression)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;

    const validStatuses = ["accepted", "on_the_way", "arrived", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { mechanic: true }
    });

    if (!serviceRequest) {
      return res.status(404).json({ error: 'Service request not found.' });
    }

    if (!serviceRequest.mechanic || serviceRequest.mechanic.userId !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to update this service request status.' });
    }

    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: { status },
      include: {
        service: true,
        user: true,
        mechanic: { include: { user: true } }
      }
    });

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST to create a review for a completed service request
router.post('/:id/review', auth, async (req, res) => {
  try {
    const requestId = req.params.id;
    const { rating, comment } = req.body;

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { review: true }
    });

    if (!serviceRequest) {
      return res.status(404).json({ error: 'Service request not found.' });
    }

    if (serviceRequest.userId !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to review this service request.' });
    }

    if (serviceRequest.status !== 'completed') {
      return res.status(400).json({ error: 'You can only review completed service requests.' });
    }

    if (serviceRequest.review) {
      return res.status(400).json({ error: 'You have already reviewed this service request.' });
    }

    if (!serviceRequest.mechanicId) {
      return res.status(400).json({ error: 'This request was never assigned to a mechanic.' });
    }

    // Create the review record
    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        mechanicId: serviceRequest.mechanicId,
        requestId: requestId,
        rating: parseInt(rating),
        comment
      }
    });

    // Recalculate average rating for the mechanic
    const mechanicReviews = await prisma.review.findMany({
      where: { mechanicId: serviceRequest.mechanicId }
    });

    const averageRating = mechanicReviews.reduce((sum, r) => sum + r.rating, 0) / mechanicReviews.length;

    await prisma.mechanic.update({
      where: { id: serviceRequest.mechanicId },
      data: { rating: averageRating }
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
