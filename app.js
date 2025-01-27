require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
var bodyParser = require("body-parser");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

//Registering the partials
hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );
// Our routes go here:

app.get("/", (req, res) => {
  spotifyApi
    .getAvailableGenreSeeds()
    .then((data) => {
      res.render("home", { genres: data.body.genres });
    })
    .catch((err) => console.log("The error while listing genres: ", err));
});

app.get("/artist-search", (req, res) => {
  const { artistName } = req.query;

  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", { artist: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  const { artistId } = req.params;

  // .getArtistAlbums() code goes here
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      res.render("albums", { albums: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

app.get("/tracks/:albumId", (req, res) => {
  const { albumId } = req.params;

  spotifyApi.getAlbumTracks(albumId).then((data) => {
    res.render("tracks", { tracks: data.body.items });
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
