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
const CLIENT_CREDENTIALS = `${config.CLIENT_ID}:${config.CLIENT_SECRET}`;
const CLIENT_AUTHORIZATION = Buffer.from(CLIENT_CREDENTIALS).toString('base64');

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

    let requestOptions = {
        form: {
            grant_type: 'authorization_code',
            code: req.query.code,
            redirect_uri: config.REDIRECT_URI
        },
        headers: {
            'Authorization': `Basic ${CLIENT_AUTHORIZATION}`
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

app.get('/refresh_token', function(req, res) {
    const refresh_token = req.query.refresh_token || null;

    if (refresh_token === null) {
        res.status(400).send("Missing refresh token");
    }

    let requestOptions = {
        form: {
            grant_type: 'refresh_token',
            refresh_token
        },
        headers: {
            'Authorization': `Basic ${CLIENT_AUTHORIZATION}`
        },
        json: true
    }

    request.post('https://accounts.spotify.com/api/token', requestOptions,
        function(err, httpResponse, tokens) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(tokens);
        }
    );
});

app.listen(8888);

  
