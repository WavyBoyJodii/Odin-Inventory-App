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
  console.log('Debug: about to connect to DB');
  await mongoose.connect(mongoDB);
  console.log('should be connected to DB');
  await createGenres();
  await createArtists();
  await createAlbums();
  await createSongs();
  console.log('Debug: closing mongoose');
  mongoose.connection.close();
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
    index: placement,
  };
  if (ft != false) songDetail.ft = ft;
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

async function createArtists() {
  console.log('Creating Artists');
  await Promise.all([
    artistCreate(
      0,
      'Jodii',
      'The Big Wave',
      'https://pbs.twimg.com/profile_images/1483382667148251138/xqYJM1p5_400x400.jpg'
    ),
    artistCreate(
      1,
      'Pink Pantheress',
      'Sonic queen of London',
      'https://pbs.twimg.com/media/F7CZqitWEAAzHrn?format=jpg&name=large'
    ),
    artistCreate(
      2,
      'Ice Spice',
      'The Queen of Drill',
      'https://pbs.twimg.com/profile_images/1687199113417281537/1cgPIk4d_400x400.jpg'
    ),
    artistCreate(
      3,
      'La Demente1212',
      'la para',
      'https://pbs.twimg.com/profile_images/1404573902760820739/kQenABov_400x400.jpg'
    ),
    artistCreate(
      4,
      'Kodone',
      'Art Musik',
      'https://pbs.twimg.com/media/F8A2dCPXAAEdr0J?format=jpg&name=4096x4096'
    ),
  ]);
}

async function createAlbums() {
  console.log('Creating Albums');
  await Promise.all([
    albumCreate(
      0,
      'Aquarius',
      artists[0],
      '2023-11-17',
      [genres[10], genres[1]],
      'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/faa48d2d-12c2-43d1-bf23-b5e99857825b/dcr9w97-7cfa5ce8-7340-41f5-af95-371d17b31ccc.png/v1/fill/w_1024,h_576,q_80,strp/enchanted_blue_by_ellysiumn_dcr9w97-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2ZhYTQ4ZDJkLTEyYzItNDNkMS1iZjIzLWI1ZTk5ODU3ODI1YlwvZGNyOXc5Ny03Y2ZhNWNlOC03MzQwLTQxZjUtYWY5NS0zNzFkMTdiMzFjY2MucG5nIiwiaGVpZ2h0IjoiPD01NzYiLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS53YXRlcm1hcmsiXSwid21rIjp7InBhdGgiOiJcL3dtXC9mYWE0OGQyZC0xMmMyLTQzZDEtYmYyMy1iNWU5OTg1NzgyNWJcL2VsbHlzaXVtbi00LnBuZyIsIm9wYWNpdHkiOjk1LCJwcm9wb3J0aW9ucyI6MC40NSwiZ3Jhdml0eSI6ImNlbnRlciJ9fQ.-526Pk4qhj3b8zWbULm7e408mwhbZB_LjrsuNsw0YFw'
    ),
    albumCreate(
      1,
      'Enchanted',
      artists[1],
      '2023-11-17',
      genres[10],
      'https://pbs.twimg.com/media/F09ApFIX0AAkb8g?format=jpg&name=large'
    ),
    albumCreate(
      2,
      'La Demente',
      artists[3],
      '2022-06-04',
      [genres[9], genres[8]],
      'https://scontent-lga3-2.xx.fbcdn.net/v/t39.30808-6/240970950_110646738008315_2187678936101932744_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=f7d594&_nc_ohc=5TiDgV2HaLoAX8WaOYz&_nc_ht=scontent-lga3-2.xx&oh=00_AfA_u9B69vSTBIWRalBy__K03-tjAcM2hpID_13EMUwXDA&oe=652B4029'
    ),
    albumCreate(
      3,
      'Libertad y Patria',
      artists[3],
      '2023-06-19',
      [genres[9], genres[8]],
      'https://scontent-lga3-1.xx.fbcdn.net/v/t39.30808-6/241712125_116998304030337_5962955496786860413_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=5614bc&_nc_ohc=m44oLh_pDDQAX8swJCW&_nc_ht=scontent-lga3-1.xx&oh=00_AfAafVgTURlUjqIgzAgBGrmNpGMGLH82-AEMDYv2wjd1ZQ&oe=652B6695'
    ),
    albumCreate(
      4,
      'Kodone World',
      artists[4],
      '2019-08-15',
      genres[1],
      'https://pbs.twimg.com/media/F7h_R69WIAAscBk?format=jpg&name=4096x4096'
    ),
  ]);
}

async function createSongs() {
  console.log('Adding songs to albums');
  await Promise.all([
    songCreate(0, 'Rip', artists[1], albums[1], false, false, 1),
    songCreate(1, 'I found U', artists[1], albums[1], false, false, 2),
    songCreate(2, 'loved b4', artists[1], albums[1], artists[0], false, 3),
    songCreate(3, 'Psych0', artists[1], albums[1], false, false, 4),
    songCreate(
      4,
      'Through My Eyes',
      artists[1],
      albums[1],
      false,
      'https://pbs.twimg.com/media/F7MHju-WcAEpLGc?format=jpg&name=large',
      5
    ),
    songCreate(5, 'FaceCard', artists[0], albums[0], false, false, 1),
    songCreate(6, 'OG', artists[0], albums[0], false, false, 2),
    songCreate(7, 'wawawa', artists[3], albums[3], false, false, 1),
    songCreate(8, 'amor en tiempo', artists[3], albums[3], false, false, 2),
    songCreate(
      9,
      'Bandidas',
      artists[3],
      albums[3],
      [artists[1], artists[2]],
      false,
      1
    ),
    songCreate(
      10,
      'Keep it To Yourself',
      artists[4],
      albums[4],
      false,
      false,
      1
    ),
  ]);
}
