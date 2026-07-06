/* ============================================================
   CONFIG.JS
   ------------------------------------------------------------
   Everything you are likely to want to change lives in this
   one file: names, the letter text, your memories, and the
   paths to your photos/audio/video.

   You do NOT need to touch index.html, style.css or main.js
   to personalize the site — just edit the values below.

   See README.md for the full guide (image sizes, audio/video
   formats, how to preview locally, how to publish it).
   ============================================================ */

const CONFIG = {

  // ----------------------------------------------------------
  // 1. THE TWO OF YOU
  // ----------------------------------------------------------
  names: {
    from: "Bikash",     // you
    to: "Ruma"          // her name — shown throughout the letter
  },

  // Envelope screen (the very first thing she sees)
  envelope: {
    toLine: "Ruma",                 // "To: ___"
    fromLine: "Bikash",             // "From: ___"
    openHint: "tap the seal to open"
  },

  // ----------------------------------------------------------
  // 2. THE LETTER
  // ----------------------------------------------------------
  letter: {
    greeting: "Dear Ruma,",
    // Each string in this array becomes its own paragraph.
    // Write however long or short you like — the page flows
    // naturally with 1 paragraph or 5.
    paragraphs: [
      "I've rewritten this line more times than I can count, so I'll just say it plainly: knowing you has been one of the best parts of my life.",
      "This little page is my attempt to put some of that into something you can actually hold onto — a few pictures, a song, a video, and one very important question waiting for you at the end.",
      "Take your time scrolling. There's no rush. I just wanted you to have this."
    ],
    signature: "Yours,"   // appears above the "from" name near the question
  },

  // ----------------------------------------------------------
  // 3. OUR STORY — a short, dated timeline of memories
  //    Add, remove, or reorder entries freely.
  // ----------------------------------------------------------
  sectionTitles: {
    story: "Our story so far",
    listen: "A song for you",
    watch: "Something I recorded",
    gallery: "A few more moments",
    question: "One more thing…"
  },

  memories: [
    {
      image: "assets/images/memory-1.svg",
      date: "Where it started",
      caption: "Replace this with the story of how we met."
    },
    {
      image: "assets/images/memory-2.svg",
      date: "A favorite day",
      caption: "Swap in a photo and caption from a day you both remember."
    },
    {
      image: "assets/images/memory-3.svg",
      date: "Something silly",
      caption: "The inside joke, the ridiculous trip, the thing that still makes you laugh."
    },
    {
      image: "assets/images/memory-4.svg",
      date: "Right now",
      caption: "And this — the moment you're reading this page."
    }
  ],

  // ----------------------------------------------------------
  // 4. AUDIO — "a song for you"
  // ----------------------------------------------------------
  audio: {
    src: "assets/audio/our-song.mp3",
    title: "Our song",
    subtitle: "Replace with the track that reminds you of her"
  },

  // ----------------------------------------------------------
  // 5. VIDEO — a personal recorded message
  // ----------------------------------------------------------
  video: {
    src: "assets/video/message.mp4",
    poster: "assets/images/video-poster.jpg",
    caption: "A little something I recorded for you."
  },

  // ----------------------------------------------------------
  // 6. GALLERY — a scattered collage of extra photos
  // ----------------------------------------------------------
  gallery: [
    { image: "assets/images/gallery-1.svg", caption: "Caption one" },
    { image: "assets/images/gallery-2.svg", caption: "Caption two" },
    { image: "assets/images/gallery-3.svg", caption: "Caption three" },
    { image: "assets/images/gallery-4.svg", caption: "Caption four" },
    { image: "assets/images/gallery-5.svg", caption: "Caption five" },
    { image: "assets/images/gallery-6.svg", caption: "Caption six" }
  ],

  // ----------------------------------------------------------
  // 7. THE QUESTION
  // ----------------------------------------------------------
  question: {
    heading: "Ruma, will you be mine?",
    subtext: "Press the seal to answer.",
    yesLabel: "Yes",
    noLabel: "Not yet",
    // Shown one after another each time "Not yet" is dodged/pressed.
    // Feel free to add more lines, or leave just one.
    noTeasingLines: [
      "hey, come back here",
      "are you sure?",
      "really sure?",
      "last chance to change your mind...",
      "okay, okay, I'll stop running"
    ]
  },

  // ----------------------------------------------------------
  // 8. CELEBRATION SCREEN — shown after she presses "Yes"
  // ----------------------------------------------------------
  celebration: {
    heading: "She said yes!",
    message: "Thank you for making me the happiest. I can't wait for everything that's next, together.",
    signature: "Forever yours, Bikash"
  }

};
    
