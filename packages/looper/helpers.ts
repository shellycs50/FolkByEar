export function extractVideoId(url: string) {
  const youtubePattern =
    /^(https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S*?[?&]v=|(?:v|e(?:mbed)?)\/)([a-zA-Z0-9_-]{11}))$/;

  const match = youtubePattern.exec(url);
  if (match) {
    return match[2];
  } else {
    return null;
  }
}

export function fmtMSS(s: number) {
  return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
}
