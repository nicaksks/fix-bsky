import type { Request, Response } from "express";
import type iParams from "./interface/iParams";
import getBlueet, { Type } from "./getBlueet";
import Exception from "./Exception";
import download from "./download";

function embed(req: Request, res: Response): void {
  const { t, u } = req.query;
  res.status(200).json({
    author_name: decodeURIComponent(t?.toString() ?? ""),
    author_url: decodeURIComponent(u?.toString() ?? ""),
    provider_name: "Bluesky Social",
    provider_url: "https://github.com/nicaksks/fix-bsky",
    title: "Bluesky",
    type: "link",
    version: "1.0",
  });
}

async function profile(req: Request, res: Response): Promise<void> {
  try {
    const data = await getBlueet(req.params as unknown as iParams);

    const post = data.thread.post;
    const embed = post.record.embed;

    const originalURL = `https://bsky.app/profile/${req.params.handle}/post/${req.params.rkey}`;
    const text = `💬 ${post.replyCount} 🔁 ${post.repostCount} ❤️ ${post.likeCount} \n\n${post.record.text}`;

    // < -- BLUEET (?) -- >
    const blueet = {
      originalURL,
      text,
      cid: post.embed.cid,
      embed: `https://${req.hostname}/embed?t=${encodeURIComponent(
        text
      )}&u=${encodeURIComponent(originalURL)}`,
      author: {
        handle: post.author.handle,
        displayName: post.author.displayName,
      },
    };

    // < -- IMAGE -- >
    if (embed.$type === Type.IMAGE || embed.$type === Type.IMAGE_VIEW) {
      return res.status(200).redirect(originalURL);
    }

    // < -- RT WITH IMAGE -- >
    if (
      post.embed.$type === Type.MEDIA &&
      post.embed.media.$type === Type.IMAGES_VIEW
    ) {
      return res.status(200).render("image", {
        ...blueet,
        media: {
          mimeType: embed.media?.images[0].image.mimeType,
          url: post.embed.media.images[0].fullsize,
          width: post.embed.media.images[0].aspectRatio.width,
          height: post.embed.media.images[0].aspectRatio.height,
        },
      });
    }

    // < -- GIF -- >
    if (embed.$type === Type.GIF || embed.media?.$type === Type.GIF) {
      return res.status(200).render("gif", {
        ...blueet,
        media: {
          mimeType: "image/gif",
          url: embed.external.uri,
        },
      });
    }

    // < -- VIDEO -- >
    if (embed.$type === Type.VIDEO) {
      download(post.embed.playlist, post.embed.cid);
      return res.status(200).render("video", {
        ...blueet,
        media: {
          mimeType: embed.video.mimeType,
          width: embed.aspectRatio.width,
          height: embed.aspectRatio.height,
          thumbnail: post.embed.thumbnail,
          url: post.embed.playlist,
        },
        videoURL: `https://${req.hostname}/video/${post.embed.cid}.mp4`,
      });
    }

    return res.status(200).redirect(originalURL);
  } catch (error: unknown) {
    if (error instanceof Exception) {
      return res.render("error", { error });
    }
    res.render("error", { error: { message: "Unknown error" } });
  }
}

export default {
  embed,
  profile,
  notFound: (_: Request, res: Response): void =>
    res.status(200).redirect("https://github.com/nicaksks/fix-bsky"),
};
