import Exception from "./Exception";
import type iData from "./interface/iData";
import type iParams from "./interface/iParams";

export enum Type {
  VIDEO = "app.bsky.embed.video",
  GIF = "app.bsky.embed.external",
  IMAGE = "app.bsky.embed.images",
  IMAGE_VIEW = "app.bsky.embed.images.view",
  MEDIA = "app.bsky.embed.recordWithMedia#view",
  IMAGES_VIEW = "app.bsky.embed.images#view"
}

const errors: Record<string, string> = {
  InternalServerError: "that Blueet doesn't exist",
  NotFound: "that Blueet or handle doesn't exist",
};

export default async function getBlueet({
  handle,
  rkey,
}: iParams): Promise<iData> {
  const response = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=at://${handle}/app.bsky.feed.post/${rkey}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data: iData = await response.json();

  if (data.error) {
    console.debug('getBlueet -> ', data);
    throw new Exception(
      String(errors[String(data.message)] ?? "Unknown error")
    );
  }

  return data;
}
