import React, { useEffect } from "react";
import "./App.css";
import Login from "./Login";
import { getTokenFromUrl } from "./spotify";
import SpotifyWebApi from "spotify-web-api-js";
import Player from "./Player";
import { useDataLayerValue } from "./DataLayer";

const spotify = new SpotifyWebApi();

function App() {
    const [{ token }, dispatch] = useDataLayerValue();

    useEffect(() => {
        const hash = getTokenFromUrl();
        const _token = hash.access_token;

        window.location.hash = "";

        if (_token) {
            dispatch({
                type: "SET_TOKEN",
                token: _token,
            });

            spotify.setAccessToken(_token);

            console.log("I have a token", _token);
            spotify.getMe().then((user) => {
                dispatch({
                    type: "SET_USER",
                    user: user,
                });
            });

            spotify.getUserPlaylists().then((playlists) => {
                dispatch({
                    type: "SET_PLAYLISTS",
                    playlists: playlists,
                });
            });

            spotify.getPlaylist("37i9dQZF1DX186v583rmzp").then((response) => {
                dispatch({
                    type: "SET_DISCOVER_WEEKLY",
                    discover_weekly: response,
                });
            });
        }
    }, [dispatch]);

    return <div className="app">{token ? <Player spotify={spotify} /> : <Login />}</div>;
}

export default App;
