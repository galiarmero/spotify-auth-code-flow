# spotify-auth-code-flow
Bare-bones Spotify authorization demo using OAuth 2.0 Authorization Code Flow

## How to run

### Registering to Spotify
First, register an application in [Spotify for Developers](https://beta.developer.spotify.com). See the [guide](https://beta.developer.spotify.com/documentation/general/guides/app-settings/#register-your-app).

Upon registration, Spotify will generate a **client ID** and **client secret**. These will serve as the credentials of this demo in order to use Spotify as an authorization server. Enter these two values in `config.json`:

    {
        "CLIENT_ID": "<enter client_id>",
        "CLIENT_SECRET": "<enter client_secret>",
        "REDIRECT_URI": "http://localhost:8888/callback"
    }

### Installing needed packages

If using **yarn**, simply run:
    
    $ yarn

For **npm**:

    $ npm install

### Running the demo

    $ node app.js


## Understanding the code

**Authorization Code Flow** is one way of obtaining an **access token**, which is required to make requests to [Spotify Web API](https://beta.developer.spotify.com/documentation/web-api/). It follows a three-step procedure:

1. Application (i.e. this demo) requests authorization from the user who logs in to Spotify. If granted, Spotify returns an **authorization code** to the application.
2. Application uses the **authorization code** to request **access token** and **refresh token** to Spotify, which will then return the requested values.
3. Application uses the **access token** to make requests to Spotify Web API, which, in turn, will return requested data such as user info, songs, playlists, albums, etc.

Since the **access token** expires over a given period, there could be a fourth step here:

4. Application requests for a new **access token** by passing the **refresh token** (it's like a key for a locker that contains the key for your main door. get it?).

For more info, see [Authorization Guide](https://beta.developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow).