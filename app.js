const express = require('express');
const querystring = require('querystring');
const config = require('./config.json')
const app = express();

const generateRandomString = function(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

app.use(express.static(__dirname + '/public'));

app.get('/login', function(req, res) {
    const scope = 'user-read-private user-read-email';
    let state = generateRandomString(16);

    res.redirect('https://accounts.spotify.com/authorize?' +
                    querystring.stringify({
                        client_id: config.CLIENT_ID,
                        response_type: 'code',
                        redirect_uri: config.REDIRECT_URI,
                        state: state,
                        scope: scope,
                        show_dialog: true
                    }));
});

app.listen(8888);

  
