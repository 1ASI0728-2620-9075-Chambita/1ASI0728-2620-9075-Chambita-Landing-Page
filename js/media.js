const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/** Privacy-friendly YouTube embed URL, or null when the id is missing or malformed. */
export function youtubeEmbedUrl(videoId) {
  return typeof videoId === "string" && YOUTUBE_ID.test(videoId)
    ? `https://www.youtube-nocookie.com/embed/${videoId}`
    : null;
}
