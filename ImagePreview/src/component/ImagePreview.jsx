import { useEffect, useState } from "react";
import { socket } from "../socketlogic/socket.js";
import { GrClose } from "react-icons/gr";
import "./ImagePreview.css";
import bgImage from "../images/d2.jpg";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const EMOJIS = {
  grin:       "😀",
  heart_eyes: "😍",
  fire:       "🔥",
  thumbsup:   "👍",
  heart:      "❤️",
  beaming:    "😁",
  kiss:       "😘",
};

const ImagePreview = () => {
  const [userName,  setUserName]  = useState("");
  const [userImage, setUserImage] = useState("");
  const [showCard,  setShowCard]  = useState(false);
  const [reactions, setReactions] = useState([]);
  const [connected, setConnected] = useState(false);

  const closeImage = () => {
    setShowCard(false);
    setUserName("");
    setUserImage("");
    socket.emit("image_closed");
  };

  useEffect(() => {
    const onConnect = () => {
      console.log("Device 2 socket connected:", socket.id);
      setConnected(true);
      socket.emit("register", "display");
    };

    const onDisconnect = () => setConnected(false);

    const onNewImage = (data) => {
      console.log("new_image received:", data);
      const { name, path } = data || {};
      setUserName(name || "User");
      if (path) setUserImage(`${SERVER_URL}${path}`);
      setShowCard(true);
    };

    const onEmojiReaction = (data) => {
      const emoji = EMOJIS[data.emojiId] || data.emoji || "🔥";
      const r = {
        id:       Date.now() + Math.random(),
        emoji,
        left:     Math.random() * 78 + 5,
        size:     Math.random() * 24 + 35,
        duration: 2500 + Math.random() * 1500,
      };
      setReactions((prev) => [...prev, r]);
      setTimeout(() => {
        setReactions((prev) => prev.filter((x) => x.id !== r.id));
      }, r.duration);
    };

    socket.on("connect",        onConnect);
    socket.on("disconnect",     onDisconnect);
    socket.on("new_image",      onNewImage);
    socket.on("emoji_reaction", onEmojiReaction);

    if (socket.connected) {
      setConnected(true);
      socket.emit("register", "display");
    }

    return () => {
      socket.off("connect",        onConnect);
      socket.off("disconnect",     onDisconnect);
      socket.off("new_image",      onNewImage);
      socket.off("emoji_reaction", onEmojiReaction);
    };
  }, []);

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      
            <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background:           showCard ? "rgba(0,0,0,0.40)" : "rgba(0,0,0,0.65)",
          backdropFilter:       showCard ? "blur(10px) saturate(140%)" : "blur(2px)",
          WebkitBackdropFilter: showCard ? "blur(10px) saturate(140%)" : "blur(2px)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-120 h-120 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-120 h-120 rounded-full bg-pink-600/20 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-310 top-200 w-120 h-120 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute top-180 left-300 w-120 h-120 rounded-full bg-pink-600/20 blur-3xl" />
      </div>

      <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
        <span className="text-[11px] text-slate-300">
          {connected ? "Connected" : "Disconnected"}
        </span>
        <span className={connected ? "status-dot status-connected" : "status-dot status-disconnected"} />
      </div>

      {!showCard && (
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-2 border-white/50" />
            <div className="absolute inset-0 rounded-full border-t-2 border-pink-400 animate-spin drop-shadow-lg" />
            <div className="absolute inset-2 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.75 3h16.5M5.25 3v18M18.75 3v18" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold h-15 bg-linear-to-r from-[#12b7aa] via-[#57d4ea] to-[#16d495] bg-clip-text text-transparent">
              Waiting for photo…
            </h2>
            <p className="animate-pulse text-white/80 text-xl mt-1">
              We Are Collecting Your Image
            </p>
          </div>
        </div>
      )}

      {/* ── Image card ────────────────────────────────────────────────────── */}
      {showCard && (
        <div className="relative z-10 w-full flex flex-col items-center px-4">

          <h1 className="text-4xl font-bold mb-6 h-15 text-center bg-linear-to-r from-[#598fc9] via-[#cf3232] to-[#d91892] bg-clip-text text-transparent drop-shadow-lg">
            Welcome, {userName}!
          </h1>

          {/* Card with glass effect */}
          <div
            className="relative w-full max-w-2xl rounded-3xl p-4 flex flex-col items-center gap-4 overflow-hidden border border-white/25"
            style={{
              background:           "rgba(255, 255, 255, 0.08)",
              backdropFilter:       "blur(28px) saturate(180%) brightness(1.1)",
              WebkitBackdropFilter: "blur(28px) saturate(180%) brightness(1.1)",
              boxShadow:            "0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
          >
            {/* Close button */}
            <button
              onClick={closeImage}
              className="absolute top-3 right-3 z-20
                         w-9 h-9 flex items-center justify-center
                         bg-red-500/80 hover:bg-red-500 text-white
                         rounded-full transition-colors duration-150
                         shadow-lg shadow-red-500/30"
              title="Close"
            >
              <GrClose className="text-base" />
            </button>

            {/* Photo */}
            {userImage && (
              <div className="w-full overflow-hidden rounded-2xl border border-white/15 shadow-2xl">
                <img
                  src={userImage}
                  alt={userName}
                  className="w-full object-cover"
                  style={{ maxHeight: "65vh" }}
                />
              </div>
            )}

            {/* Floating emoji reactions */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
              {reactions.map((r) => (
                <div
                  key={r.id}
                  style={{
                    position:   "absolute",
                    left:       `${r.left}%`,
                    bottom:     16,
                    fontSize:   `${r.size}px`,
                    animation:  `floatUp ${r.duration}ms linear forwards`,
                    zIndex:     50,
                    textShadow: "0 4px 12px rgba(0,0,0,0.5)",
                  }}
                >
                  {r.emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;