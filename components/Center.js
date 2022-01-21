import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import { LogoutIcon } from "@heroicons/react/outline";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-yellow-500",
  "from-purple-500",
  "from-pink-500",
  "from-emerald-500",
  "from-cyan-500",
  "from-teal-500",
  "from-sky-400",
  "from-rose-400",
];

function Center() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => {
        console.log("❌ Spotify Premium is Required to Change Volume");
      });
  }, [spotifyApi, playlistId]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center bg-[#1DB954] space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
          onClick={() => signOut()}
        >
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
            alt="Profile Image"
          />
          <h2 className="">{session?.user.name}</h2>
          <LogoutIcon className="w-4 h-4" />
        </div>
      </header>
      <section
        className={`flex items-end  space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
      >
        <img src={playlist?.images?.[0].url} className="h-44 w-44 shadow-2xl" />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {playlist?.name}
          </h1>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
}

export default Center;
