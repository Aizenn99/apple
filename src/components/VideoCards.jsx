import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";

const VideoCards = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivREf = useRef([]);

  const [LoadedData, setLoadedData] = useState([]);
  const [video, setVideo] = useState({
    isEnd: false,
    startplay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });
  const { isEnd, startplay, isLastVideo, isPlaying, videoId } = video;

  useGSAP(() => {
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none ",
      },
      onComplete: () => {
        setVideo((prevVideo) => ({
          ...prevVideo,
          startplay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    if (LoadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startplay && videoRef.current[videoId].play();
      }
    }
  }, [startplay, isPlaying, videoId, LoadedData]);

  const handelLoadedMetadata = (i,e) => setLoadedData((prevVideo) => [...prevVideo,e] )

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;
    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: ( ) => {
          const progress = Math.ceil(anim.progress() * 100);
          if(progress != currentProgress ){
            currentProgress = progress;
            gsap.to(videoDivREf.current[videoId],{
              width:window.innerWidth < 760 ? '10vw' : window.innerWidth < 1200 ? '10vw' : '4vw'
            })
            gsap.to(span[videoId],{
              width: `${currentProgress}%` ,
              backgroundColor:'white',
            })
          }
        },
        onComplete: () => {},
      });
    }
  }, [videoId, startplay]);

  const handelProcess = (type, i) => {
    switch (type) {
      case "video-end":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isEnd: true,
          videoId: i + 1,
        }));
        break;
      case "video-last":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLastVideo: true,
        }));

        break;
      case "video-reset":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLastVideo: false,
          videoId: 0,
        }));
      case "video-play":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: !isPlaying,
        }));

        break;

      default:
        return video;
    }
  };

  return (
    <>
      <div className="flex items-center ">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black ">
                <video
                  id="video"
                  playsInline={true}
                  preload="auto"
                  muted
                  ref={(el) => (videoRef.current[i] = el)}
                  onPlay={() => {
                    setVideo((prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    }));
                  }}

                  onLoadedMetadata={(e) => handelLoadedMetadata(i,e ) }
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>
              <div className="absolute  top-12 left-[5%] z-10 ">
                {list.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl font-medium  ">
                    {text}{" "}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex-center relative mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              ref={(el) => (videoDivREf.current[i] = el)}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
            
            >
              <span
                className="absolute rounded-full h-full w-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>
        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handelProcess("video-reset")
                : !isPlaying
                ? () => handelProcess("play")
                : () => handelProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCards;
