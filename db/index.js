const Sequelize = require("sequelize");
const { STRING } = Sequelize;
const conn = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/acme_people_places_things"
);

const Person = conn.define("person", {
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

const Place = conn.define("place", {
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

const Thing = conn.define("thing", {
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

const Souvenir = conn.define("souvenir");

Souvenir.belongsTo(Person);
Person.hasMany(Souvenir);
Souvenir.belongsTo(Place);
Place.hasMany(Souvenir);
Souvenir.belongsTo(Thing);
Thing.hasMany(Souvenir)

const seeder = async () => {
  console.log("entro seeder");
  await conn.sync({ force: true });
  const [
    moe,
    larry,
    lucy,
    ethyl,
    paris,
    nyc,
    chicago,
    london,
    hat,
    bag,
    shirt,
    cup,
  ] = await Promise.all([
    Person.create({ name: "Moe" }),
    Person.create({ name: "Larry" }),
    Person.create({ name: "Lucy" }),
    Person.create({ name: "Ethyl" }),
    Place.create({ name: "Paris" }),
    Place.create({ name: "NYC" }),
    Place.create({ name: "Chicago" }),
    Place.create({ name: "London" }),
    Thing.create({ name: "Hat" }),
    Thing.create({ name: "Bag" }),
    Thing.create({ name: "Shirt" }),
    Thing.create({ name: "Cup" }),
  ]);

  await Promise.all([
    Souvenir.create({ personId: moe.id, placeId: london.id, thingId: hat.id }),
    Souvenir.create({ personId: moe.id, placeId: paris.id, thingId: bag.id }),
    Souvenir.create({ personId: ethyl.id, placeId: nyc.id, thingId: shirt.id }),
  ]);
};

module.exports = {
  Person,
  Place,
  Thing,
  Souvenir,
  seeder,
};
