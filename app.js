require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const recipeRoutes = require('./routes/recipe-routes');
const usersRoutes = require('./routes/users-routes');
const favoriteRoutes = require('./routes/favorites-routes');
const HttpError = require('./models/http-error');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Recipe API',
            description: 'Recipe API Information',
            contact: {
                name: 'jwebster'
            },
            servers: [process.env.SERVER_URL]
        },
        securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                scheme: 'bearer',
                in: 'header'
            }
        }
    },
    apis: ['./routes/*.js'],
};

if (process.env.NODE_ENV === 'development') {
    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocs)
    );
}


app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

app.use('/api/recipes', recipeRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/favorites', favoriteRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dnlkt.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true })
    .then(() => {
        app.listen(process.env.PORT || 5000);
        console.log('database connected!')
    })
    .catch(err => {
        console.log(err);
    });