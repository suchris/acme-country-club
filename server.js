const { Sequelize, DataTypes, UUID, UUIDV4, STRING } = require('sequelize');

const db = new Sequelize("postgres://localhost/acme-country-club");

const Facility = db.create('facility', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
    },
    fac_name: {
        type: STRING(100),
        unique: true,
        allowNull: false,
    }
});

const Member = db.create('member', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
    },
    first_name: {
        type: STRING(20),
        unique: true,
        allowNull: false,
    }
});

Member.belongsTo(Member, { as: 'sponsor' });

const Booking = db.create('booking', {
    startTime: {
        type: DATE,
        allowNull: false,
    },
    endTime: {
        type: DATE,
        allowNull: false,
    }
});

Member.hasMany(Booking, { as: 'bookedBy' });
Facility.hasMany(Booking);

const syncAndSeed = async () => {
    
}
