export interface Song {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverColor?: string;
}

export const songs: Song[] = [
  {
    id: "01",
    title: "You Rock My World",
    artist: "Michael Jackson",
    audioUrl: "/audio/Michael Jackson - You Rock My World.mp3",
    coverColor: "#f5e6d3",
  },
  {
    id: "02",
    title: "The Way You Make Me Feel",
    artist: "Michael Jackson",
    audioUrl: "/audio/The Way You Make Me Feel.mp3",
    coverColor: "#fce4ec",
  },
  {
    id: "03",
    title: "Una y Otra Vez",
    artist: "Manuel Medrano",
    audioUrl: "/audio/Manuel Medrano - Una y Otra Vez.mp3",
    coverColor: "#fff9c4",
  },
  {
    id: "04",
    title: "Lo Mejor Que Hay En Mi Vida",
    artist: "Andrés Cepeda",
    audioUrl: "/audio/Andrés Cepeda - Lo mejor que hay en mi vida.mp3",
    coverColor: "#e3f2fd",
  },
];
