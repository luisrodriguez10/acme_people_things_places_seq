const { Person, Place, Thing, Souvenir, seeder } = require("./db/index");
const express = require("express");
const app = express();

app.use('/assets', express.static('assets'))
app.use(express.urlencoded({extended : false}))
app.use(require('method-override')('_method'))

app.get('/', async(req, res, next) => {
    try {
        const people = await Person.findAll()
        const places = await Place.findAll()
        const things = await Thing.findAll()
        const souvenirs = await Souvenir.findAll({
            include: [Person, Place, Thing]
        })

        res.send(`
            <html>
                <head>
                    <title>Acme People, Places and Things</title>
                    <link rel='stylesheet' href='/assets/styles.css' />
                </head>
                <body>
                    <h1>Acme People, Places and Things</h1>
                    <h2><a href='/souvenirs/add'>Create New Souvenirs</a></h2>
                    <h2>People</h2>
                    <ul>
                        ${people.map(person => `
                            <li>
                                ${person.name}
                            </li>
                        `).join('')}
                    </ul>
                    <h2>Places</h2>
                    <ul>
                        ${places.map(place => `
                            <li>
                                ${place.name}
                            </li>
                        `).join('')}
                    </ul>
                    <h2>Things</h2>
                    <ul>
                        ${things.map(thing => `
                            <li>
                                ${thing.name}
                            </li>
                        `).join('')}
                    </ul>
                    <h2>Souvenirs</h2>
                    <ul>
                        ${souvenirs.map(souvenir => `
                            <li>
                                ${souvenir.person.name} purchased a ${souvenir.thing.name} in ${souvenir.place.name}
                            </li>
                            <form method='POST' action='/souvenirs/${souvenir.id}?_method=DELETE'>
                                <button>X</button>
                            </form>
                        `).join('')}
                    </ul>
                </body>
            </html>
        `);
    } catch (ex) {
        next(ex)
    }
})

app.get('/souvenirs/add', async(req, res, next) => {

    try {

        const people = await Person.findAll()
        const places = await Place.findAll()
        const things = await Thing.findAll()

        res.send(`
            <html>
                <head>
                    <title>Create New Souvenirs</title>
                    <link rel='stylesheet' href='/assets/styles.css' />
                </head>
                <body>
                    <h1>Create New Souvenirs</h1>
                    <p>Create a new Souvenir Purchase by selecting a Person, the Place they purchased the souvenir, and the Thing they bought.</p>
                    <form id='add-souvenir' method='POST' action='/souvenirs/add'>
                        <select name='personId'>
                            ${people.map(person =>`
                                <option value='${person.id}'>
                                    ${person.name}
                                </option>
                            `).join('')}
                        </select>
                        <select name='placeId'>
                            ${places.map(place =>`
                                <option value='${place.id}'>
                                    ${place.name}
                                </option>
                            `).join('')}
                        </select>
                        <select name='thingId'>
                            ${things.map(thing =>`
                                <option value='${thing.id}'>
                                    ${thing.name}
                                </option>
                            `).join('')}
                        </select>
                        <button>Create Souvenir</button>
                    </form>
                    <a href='/'>Return to Main Page</a>
                </body>
            </html>
        `);
    } catch (ex) {
        next(ex)
    }
})

app.post('/souvenirs/add', async(req, res, next) => {
    try {
        await Souvenir.create(req.body)
        res.redirect('/')
    } catch (ex) {
        next(ex)
    }
})

app.delete('/souvenirs/:id', async(req, res, next) => {
    try {
        const souvenir = await Souvenir.findByPk(req.params.id)
        await souvenir.destroy()
        res.redirect('/')
    } catch (ex) {
        next(ex)
    }
})

const setup = async () => {
  try {
    console.log("server setup");
    await seeder();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (ex) {
    console.log(ex);
  }
};

console.log('calling setup')
setup();
