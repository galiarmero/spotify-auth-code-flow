const express = require('express');
const querystring = require('querystring');
const hbs = require('hbs');
const request = require('request');
const config = require('./config.json');
const app = express();

app.set('view engine', 'html');
app.set('views', __dirname + '/public');
app.engine('html', hbs.__express);
app.use(express.static(__dirname + '/public'));

const generateRandomString = function(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

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

app.get('/callback', function(req, res) {
    const error = req.query.error || null;

    if (error !== null) {
        res.render('error', {error});
    }

    const client_credentials = `${config.CLIENT_ID}:${config.CLIENT_SECRET}`
    let requestOptions = {
        form: {
            grant_type: 'authorization_code',
            code: req.query.code,
            redirect_uri: config.REDIRECT_URI
        },
        headers: {
            'Authorization': `Basic ${Buffer.from(client_credentials).toString('base64')}`
        },
        json: true
    }

    request.post('https://accounts.spotify.com/api/token', requestOptions,
        function(err, httpResponse, tokens) {
            if (!err) {
                let options = {
                    headers: {
                        'Authorization': `Bearer ${tokens.access_token}`
                    },
                    json: true
                }
                request.get('https://api.spotify.com/v1/me', options,
                    function(err, httpResponse, profile) {
                        res.render('dashboard', { tokens, profile });
                    }
                );
            }
        }
    );

});

app.listen(8888);

  
