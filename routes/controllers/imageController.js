const fs = require("fs");
const pool = require("../config/db");
const sharp = require("sharp");
const { updateCloudinaryImage, isCloudinaryUrl, extractPublicIdFromUrl, deleteFromCloudinary } = require("../utils/cloudinary");

exports.uploadAvatar = async (req, res) => {
    try {
        const userId = req.user.accountId;
        if (!req.file) return res.status(400).json({ message: "Không có file được tải lên" });

        // Lấy avatar cũ
        const resultOld = await pool.query(
            'SELECT "avatar" FROM account WHERE "accountId" = $1',
            [userId]
        );
        const oldUrl = resultOld.rows[0]?.avatar;

        // Resize ảnh về 300x400 (buffer)
        const resizedBuffer = await sharp(req.file.buffer)
            .resize(300, 400)
            .png()
            .toBuffer();

        // Upload lên Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = require("streamifier").createReadStream(resizedBuffer)
                .pipe(require("cloudinary").v2.uploader.upload_stream(
                    { folder: "avatars" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                ));
        });

        // Xóa avatar cũ nếu là Cloudinary
        if (oldUrl && isCloudinaryUrl(oldUrl)) {
            const publicId = extractPublicIdFromUrl(oldUrl);
            if (publicId) await deleteFromCloudinary(publicId);
        }

        // Cập nhật DB
        await pool.query('UPDATE account SET "avatar" = $1 WHERE "accountId" = $2', [result.secure_url, userId]);

        res.status(200).json({ message: "Cập nhật avatar thành công", avatarUrl: result.secure_url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi upload avatar", error: err.message });
    }
};

// Upload cover
exports.uploadCover = async (req, res) => {
    try {
        const { novelId } = req.body;
        if (!novelId) return res.status(400).json({ message: "Thiếu novelId" });
        if (!req.file) return res.status(400).json({ message: "Không có file được tải lên" });

        // Lấy ảnh cũ
        const resultOld = await pool.query(
            'SELECT "novel_img_url" FROM novel_info WHERE "novelId" = $1',
            [novelId]
        );
        const oldUrl = resultOld.rows[0]?.novel_img_url;

        // Resize ảnh về 300x400
        const resizedBuffer = await sharp(req.file.buffer)
            .resize(300, 400)
            .png()
            .toBuffer();

        // Upload lên Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = require("streamifier").createReadStream(resizedBuffer)
                .pipe(require("cloudinary").v2.uploader.upload_stream(
                    { folder: "novel_covers" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                ));
        });

        // Xóa ảnh cũ nếu là Cloudinary
        if (oldUrl && isCloudinaryUrl(oldUrl)) {
            const publicId = extractPublicIdFromUrl(oldUrl);
            if (publicId) await deleteFromCloudinary(publicId);
        }

        // Cập nhật DB
        await pool.query('UPDATE novel_info SET "novel_img_url" = $1 WHERE "novelId" = $2', [result.secure_url, novelId]);

        res.status(200).json({ message: "Cập nhật ảnh bìa thành công", coverUrl: result.secure_url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi upload cover", error: err.message });
    }
};