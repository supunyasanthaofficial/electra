import { useState, useEffect } from "react";
import { fetchSongs } from "./fetchSongs";

export const useSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSongs = async () => {
    try {
      setLoading(true);
      setError(null);
      const songsData = await fetchSongs();
      setSongs(songsData);
    } catch (err) {
      setError(err.message);
      console.error("Failed to load songs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const refetch = () => {
    loadSongs();
  };

  return { songs, loading, error, refetch };
};
