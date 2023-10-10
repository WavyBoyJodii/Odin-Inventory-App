require('dotenv').config();
const mongoUrl = process.env.MONGO_URL;

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

const Album = require('./models/album');
const Artist = require('./models/artist');
const Genre = require('./models/genre');
const Song = require('./models/song');

const albums = [];
const artists = [];
const genres = [];
const songs = [];

// connect to mongoDb with mongoose
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = mongoUrl;
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

async function genreCreate(index, name) {
  const genre = new Genre({ name: name });
  await genre.save();
  genres[index] = genre;
  console.log(`Added genre: ${name}`);
}

async function artistCreate(index, name, bio, picture) {
  const artistDetail = { name: name, bio: bio };
  if (picture != false) artistDetail.picture = picture;

  const artist = new Artist(artistDetail);

  await artist.save();

  artists[index] = artist;
  console.log(`Added artist ${name}`);
}

async function albumCreate(index, title, artist, release_date, genre, art) {
  const albumDetail = {
    title: title,
    artist: artist,
    release_date: release_date,
  };
  if (genre != false) albumDetail.genre = genre;
  if (art != false) albumDetail.art = art;

  const album = new Album(albumDetail);
  await album.save();

  albums[index] = album;
  console.log(`Added album ${title}`);
}

async function songCreate(index, title, artist, album, ft, art, placement) {
  const songDetail = {
    title: title,
    artist: artist,
    album: album,
    ft: ft,
    index: placement,
  };
  if (art != false) songDetail.art = art;

  const song = new Song(songDetail);
  await song.save();

  songs[index] = song;
  console.log(`Added new song ${title}`);
}

async function createGenres() {
  console.log('Creating Genres');
  await Promise.all([
    genreCreate(0, 'Hip Hop'),
    genreCreate(1, 'Trap'),
    genreCreate(2, 'R&B'),
    genreCreate(3, 'Pop'),
    genreCreate(4, 'Jazz'),
    genreCreate(5, 'Country'),
    genreCreate(6, 'Dance'),
    genreCreate(7, 'Hyper Pop'),
    genreCreate(8, 'Reggaeton'),
    genreCreate(9, 'Dembow'),
    genreCreate(10, 'Liquid Dnb'),
  ]);
}
