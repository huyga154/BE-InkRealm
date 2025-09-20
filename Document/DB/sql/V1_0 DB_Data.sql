-- 1️⃣ Dữ liệu cho account
INSERT INTO "account" ("username", "password", "fullName", "avatar")
VALUES
('alice', 'pass123', 'Alice Nguyen', 'avatar1.png'),
('bob', 'pass456', 'Bob Tran', 'avatar2.png'),
('carol', 'pass789', 'Carol Le', 'avatar3.png');

-- 2️⃣ Dữ liệu cho novel_info
INSERT INTO "novel_info" ("novelTitle", "novelDescription", "author")
VALUES
('The Lost Kingdom', 'A fantasy story of a lost kingdom.', 'Alice Nguyen'),
('Space Odyssey', 'Sci-fi adventure in space.', 'Bob Tran');

-- 3️⃣ Dữ liệu cho chapter_status
INSERT INTO "chapter_status" ("chapterStatusCode", "chapterStatusDescription")
VALUES
('DRAFT', 'Chapter is draft'),
('PUBLISHED', 'Chapter is published');

-- 4️⃣ Dữ liệu cho chapter
INSERT INTO "chapter" ("index", "chapterTitle", "chapterText", "chapterStatusId")
VALUES
(1, 'Chapter 1: Beginning', 'This is the beginning of the story.', 2),
(2, 'Chapter 2: Journey', 'The journey continues.', 2),
(1, 'Chapter 1: Launch', 'Space adventure begins.', 1);

-- 5️⃣ Dữ liệu cho novel_chapter (link novels & chapters)
-- Giả sử chapterId tự sinh theo thứ tự insert
INSERT INTO "novel_chapter" ("novelId", "chapterId")
VALUES
(1, 1),  -- The Lost Kingdom -> Chapter 1: Beginning
(1, 2),  -- The Lost Kingdom -> Chapter 2: Journey
(2, 3);  -- Space Odyssey -> Chapter 1: Launch

-- 6️⃣ Dữ liệu cho uploader (ai upload novel nào)
INSERT INTO "uploader" ("accountId", "novelId")
VALUES
(1, 1),  -- Alice uploads The Lost Kingdom
(2, 2);  -- Bob uploads Space Odyssey
