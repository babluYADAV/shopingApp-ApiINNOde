const http = require('http');
const app = require('./App')
const port = process.env.PORT || 3000;


const server = http.createServer(app);


server.listen(port, () => {
    console.log('server is running on port ' + port)
});

//  https://gentle-everglades-52420.herokuapp.com/ deployed to Heroku
// /c/Program\ Files/Heroku/bin/heroku login
// heroku create
// git push heroku master