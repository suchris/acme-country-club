const express = require('express');
const app = express();
const morgan = require('morgan');

const {
  db, Sequelize, syncAndSeed, models: { Facility, Member, Booking }
} = require('./db');

const port = process.env.PORT || 3000;

const init = async () => {
  await syncAndSeed();
  app.listen(port, () => console.log(`listening on ${port}`));
}

init();

app.get('/api/facilities', async (req, res, next) => {
  try {
    const allFacilities = await Facility.findAll({
      include: [
        {
          model: Booking,
        },
      ],
    });
    res.send(allFacilities);
  } catch (err) {
    next(err);
  }
});

app.get('/api/bookings', async (req, res, next) => {
  try {
    const allBookings = await Booking.findAll({
      include: [
        {
          model: Facility,
        },
        {
          model: Member,
          as: 'bookedBy',
        },
      ],
    });
    res.send(allBookings);
  } catch (err) {
    next(err);
  }
});

app.get('/api/members', async (req, res, next) => {
  try {
    const allMembers = await Member.findAll({
      include: [
        {
          model: Member,
          as: 'sponsor',
        },
        {
          model: Member,
        },
      ],
    });
    res.send(allMembers);
  } catch (err) {
    next(err);
  }
});
