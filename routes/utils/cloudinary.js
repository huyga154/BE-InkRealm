const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload ảnh lên Cloudinary
 */
async function uploadToCloudinary(filePath, folder = "uploads") {
    try {
        const result = await cloudinary.uploader.upload(filePath, { folder });
        return result; // chứa secure_url, public_id, ...
    } catch (error) {
        throw new Error("Cloudinary upload failed: " + error.message);
    }
}

/**
 * Xóa ảnh trên Cloudinary theo public_id
 */
async function deleteFromCloudinary(publicId) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result === "ok") {
            return true;
        } else {
            console.warn("Không thể xóa ảnh:", result);
            return false;
        }
    } catch (error) {
        console.error("Cloudinary delete failed:", error);
        throw new Error("Cloudinary delete failed: " + error.message);
    }
}

/**
 * Cập nhật ảnh:
 * - Nếu oldUrl là ảnh Cloudinary → xóa ảnh cũ.
 * - Upload ảnh mới và trả về result.
 */
async function updateCloudinaryImage(filePath, oldUrl = null, folder = "uploads") {
    try {
        // Nếu có oldUrl và là ảnh Cloudinary, thì xóa trước
        if (oldUrl && isCloudinaryUrl(oldUrl)) {
            const publicId = extractPublicIdFromUrl(oldUrl);
            if (publicId) {
                await deleteFromCloudinary(publicId);
            }
        }

        // Upload ảnh mới
        const newImage = await uploadToCloudinary(filePath, folder);
        return newImage;
    } catch (error) {
        throw new Error("Cloudinary update failed: " + error.message);
    }
}

/**
 * Kiểm tra xem URL có phải của Cloudinary không
 */
function isCloudinaryUrl(url) {
    return url && url.includes("res.cloudinary.com");
}

/**
 * Trích xuất public_id từ URL Cloudinary
 * vd: https://res.cloudinary.com/df71oqzk8/image/upload/v173987/test_abc.jpg
 * -> trả về: test_abc
 */
function extractPublicIdFromUrl(url) {
    try {
        const parts = url.split("/");
        const uploadIndex = parts.indexOf("upload");
        if (uploadIndex !== -1) {
            const publicPath = parts.slice(uploadIndex + 2).join("/"); // bỏ v173987
            const fileName = publicPath.replace(/\.[^/.]+$/, ""); // bỏ .jpg
            return fileName;
        }
        return null;
    } catch (error) {
        console.error("Extract publicId failed:", error);
        return null;
    }
}

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
    updateCloudinaryImage,
    isCloudinaryUrl,
    extractPublicIdFromUrl,
};
