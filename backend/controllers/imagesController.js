// controllers/imagesController.js
import Image from "../models/Image.js";
import User from "../models/User.js";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const uploadsDir = path.join(process.cwd(), "public", "uploads");

function extFromMime(mime) {
  if (!mime) return "jpg";
  const map = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  return map[mime] || mime.split("/").pop() || "jpg";
}

export async function uploadImage(req, res) {
  try {
    const { image, mimeType } = req.body;
    if (!image) return res.status(400).json({ message: "Image required." });

    // get userName from req.user (set by middleware). If not present, try DB fallback.
    const userId = req.user?.id;
    let userName = req.user?.name;
    if (!userName && userId) {
      const u = await User.findById(userId).lean();
      userName = u ? u.name : "Unknown";
    }
    if (!userName) userName = "Unknown";

    // parse data URL or raw base64
    const matches =
      typeof image === "string" ? image.match(/^data:(.+);base64,(.+)$/) : null;
    let base64Data, mime;
    if (matches) {
      mime = matches[1];
      base64Data = matches[2];
    } else {
      base64Data = image;
      mime = mimeType || "image/jpeg";
    }

    if (!base64Data)
      return res.status(400).json({ message: "Invalid image data." });

    // ensure uploads dir
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext = extFromMime(mime);
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
    const filepath = path.join(uploadsDir, filename);

    const buffer = Buffer.from(base64Data, "base64");
    await fs.writeFile(filepath, buffer);

    const publicPath = `/uploads/${filename}`;

    // save DB record
    const imgDoc = await Image.create({
      user: userId || null,
      name: userName,
      path: publicPath,
      mimeType: mime,
    });

    const payload = {
      id: imgDoc._id,
      user: imgDoc.user,
      name: imgDoc.name,
      path: imgDoc.path,
      mimeType: imgDoc.mimeType,
      createdAt: imgDoc.createdAt,
    };

    const io = req.app.get("io");
    if (io) io.emit("new_image", payload);

    return res.json({ message: "Image saved and emitted.", image: payload });
  } catch (err) {
    console.error("uploadImage error:", err);
    return res
      .status(500)
      .json({ message: "Server error while uploading image." });
  }
}
