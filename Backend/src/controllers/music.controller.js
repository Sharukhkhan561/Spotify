const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const jwt = require("jsonwebtoken");
const { uploadFile } = require("../services/storage.service");

async function createMusic(req, res) {
  const { title } = req.body;
  const file = req.file;

  const result = await uploadFile(file.buffer.toString("base64"));

  const music = await musicModel.create({
    uri: result.url,
    title,
    artist: req.user.id,
  });
  res.status(201).json({
    message: "Music created successfully",
    music: {
      id: music._id,
      uri: music.uri,
      title: music.title,
      artist: music.artist,
    },
  });
}

async function createAlbum(req, res) {
  const { title, musics } = req.body;
  const album = await albumModel.create({
    title,
    artist: req.user.id,
    musics: musics,
  });
  res.status(201).json({
    message: "Album Created Successfully",
    album: {
      id: album._id,
      title: album.title,
      artist: album.artist,
      musics: album.musics,
    },
  });
}

async function getAllMusics(req, res) {
  const musics = await musicModel.find().populate("artist");

  res.status(201).json({
    message: "Music fetch successfully",
    musics: musics,
  });
}

async function getAllAlbums(req, res) {
  const albums = await albumModel
    .find()
    .populate("artist", "userName email")
    .populate("musics");
  res.status(200).json({
    message: "Album fetch successfully",
    albums: albums,
  });
}

async function getAlbumById(req, res) {
  const albumId = req.params.albumId;

  const album = await await albumModel
    .findById(albumId)
    .populate("artist", "userName email")
    .populate("musics");

  return res.status(200).json({
    message: "Album Fetched Successfully",
    album: album,
  });
}
module.exports = {
  createMusic,
  createAlbum,
  getAllMusics,
  getAllAlbums,
  getAlbumById,
};
