export default interface iData {
  thread: Thread;
  message?: string;
  error?: string;
}

interface Thread {
  $type: string;
  post: Post;
}

interface Post {
  uri: string;
  cid: string;
  author: Author;
  record: Record;
  embed: Embed;
  replyCount: number;
  repostCount: number;
  likeCount: number;
  quoteCount: number;
}

export interface Author {
  did: string;
  handle: string;
  displayName: string;
}

interface Record {
  $type: string;
  embed: RecordEmbed;
  text: string;
}

interface RecordEmbed {
  $type: string;
  aspectRatio: AspectRatio;
  video: Video;
  media?: Media;
  external: External;
}

interface Video {
  $type: string;
  mimeType: string;
  size: number;
}

interface Media {
  $type: string;
  images: Array<Images>;
}

interface Images {
  aspectRatio: AspectRatio;
  image: {
    mimeType: string;
  };
}

interface External {
  description: string;
  uri: string;
  thumb: {
    mimeType: string;
  };
}

interface Embed {
  $type: string;
  cid: string;
  playlist: string;
  thumbnail: string;
  aspectRatio: AspectRatio;
  mimeType: string;
  media: EmbedMedia;
}

interface EmbedMedia {
  $type: string;
  images: Array<{
    fullsize: string;
    aspectRatio: AspectRatio;
    image: {
      mimeType: string;
    };
  }>;
}

interface AspectRatio {
  height: number;
  width: number;
}
