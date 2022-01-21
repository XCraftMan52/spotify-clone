import {
  RewindIcon,
  SwitchHorizontalIcon,
  FastForwardIcon,
  ReplyIcon,
  PauseIcon,
  PlayIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilStateLoadable } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        // console.log("Now Playing:", data.body?.item?.name);
        setCurrentIdTrack(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };
  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause().catch((err) => {
          console.log("❌ Spotify Premium is Required to Pause");
        });
        setIsPlaying(false);
      } else {
        spotifyApi.play().catch((err) => {
          console.log("❌ Spotify Premium is Required to Play");
        });
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackIdState, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume]);
  const debounceAdjustVolume = useCallback(
    debounce(
      (volume) =>
        spotifyApi.setVolume(volume).catch((err) => {
          console.log("❌ Spotify Premium is Required to Change Volume");
        }),
      300
    ),
    []
  );

  return (
    <div className="h-24 bg-gray-800 text-white grid grid-cols-3 md:text-base px-2 md:px-8">
      {/* Left */}
      <div className="flex items-center space-x-4 ">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      {/* Center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
        <RewindIcon
          className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
          onClick={() =>
            spotifyApi.skipToPrevious().catch((err) => {
              console.log("❌ Spotify Premium is Required to Rewind Tracks");
            })
          }
        />

        {isPlaying ? (
          <PauseIcon
            className="h-10 w-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
            onClick={handlePlayPause}
          />
        ) : (
          <PauseIcon
            className="h-10 w-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
            onClick={handlePlayPause}
          />
        )}

        <FastForwardIcon
          className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
          onClick={() =>
            spotifyApi.skipToNext().catch((err) => {
              console.log("❌ Spotify Premium is Required to Skip Tracks");
            })
          }
        />
        <ReplyIcon className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
      </div>
      {/* Right */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <VolumeUpIcon
          className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
          onClick={() => volume > 0 && setVolume(volume + 10)}
        />
      </div>
    </div>
  );
}

export default Player;
