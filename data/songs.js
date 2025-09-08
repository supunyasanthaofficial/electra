// data/songs.js
export const songs = [
  {
    id: "1",
    title: "Dreamscape",
    artist: "Electro Pulse",
    // local file example (put your mp3 in /assets/music/song1.mp3)
    uri: require("../assets/audios/change of scenary-indio downey.mp3"),
    cover: require("../assets/images/change of scenary-indio downey.jpg"), // optional local cover
    coverUri: "https://via.placeholder.com/300", // optional remote cover
    lyrics: `Dreamscape\nI float on neon nights...\n(chorus) Feel the beat...`,
  },
  {
    id: "2",
    title: "Midnight Groove",
    artist: "Neon Beats",
    uri: require("../assets/audios/headspace-indio downey.mp3"),
    cover: require("../assets/images/headspace-indio downey.jpg"),
    coverUri: "https://via.placeholder.com/300",
    lyrics: `Midnight Groove\n...`,
  },
  {
    id: "3",
    title: "Chill Vibes",
    artist: "Lo-Fi Wave",
    // Example remote URI (uncomment to use remote):
    // uri: { uri: "https://example.com/music/song3.mp3" },
    uri: require("../assets/audios/Lisa-solo levelling.mp3"),
    cover: require("../assets/images/Lisa-solo levelling.jpg"), // optional local cover
    coverUri: "https://via.placeholder.com/300",
    lyrics: `Chill Vibes\nLa la...`,
  },
];
