const { Sequelize, DataTypes, UUID, UUIDV4, STRING } = require('sequelize');

const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme-country-club');

const Facility = db.define('facility', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  fac_name: {
    type: STRING(100),
    unique: true,
    allowNull: false,
  },
});

const Member = db.define('member', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  first_name: {
    type: STRING(20),
    unique: true,
    allowNull: false,
  },
});

const Booking = db.define('booking', {
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

Member.belongsTo(Member, { as: 'sponsor' });
Member.hasMany(Member, { foreignKey: 'sponsorId' });

Booking.belongsTo(Member, { as: 'bookedBy' });
Member.hasMany(Booking, { foreignKey: 'bookedById' });

Booking.belongsTo(Facility);
Facility.hasMany(Booking);

const syncAndSeed = async () => {
  await db.sync({ force: true });
  // facility seed data
  const tennisCourt = await Facility.create({
    fac_name: 'Tennis Court',
  });
  const basketballCourt = await Facility.create({
    fac_name: 'Basketball Count',
  });
  const swimmingPool = await Facility.create({
    fac_name: 'Swimming Pool',
  });

  //member seed data
  const [chris, arjan, lucy] = await Promise.all(
    ['chris', 'arjan', 'lucy'].map((member) =>
      Member.create({
        first_name: member,
      })
    )
  );

  const [chrisbooking, arjanbooking, lucybooking] = await Promise.all([
    Booking.create({
      startTime: '09/01/2020 08:00:00',
      endTime: '09/01/2020 12:00:00',
      bookedById: chris.id,
      facilityId: tennisCourt.id,
    }),
    Booking.create({
      startTime: '09/03/2020 12:00:00',
      endTime: '09/03/2020 14:00:00',
      bookedById: arjan.id,
      facilityId: swimmingPool.id,
    }),
    Booking.create({
      startTime: '09/05/2020 15:00:00',
      endTime: '09/05/2020 17:00:00',
      bookedById: lucy.id,
      facilityId: basketballCourt.id,
    }),
  ]);

  arjan.sponsorId = chris.id;
  arjan.save();
  chris.sponsorId = chris.id;
  chris.save();
  lucy.sponsorId = chris.id;
  lucy.save();
};

module.exports = {
    db, Sequelize, syncAndSeed, models: { Facility, Member, Booking}
}