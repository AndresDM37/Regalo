import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { songs, type Song } from "./data/songs";
import "./App.css";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong: Song = songs[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSongIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    setVolume(percentage);
    if (audioRef.current) {
      audioRef.current.volume = percentage;
    }
    setIsMuted(percentage === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.volume = volume || 0.5;
      }
    } else {
      setIsMuted(true);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }
  };

  const playSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const nextSong = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    playSong(nextIndex);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen p-8 flex flex-col items-center bg-dots">
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        onEnded={nextSong}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPause={handlePause}
        onPlay={handlePlay}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 mt-4"
      >
        <h1 className="text-5xl font-serif text-pink-400 mb-1 font-semibold">
          Nuestra Melodía
        </h1>
        <p className="text-xs tracking-[0.3em] text-gray-400 uppercase font-medium">
          LADO A — 2026
        </p>
      </motion.div>

      <div className="relative mb-14 flex justify-center items-center">
        <motion.div
          animate={{ rotate: isPlaying ? 15 : 0 }}
          transition={{ type: "spring", stiffness: 60 }}
          className="absolute -top-10 right-4 w-32 h-24 pointer-events-none z-10"
        >
          <div className="absolute top-0 right-0 w-8 h-8 rounded-full border-4 border-gray-300" />
          <div className="absolute top-4 right-4 w-24 h-1 bg-gray-300 origin-top-right transform -rotate-[35deg]" />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSongIndex}
            initial={{ scale: 0.8, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotate: 20 }}
            transition={{ type: "spring", damping: 15 }}
            className="z-0"
          >
            <div
              className={`w-64 h-64 rounded-full vinyl-record flex items-center justify-center border-[12px] border-[#222] ${isPlaying ? "animate-spin-slow" : "paused"}`}
              style={{
                background: `radial-gradient(circle, ${currentSong.coverColor || "#333"} 0%, #111 60%, ${currentSong.coverColor || "#333"} 100%)`,
              }}
            >
              <div className="record-center shadow-inner">
                <span className="text-[6px] tracking-tighter">SONANDO</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="text-center mb-6 px-4 w-full max-w-md">
        <motion.div
          key={`${currentSongIndex}-title`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-2"
        >
          <h2 className="text-3xl font-bold text-gray-700 mb-2">
            {currentSong.title}
          </h2>
          <p className="text-pink-400 font-medium">{currentSong.artist}</p>
        </motion.div>

        <motion.div
          key={`${currentSongIndex}-progress`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div
            className="h-1.5 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
            onClick={handleSeek}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-pink-300 to-pink-400 rounded-full"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          className="flex items-center gap-3 mb-6 px-4"
        >
          <motion.button
            onClick={toggleMute}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-400 hover:text-pink-400 transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            )}
          </motion.button>
          <div
            className="h-1.5 bg-gray-200 rounded-full cursor-pointer overflow-hidden w-24"
            onClick={handleVolumeChange}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-pink-300 to-pink-400 rounded-full"
              initial={{ width: "100%" }}
              animate={{ width: `${isMuted ? 0 : volume * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>

        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={togglePlay}
            className="px-8 py-2 border border-pink-200 rounded-full text-[10px] text-gray-500 uppercase tracking-[0.2em] bg-white/50 hover:bg-pink-50 transition-colors shadow-sm cursor-pointer"
          >
            {isPlaying ? "PAUSA" : "REPRODUCIR"}
          </button>
          <button
            onClick={nextSong}
            className="px-8 py-2 border border-pink-200 rounded-full text-[10px] text-gray-500 uppercase tracking-[0.2em] bg-white/50 hover:bg-pink-50 transition-colors shadow-sm cursor-pointer"
          >
            SIGUIENTE
          </button>
        </div>
      </div>

      <div className="playlist-container w-full max-w-sm">
        <div className="flex justify-between items-center mb-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
          <span>Lista de Reproducción</span>
        </div>

        <div className="space-y-4">
          {songs.map((song, index) => (
            <motion.div
              key={song.id}
              onClick={() => playSong(index)}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center p-4 cursor-pointer transition-all duration-300 rounded-xl ${index === currentSongIndex ? "active-song" : "opacity-70 hover:opacity-100"}`}
            >
              <span
                className={`text-[10px] font-mono w-10 ${index === currentSongIndex ? "text-pink-300" : "text-gray-300"}`}
              >
                {song.id}
              </span>
              <div className="flex flex-col">
                <span
                  className={`text-sm font-semibold tracking-wide ${index === currentSongIndex ? "text-gray-800" : "text-gray-500"}`}
                >
                  {song.title}
                </span>
                <span className="text-[11px] text-gray-400 font-medium">
                  {song.artist}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-gray-200/50 px-4 py-1 rounded-full text-[10px] text-gray-500 italic">
        "Algún lugar que solo nosotros conocemos"
      </div>
    </div>
  );
}

export default App;
