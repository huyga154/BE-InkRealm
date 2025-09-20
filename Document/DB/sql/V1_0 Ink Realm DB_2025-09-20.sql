
CREATE TABLE "account" (
    "accountId" SERIAL PRIMARY KEY,
    "username" VARCHAR(255),
    "password" VARCHAR(255),
    "fullName" VARCHAR(255),
    "avatar" TEXT NOT NULL
);

CREATE TABLE "novel_info" (
    "novelId" SERIAL PRIMARY KEY,
    "novelTitle" VARCHAR(255) UNIQUE,
    "novelDescription" TEXT,
    "createDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "author" VARCHAR(255)
);

CREATE TABLE "chapter_status" (
    "chapterStatusId" SERIAL PRIMARY KEY,
    "chapterStatusCode" VARCHAR(255),
    "chapterStatusDescription" TEXT
);

CREATE TABLE "chapter" (
    "chapterId" SERIAL PRIMARY KEY,
    "index" REAL,
    "chapterTitle" VARCHAR(255),
    "createDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updateDate" TIMESTAMP,
    "chapterText" TEXT,
    "chapterStatusId" INTEGER,
    CONSTRAINT fk_chapter_status
        FOREIGN KEY("chapterStatusId") REFERENCES "chapter_status"("chapterStatusId")
        ON UPDATE NO ACTION ON DELETE SET NULL
);

CREATE TABLE "novel_chapter" (
    "novelId" INTEGER NOT NULL,
    "chapterId" INTEGER NOT NULL,
    PRIMARY KEY("novelId", "chapterId"),
    CONSTRAINT fk_novel_chapter_novel
        FOREIGN KEY("novelId") REFERENCES "novel_info"("novelId")
        ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT fk_novel_chapter_chapter
        FOREIGN KEY("chapterId") REFERENCES "chapter"("chapterId")
        ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE "uploader" (
    "accountId" INTEGER NOT NULL,
    "novelId" INTEGER NOT NULL,
    PRIMARY KEY("accountId", "novelId"),
    CONSTRAINT fk_uploader_account
        FOREIGN KEY("accountId") REFERENCES "account"("accountId")
        ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT fk_uploader_novel
        FOREIGN KEY("novelId") REFERENCES "novel_info"("novelId")
        ON UPDATE NO ACTION ON DELETE CASCADE
);
