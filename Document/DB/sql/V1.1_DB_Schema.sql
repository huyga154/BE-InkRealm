-- Disable foreign key checks tạm thời
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname='public') LOOP
            EXECUTE 'DROP TABLE IF EXISTS "' || r.tablename || '" CASCADE';
        END LOOP;
END $$;


-- TABLE: account
CREATE TABLE "account" (
                           "accountId" SERIAL PRIMARY KEY,
                           "username" VARCHAR(255) UNIQUE NOT NULL,
                           "password" VARCHAR(255) NOT NULL,
                           "fullName" VARCHAR(255),
                           "avatar" TEXT NOT NULL,
                           "coin" INTEGER DEFAULT 0
);

-- TABLE: novel_info
CREATE TABLE "novel_info" (
                              "novelId" SERIAL PRIMARY KEY,
                              "novelTitle" VARCHAR(255) UNIQUE NOT NULL,
                              "novelDescription" TEXT,
                              "createDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              "author" VARCHAR(255) NOT NULL
);

-- TABLE: chapter_status
CREATE TABLE "chapter_status" (
                                  "chapterStatusId" SERIAL PRIMARY KEY,
                                  "chapterStatusCode" VARCHAR(255),
                                  "chapterStatusDescription" TEXT
);

-- TABLE: chapter
CREATE TABLE "chapter" (
                           "chapterId" SERIAL PRIMARY KEY,
                           "chapterIndex" REAL,
                           "chapterTitle" VARCHAR(255) NOT NULL,
                           "createDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           "updateDate" TIMESTAMP,
                           "chapterText" TEXT,
                           "chapterStatusId" INTEGER,
                           "novelId" INTEGER NOT NULL,
                           CONSTRAINT fk_chapter_status FOREIGN KEY("chapterStatusId") REFERENCES "chapter_status"("chapterStatusId") ON DELETE SET NULL,
                           CONSTRAINT fk_chapter_novel FOREIGN KEY("novelId") REFERENCES "novel_info"("novelId") ON DELETE CASCADE
);

-- TABLE: uploader (N-N between account and novel)
CREATE TABLE "uploader" (
                            "accountId" INTEGER NOT NULL,
                            "novelId" INTEGER NOT NULL,
                            PRIMARY KEY("accountId", "novelId"),
                            CONSTRAINT fk_uploader_account FOREIGN KEY("accountId") REFERENCES "account"("accountId") ON DELETE CASCADE,
                            CONSTRAINT fk_uploader_novel FOREIGN KEY("novelId") REFERENCES "novel_info"("novelId") ON DELETE CASCADE
);

-- TABLE: transaction_history
CREATE TABLE "transaction_history" (
                                       "transactionId" SERIAL PRIMARY KEY,
                                       "accountId" INTEGER NOT NULL,
                                       "dats" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       "transaction_data" TEXT,
                                       "coin_change" INTEGER,
                                       CONSTRAINT fk_transaction_account FOREIGN KEY("accountId") REFERENCES "account"("accountId") ON DELETE CASCADE
);

-- TABLE: genre
CREATE TABLE "genre" (
                         "genreId" SERIAL PRIMARY KEY,
                         "genreName" VARCHAR(255) UNIQUE NOT NULL,
                         "genreDescription" TEXT
);

-- TABLE: novel_genre (N-N between novel and genre)
CREATE TABLE "novel_genre" (
                               "novelId" INTEGER NOT NULL,
                               "genreId" INTEGER NOT NULL,
                               PRIMARY KEY("novelId", "genreId"),
                               CONSTRAINT fk_novel_genre_novel FOREIGN KEY("novelId") REFERENCES "novel_info"("novelId") ON DELETE CASCADE,
                               CONSTRAINT fk_novel_genre_genre FOREIGN KEY("genreId") REFERENCES "genre"("genreId") ON DELETE CASCADE
);

-- Index cho novelId (lọc theo tiểu thuyết)
CREATE INDEX idx_chapter_novelId ON "chapter"("novelId");

-- Index cho chapterIndex (sắp xếp chương)
CREATE INDEX idx_chapter_chapterIndex ON "chapter"("chapterIndex");

-- Composite index để tối ưu query: WHERE novelId = ? ORDER BY chapterIndex
CREATE INDEX idx_chapter_novel_chapterIndex ON "chapter"("novelId", "chapterIndex");

----------------------------------------------
-- =========================================
-- 🧩 1. Thêm cột "price" vào bảng chapter
-- =========================================
ALTER TABLE "chapter"
    ADD COLUMN IF NOT EXISTS "price" INTEGER DEFAULT 0 CHECK ("price" >= 0);

-- =========================================
-- 💰 2. Bảng lưu thông tin mua chương
-- =========================================
CREATE TABLE IF NOT EXISTS "chapter_purchase" (
                                                  "accountId" INTEGER NOT NULL,
                                                  "chapterId" INTEGER NOT NULL,
                                                  "purchaseDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                  "transactionId" INTEGER,
                                                  PRIMARY KEY ("accountId", "chapterId"),
                                                  CONSTRAINT fk_cp_account FOREIGN KEY("accountId") REFERENCES "account"("accountId") ON DELETE CASCADE,
                                                  CONSTRAINT fk_cp_chapter FOREIGN KEY("chapterId") REFERENCES "chapter"("chapterId") ON DELETE CASCADE,
                                                  CONSTRAINT fk_cp_transaction FOREIGN KEY("transactionId") REFERENCES "transaction_history"("transactionId") ON DELETE SET NULL
);

-- =========================================
-- 📚 3. Bảng lưu thông tin mua trọn bộ truyện
-- =========================================
CREATE TABLE IF NOT EXISTS "novel_purchase" (
                                                "accountId" INTEGER NOT NULL,
                                                "novelId" INTEGER NOT NULL,
                                                "purchaseDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                "transactionId" INTEGER,
                                                PRIMARY KEY ("accountId", "novelId"),
                                                CONSTRAINT fk_np_account FOREIGN KEY("accountId") REFERENCES "account"("accountId") ON DELETE CASCADE,
                                                CONSTRAINT fk_np_novel FOREIGN KEY("novelId") REFERENCES "novel_info"("novelId") ON DELETE CASCADE,
                                                CONSTRAINT fk_np_transaction FOREIGN KEY("transactionId") REFERENCES "transaction_history"("transactionId") ON DELETE SET NULL
);

-- =========================================
-- ⚡ 4. Index tối ưu hóa truy vấn
-- =========================================

-- Index để truy vấn nhanh người mua chương
CREATE INDEX IF NOT EXISTS idx_chapter_purchase_account
    ON "chapter_purchase"("accountId");

CREATE INDEX IF NOT EXISTS idx_chapter_purchase_chapter
    ON "chapter_purchase"("chapterId");

-- Index để truy vấn nhanh người mua truyện
CREATE INDEX IF NOT EXISTS idx_novel_purchase_account
    ON "novel_purchase"("accountId");

CREATE INDEX IF NOT EXISTS idx_novel_purchase_novel
    ON "novel_purchase"("novelId");

-- =========================================
-- ✏️ Thêm cột "accountId" (người đăng truyện)
-- =========================================
ALTER TABLE "novel_info"
    ADD COLUMN IF NOT EXISTS "accountId" INTEGER,
    ADD CONSTRAINT fk_novelinfo_account FOREIGN KEY ("accountId")
        REFERENCES "account" ("accountId")
        ON DELETE SET NULL;

ALTER TABLE account
    ADD COLUMN email VARCHAR(255);
