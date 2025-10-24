-- Xóa toàn bộ dữ liệu cũ
TRUNCATE TABLE "role_status_rule" RESTART IDENTITY;

-- Role 1 = user
INSERT INTO "role_status_rule" ("roleId", "fromStatusId", "toStatusId") VALUES
                                                                            (1, 2, 5),  -- DRAFT → WANT_TO_VERIFY
                                                                            (1, 5, 2),  -- WANT_TO_VERIFY → DRAFT
                                                                            (1, 6, 1),  -- VERIFIED → PUBLIC
                                                                            (1, 1, 2),  -- PUBLIC → DRAFT
                                                                            (1, 7, 2);  -- REFUSE → DRAFT

-- Role 3 = moderator
INSERT INTO "role_status_rule" ("roleId", "fromStatusId", "toStatusId") VALUES
                                                                            (3, 5, 6),  -- WANT_TO_VERIFY → VERIFIED
                                                                            (3, 5, 7),  -- WANT_TO_VERIFY → REFUSE
                                                                            (3, 7, 6);  -- REFUSE → VERIFIED

-- Role 2 = admin (tất cả trạng thái)
DO $$
    DECLARE
        from_id INT;
        to_id INT;
    BEGIN
        FOR from_id IN 1..7 LOOP
                FOR to_id IN 1..7 LOOP
                        INSERT INTO "role_status_rule" ("roleId", "fromStatusId", "toStatusId")
                        VALUES (2, from_id, to_id);
                    END LOOP;
            END LOOP;
    END $$;
