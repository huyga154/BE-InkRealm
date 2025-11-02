

INSERT INTO genre_category (id, name, description) VALUES
           (1, 'Nhân vật', 'Các thuộc tính hoặc đặc điểm của nhân vật chính'),
           (2, 'Thế giới', 'Các loại thế giới trong truyện'),
           (3, 'Bối cảnh', 'Bối cảnh nơi diễn ra câu chuyện'),
           (4, 'Cốt truyện', 'Các yếu tố cốt truyện chính'),
           (5, 'Chủ đề', 'Chủ đề và phong cách tổng thể của truyện');



-- =============================
-- Nhân vật
-- =============================
INSERT INTO genre (category_id, name, description) VALUES
           (1, 'Lạnh lùng', 'Nhân vật ít biểu lộ cảm xúc, quyết đoán, trầm tĩnh'),
           (1, 'Ngộ tính cao', 'Nhân vật có óc hài hước, lém lỉnh, ứng biến nhanh'),
           (1, 'Thiên phú cao', 'Nhân vật sở hữu tài năng đặc biệt ngay từ đầu'),
           (1, 'Mang hệ thống', 'Nhân vật sở hữu hệ thống mà người khác không có'),
           (1, 'Thông minh', 'Nhân vật có trí tuệ cao, suy luận nhanh'),
           (1, 'Âm hiểm', 'Nhân vật có âm mưu thầm lặng, khó đoán'),
           (1, 'Âm mưu', 'Nhân vật thường lập kế hoạch, tính toán, thao túng'),
           (1, 'Báo thù', 'Nhân vật có mục tiêu trả thù, thúc đẩy cốt truyện'),
           (1, 'Chăm chỉ', 'Nhân vật nỗ lực, siêng năng, không bỏ cuộc'),
           (1, 'Sống cẩu', 'Nhân vật lươn lẹo, ích kỷ, hành xử trái đạo đức'),
           (1, 'Hậu cung', 'Nhân vật chính có nhiều người theo đuổi hoặc quan hệ tình cảm phức tạp'),
           (1, 'Một vợ', 'Nhân vật chính chỉ có một người bạn đời hoặc tình nhân'),
           (1, 'Bất tử', 'Nhân vật khởi đầu bất tử: chết rồi hồi sinh, thân thể bất hoại, thọ nguyên vô tận'),
           (1, 'Vô sỉ', 'Nhân vật táo bạo, không biết xấu hổ, liều lĩnh'),
           (1, 'Ngu ngốc', 'Nhân vật dễ bị lừa, ngây thơ hoặc dốt đặc'),
           (1, 'Kêu ngạo', 'Nhân vật kiêu căng, tự tin thái quá'),
           (1, 'Cơm mềm', 'Nhân vật yếu đuối, dễ bị tác động, nhạy cảm'),
           (1, 'Cá mặn', 'Nhân vật xảo quyệt, thích chơi khăm, tinh quái'),
           (1, 'Tham lam', 'Nhân vật muốn nhiều thứ, không từ thủ đoạn'),
           (1, 'Cơ duyên khởi đầu', 'Cơ duyên của nhân vật chính lúc bắt đầu truyện, ảnh hưởng cốt truyện'),
           (1, 'Khí vận nghịch thiên', 'Nhân vật gặp nghịch cảnh từ lúc đầu, phải vượt qua số phận');

-- =============================
-- Thế giới
-- =============================
INSERT INTO genre (category_id, name, description) VALUES
           (2, 'Thế giới thực', 'Truyện diễn ra trong bối cảnh thực tế, gần với đời sống thực'),
           (2, 'Thế giới giả tưởng', 'Truyện diễn ra trong thế giới tưởng tượng, có phép thuật, sinh vật huyền bí'),
           (2, 'Thế giới game', 'Bối cảnh là trò chơi hoặc thế giới ảo, nhân vật tham gia như trong game'),
           (2, 'Vô hạn lưu', 'Nhân vật đi qua các không gian, trải nghiệm nhiều thế giới khác nhau, luật lệ thay đổi liên tục'),
           (2, 'Thế giới khoa học', 'Thế giới dựa trên khoa học, công nghệ, trí tuệ nhân tạo, xã hội phát triển dựa trên khoa học'),
           (2, 'Thế giới siêu năng', 'Nhân vật sở hữu siêu năng lực hoặc khả năng đặc biệt trong bối cảnh thế giới riêng'),
           (2, 'Thế giới thần thoại', 'Thế giới dựa trên thần thoại, vị thần, sinh vật huyền thoại'),
           (2, 'Thế giới đa vũ trụ', 'Bối cảnh đa vũ trụ, nhiều vị diện, các thế lực và thực thể huyền bí tương tác'),
           (2, 'Thế giới Việt Nam', 'Truyện diễn ra tại Việt Nam, có thể quá khứ hoặc tương lai, gần gũi văn hóa Việt');

-- =============================
-- Bối cảnh
-- =============================
INSERT INTO genre (category_id, name, description) VALUES
           (3, 'Đô thị', 'Bối cảnh trong thành phố, đời sống hiện đại'),
           (3, 'Học đường', 'Bối cảnh học sinh, sinh viên, lớp học, câu lạc bộ'),
           (3, 'Vương quốc', 'Bối cảnh các vương quốc, hoàng tộc, cung đình'),
           (3, 'Cung đình', 'Các triều đại, quan lại, mưu kế hoàng tộc'),
           (3, 'Hậu tận thế', 'Xã hội sụp đổ sau thảm họa, nhân vật phải sinh tồn'),
           (3, 'Dã sử', 'Sử hư cấu dựa trên các sự kiện lịch sử, nhân vật sáng tạo'),
           (3, 'Đồng nhân', 'Truyện viết dựa trên nhân vật hoặc thế giới đã có từ tác phẩm khác'),
           (3, 'Quá khứ', 'Bối cảnh trước thời điểm hiện tại'),
           (3, 'Hiện tại', 'Bối cảnh thời điểm đang diễn ra câu chuyện'),
           (3, 'Tương lai', 'Bối cảnh thời gian sau hiện tại, xã hội phát triển'),
           (3, 'Bang phái', 'Các hội, bang phái, võ hiệp, nhóm quyền lực'),
           (3, 'Tu tiên', 'Bối cảnh tu tiên, luyện đạo, học thuật huyền bí');

-- =============================
-- Cốt truyện
-- =============================
INSERT INTO genre (category_id, name, description) VALUES
           (4, 'Chiến tranh', 'Các trận chiến, xung đột vũ trang, chiến lược quân sự'),
           (4, 'Hồi sinh', 'Nhân vật chết đi sống lại, thay đổi số phận'),
           (4, 'Phiêu lưu', 'Nhân vật khám phá, đi du hành, đối mặt thử thách'),
           (4, 'Xuyên không', 'Nhân vật đi đến một thế giới khác, quá khứ hoặc tương lai'),
           (4, 'Xuyên sách', 'Nhân vật đi vào thế giới trong sách hoặc tiểu thuyết'),
           (4, 'Trò chơi sinh tử', 'Nhân vật tham gia trò chơi nguy hiểm, thử thách sinh tử'),
           (4, 'Phát triển thế lực', 'Nhân vật hoặc nhóm xây dựng, phát triển quyền lực, thế lực riêng'),
           (4, 'Phát triển xã hội', 'Cốt truyện thể hiện sự thay đổi hoặc phát triển của xã hội'),
           (4, 'Âm mưu', 'Cốt truyện xoay quanh âm mưu, đấu trí, thủ đoạn');

-- =============================
-- Chủ đề
-- =============================
INSERT INTO genre (category_id, name, description) VALUES
           (5, 'Hành động', 'Truyện nhấn mạnh vào các pha chiến đấu, mạo hiểm và nguy hiểm'),
           (5, 'Phiêu lưu', 'Nhân vật chính đi du hành, khám phá thế giới mới, đối mặt thử thách'),
           (5, 'Lãng mạn', 'Tập trung vào các mối quan hệ tình cảm, tình yêu giữa các nhân vật'),
           (5, 'Hài hước', 'Truyện chứa yếu tố gây cười, trào phúng, tình huống dở khóc dở cười'),
           (5, 'Kinh dị', 'Tạo cảm giác sợ hãi, hồi hộp cho người đọc thông qua ma quái hoặc quái vật'),
           (5, 'Fantasy', 'Thế giới giả tưởng với phép thuật, sinh vật huyền bí, vương quốc'),
           (5, 'Khoa học viễn tưởng', 'Dựa trên khoa học, công nghệ tương lai, vũ trụ, robot, du hành thời gian'),
           (5, 'Cổ trang', 'Bối cảnh lịch sử, cung đình, võ thuật, chính trị thời xưa'),
           (5, 'Lịch sử', 'Dựa trên sự kiện, nhân vật lịch sử hoặc bối cảnh thời quá khứ'),
           (5, 'Bí ẩn', 'Nhân vật giải quyết vụ án, tìm kiếm manh mối'),
           (5, 'Tâm lý', 'Khám phá nội tâm nhân vật, hành vi, xung đột'),
           (5, 'Học đường', 'Bối cảnh học sinh, sinh viên, lớp học, câu lạc bộ'),
           (5, 'Gia đình', 'Miêu tả mối quan hệ giữa các thành viên trong gia đình'),
           (5, 'Đời thường', 'Khai thác cuộc sống hàng ngày, sinh hoạt, công việc'),
           (5, 'Trinh thám', 'Nhân vật phá án, theo dõi, tìm manh mối và giải quyết vụ án'),
           (5, 'Harem', 'Nhân vật chính được nhiều đối tượng tình cảm quan tâm hoặc yêu thích'),
           (5, 'Văn hóa phương Đông', 'Dựa trên phong tục, tập quán, truyền thuyết, triết lý, văn hóa Đông Á'),
           (5, 'Văn hóa phương Tây', 'Dựa trên văn hóa, truyền thuyết, tôn giáo và xã hội phương Tây'),
           (5, 'Chiến tranh thế giới', 'Bối cảnh chiến tranh quy mô lớn, toàn cầu hoặc đa quốc gia');






