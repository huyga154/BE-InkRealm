-- =========================================
-- 🧩 Thêm dữ liệu cho bảng chapter_status
-- =========================================
INSERT INTO "chapter_status" ("chapterStatusId", "chapterStatusCode", "chapterStatusDescription") VALUES
                                                                                                      (1, 'PUBLIC', 'Đã được đăng'),
                                                                                                      (2, 'DRAFT', 'Chương nháp'),
                                                                                                      (3, 'COMPLETE', 'Đã hoàn thành'),
                                                                                                      (4, 'WAIT FOR PUBLIC', 'Chờ để đăng'),
                                                                                                      (5, 'WAIT FOR VERIFY', 'Chờ để kiểm duyệt'),
                                                                                                      (6, 'VERIFIED', 'Đã kiểm duyệt'),
                                                                                                      (7, 'REFUSE', 'Từ Chối')
ON CONFLICT ("chapterStatusId") DO NOTHING;
