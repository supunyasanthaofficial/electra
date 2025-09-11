// import { supabase } from "../utils/supabaseClient";

// export async function fetchSongs() {
//   try {
//     const { data, error } = await supabase
//       .from("songs")
//       .select("*")
//       .order("id", { ascending: true });

//     if (error) {
//       console.error("Error fetching songs:", error);
//       return [];
//     }

//     return data.map((song) => ({
//       id: song.id,
//       title: song.title,
//       artist: song.artist,
//       uri: { uri: song.uri },
//       cover: song.cover ? { uri: song.cover } : null,
//       lyrics: song.lyrics || "",
//       downloadUri: song.uri,
//     }));
//   } catch (err) {
//     console.error("Fetch songs error:", err);
//     return [];
//   }
// }
import { supabase } from "../utils/supabaseClient";

export const fetchSongs = async () => {
  try {
    console.log("Fetching songs from Supabase...");

    const { data, error, count } = await supabase
      .from("songs")
      .select("*", { count: "exact" })
      .order("title");

    if (error) {
      console.error("Supabase error details:", error);
      throw error;
    }

    console.log("Raw data from Supabase:", data);
    console.log("Number of songs found:", count);
    console.log("Songs fetched successfully:", data?.length);

    return data || [];
  } catch (error) {
    console.error("Error in fetchSongs:", error);
    throw error;
  }
};
