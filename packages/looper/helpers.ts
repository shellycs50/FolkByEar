// export function extractVideoId(url: string) {
//   const youtubePattern =
//     /^(https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S*?[?&]v=|(?:v|e(?:mbed)?)\/)([a-zA-Z0-9_-]{11}))$/;

//   const match = youtubePattern.exec(url);
//   if (match) {
//     return match[2];
//   } else {
//     return null;
//   }
// }

export function fmtMSS(s: number) {
  return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
}

export function extractVideoId(url: string) {
  const patterns = [
    // https://www.youtube.com/watch?v=VIDEO_ID
    /(?:\?|\&)v=([a-zA-Z0-9_-]{11})/,
    // https://youtu.be/VIDEO_ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    // https://www.youtube.com/shorts/VIDEO_ID
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    // https://www.youtube.com/embed/VIDEO_ID
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    // https://m.youtube.com/watch?v=VIDEO_ID
    /m\.youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}
