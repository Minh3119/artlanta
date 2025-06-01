-- DROP & CREATE DATABASE s
DROP DATABASE IF EXISTS ARTLANTA;
CREATE DATABASE ARTLANTA;
USE ARTLANTA;

-- Main Media Link -- 

CREATE TABLE Media (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    URL VARCHAR(255) NOT NULL,
    Description VARCHAR(255),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);



-- USERS
CREATE TABLE Users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    FullName VARCHAR(100),
    Bio VARCHAR(255),
    AvatarURL VARCHAR(255),
    Gender BOOLEAN DEFAULT 0, -- chỉ có nam/nữ thôi không có chỗ cho làng gốm bát tràng
    DOB DATETIME,
    Location VARCHAR(255),
    Role VARCHAR(20) DEFAULT 'CLIENT' CHECK (Role IN ('CLIENT', 'ARTIST', 'ADMIN', 'STAFF')),
    Status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (Status IN ('ACTIVE', 'BANNED', 'DEACTIVATED')),
    Language VARCHAR(10) DEFAULT 'vn' CHECK (Language IN ('en','vn')),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    LastLogin DATETIME,
    IsPrivate BOOLEAN DEFAULT 0,
    IsFlagged BOOLEAN DEFAULT 0
);

/* PASSWORD RESET -- Beta
CREATE TABLE PasswordReset (
   ID INT PRIMARY KEY IDENTITY(1,1),
   UserID INT NOT NULL,
   Token NVARCHAR(255) NOT NULL,
   Expiry DATETIME NOT NULL,
   IsCaptchaVerified BOOLEAN DEFAULT 0,
   FOREIGN KEY(UserID) REFERENCES Users(ID) ON DELETE CASCADE
)  */

-- PORTFOLIO
CREATE TABLE Portfolio (
    ArtistID INT PRIMARY KEY,
    Title VARCHAR(100),
    Description VARCHAR(500),
    CoverURL VARCHAR(255),
    Achievements VARCHAR(1000),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ArtistID) REFERENCES Users(ID) ON DELETE CASCADE
);

-- POSTS
CREATE TABLE Posts (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    Title VARCHAR(100),
    Content VARCHAR(1000),
    IsDraft BOOLEAN DEFAULT 0,
    Visibility VARCHAR(20) DEFAULT 'PUBLIC' CHECK (Visibility IN ('PUBLIC','PRIVATE')),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME,
    IsFlagged BOOLEAN DEFAULT 0,
    FOREIGN KEY(UserID) REFERENCES Users(ID) ON DELETE CASCADE
);

-- Multi Media URL -- bắt buộc để đảm bảo khóa

-- bảng nối với Post
CREATE TABLE PostMedia (
    PostID INT,
    MediaID INT,
    PRIMARY KEY (PostID, MediaID),
    FOREIGN KEY (PostID) REFERENCES Posts(ID) ON DELETE CASCADE,
    FOREIGN KEY (MediaID) REFERENCES Media(ID) ON DELETE CASCADE
);

-- bảng nối với Portfolio
CREATE TABLE PortfolioMedia (
    ArtistID INT, -- trùng với Portfolio.ArtistID
    MediaID INT,
    PRIMARY KEY (ArtistID, MediaID),
    FOREIGN KEY (ArtistID) REFERENCES Portfolio(ArtistID) ON DELETE CASCADE,
    FOREIGN KEY (MediaID) REFERENCES Media(ID) ON DELETE CASCADE
);


-- COMMENTS
CREATE TABLE Comments (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    PostID INT NOT NULL,
    UserID INT NOT NULL,
    Content VARCHAR(1000),
    MediaURL VARCHAR(255),
    ParentID INT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    IsFlagged BOOLEAN DEFAULT 0,
    FOREIGN KEY(PostID) REFERENCES Posts(ID) ON DELETE CASCADE,
    FOREIGN KEY(UserID) REFERENCES Users(ID),
    FOREIGN KEY(ParentID) REFERENCES Comments(ID)
);


-- LIKES
CREATE TABLE Likes (
    UserID INT,
    PostID INT,
    LikedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(UserID, PostID),
    FOREIGN KEY(UserID) REFERENCES Users(ID),
    FOREIGN KEY(PostID) REFERENCES Posts(ID)
);

-- SAVED POSTS
CREATE TABLE SavedPost (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    PostID INT,
    SavedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(UserID) REFERENCES Users(ID),
    FOREIGN KEY(PostID) REFERENCES Posts(ID)
);





-- FOLLOWS
CREATE TABLE Follows (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    FollowerID INT,
    FollowingID INT,
    Status VARCHAR(10) DEFAULT 'ACCEPTED' CHECK (Status IN ('PENDING', 'ACCEPTED', 'REJECT')),
    FollowAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(FollowerID) REFERENCES Users(ID),
    FOREIGN KEY(FollowingID) REFERENCES Users(ID)
);

-- COMMISSION PRICING
CREATE TABLE CommissionPricing (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ArtistID INT,
    Title VARCHAR(100),
    Description VARCHAR(500),
    Price INT,
    EstimatedDays INT,
    FOREIGN KEY(ArtistID) REFERENCES Users(ID)
);

-- COMMISSION REQUESTS
CREATE TABLE CommissionRequest (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ClientID INT,
    ArtistID INT,
    Title VARCHAR(100),
    Description VARCHAR(1000),
    ReferenceURL VARCHAR(255),
    RequestAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(20) DEFAULT 'PENDING' CHECK (Status IN ('PENDING', 'APPROVED', 'REJECTED')),
    FOREIGN KEY(ClientID) REFERENCES Users(ID),
    FOREIGN KEY(ArtistID) REFERENCES Users(ID)
);

-- PAYMENT
CREATE TABLE Payment (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Price INT NOT NULL,
    Type VARCHAR(20) DEFAULT 'VietQR' CHECK (Type IN ('Paypal', 'ATM', 'VietQR')),
    Tax INT DEFAULT 5
);

-- COMMISSIONS
CREATE TABLE Commission (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    RequestID INT NOT NULL,
    PaymentID INT,
    Deadline DATETIME,
    Status VARCHAR(20) DEFAULT 'PROCESSING' CHECK (Status IN ('PROCESSING','DONE','CANCELLED')),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(RequestID) REFERENCES CommissionRequest(ID),
    FOREIGN KEY(PaymentID) REFERENCES Payment(ID)
);

-- COMMISSION PROGRESS
CREATE TABLE CommissionProgress (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    CommissionID INT,
    Note VARCHAR(1000),
    MediaURL VARCHAR(255),
    ProgressAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(CommissionID) REFERENCES Commission(ID)
);

-- REVIEWS
CREATE TABLE Review (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    CommissionID INT,
    ReviewerID INT,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment VARCHAR(1000),
    ReviewAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(CommissionID) REFERENCES Commission(ID),
    FOREIGN KEY(ReviewerID) REFERENCES Users(ID)
);

-- REPORTS -- Đang thử rút ngắn report user, post xem sao
CREATE TABLE Report (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ReporterID INT,
    TargetUserID INT,
    TargetPostID INT,
    Reason VARCHAR(255),
    ReportAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(20) DEFAULT 'PENDING',
    FOREIGN KEY(ReporterID) REFERENCES Users(ID),
    FOREIGN KEY(TargetUserID) REFERENCES Users(ID),
    FOREIGN KEY(TargetPostID) REFERENCES Posts(ID)
);

-- NOTIFICATIONS
CREATE TABLE Notifications (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Type VARCHAR(20),
    Content VARCHAR(255),
    PostID INT,
    IsRead BOOLEAN DEFAULT 0,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(UserID) REFERENCES Users(ID),
    FOREIGN KEY(PostID) REFERENCES Posts(ID)
);

-- SETTINGS
CREATE TABLE UserSettings (
    UserID INT PRIMARY KEY,
    NotifyLike BOOLEAN DEFAULT 1,
    NotifyComment BOOLEAN DEFAULT 1,
    NotifyCommission BOOLEAN DEFAULT 1,
    Language VARCHAR(10) DEFAULT 'vn',
    FOREIGN KEY(UserID) REFERENCES Users(ID)
);


-- HISTORY
CREATE TABLE UserHistory (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    PostID INT,
    ArtistID INT,
    ViewedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(UserID) REFERENCES Users(ID),
    FOREIGN KEY(PostID) REFERENCES Posts(ID),
    FOREIGN KEY(ArtistID) REFERENCES Users(ID)
);

CREATE TABLE UserSocialLinks (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    Platform VARCHAR(50) NOT NULL,
    # nếu muốn chỉ giới hạn thì Platform VARCHAR(50) CHECK (Platform IN ('Instagram', 'Twitter', 'Facebook', 'ArtStation', 'DeviantArt'))
    URL VARCHAR(255) NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(ID) ON DELETE CASCADE
);
-- TAG SYSTEM -DANG TEST
/*
CREATE TABLE Tags (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE ArtTags ( --Style
    ID INT AUTO_INCREMENT PRIMARY KEY,
    TagName VARCHAR(100) NOT NULL UNIQUE,
    Description VARCHAR(255)
);

CREATE TABLE PortfolioTags (
    ArtistID INT NOT NULL, --
    TagID INT NOT NULL,
    PRIMARY KEY (ArtistID, TagID),
    FOREIGN KEY (ArtistID) REFERENCES Portfolio(ArtistID) ON DELETE CASCADE,
    FOREIGN KEY (TagID) REFERENCES ArtTags(ID) ON DELETE CASCADE
);

CREATE TABLE UserTags ( --@
    UserID INT NOT NULL,
    TagID INT NOT NULL,
    PRIMARY KEY (UserID, TagID),
    FOREIGN KEY (UserID) REFERENCES Users(ID),
    FOREIGN KEY (TagID) REFERENCES Tags(ID)
);

CREATE TABLE PostTags ( --#
    PostID INT NOT NULL,
    TagID INT NOT NULL,
    PRIMARY KEY (PostID, TagID),
    FOREIGN KEY (PostID) REFERENCES Posts(ID) ON DELETE CASCADE,
    FOREIGN KEY (TagID) REFERENCES ArtTags(ID) ON DELETE CASCADE
);


CREATE TABLE TRIGGERTIME (
	TIME DATETIME,
    

)
*/
-- TRIGGER: recursive delete for child comments
DELIMITER $$
CREATE TRIGGER trg_DeleteChildComments
AFTER DELETE ON Comments
FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE current_id INT;
    DECLARE cur CURSOR FOR SELECT ID FROM Comments WHERE ParentID = OLD.ID;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO current_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        DELETE FROM Comments WHERE ID = current_id;
    END LOOP;
    CLOSE cur;
END $$
DELIMITER ;


-- SAMPLE DATA--

INSERT INTO Users (Username, Email, PasswordHash, FullName, Bio, AvatarURL, Status, Role, IsPrivate, CreatedAt)
VALUES
('john_doe', 'john.doe1975@chingchong.com', 'P@ssw0rd!123', 'Johnny', 'Graphic Designer', 'https://pbs.twimg.com/media/E8J9YcQVUAgoPn8.jpg', 'ACTIVE', 'ARTIST', 0, '2025-02-28'),
('jane_smith', 'jane.s.writer@fbt.com', 'Writ3rL1f3$', 'Janie', 'Nhà văn và blogger nổi tiếng', 'https://i.pinimg.com/736x/a8/3e/d4/a83ed42b038b230d3b1372fd3f542495.jpg', 'ACTIVE', 'STAFF', 0, '2025-03-01'),
('alice_wonder', 'alice.wonderland@edu.com', 'Tr@v3lPass#', 'AliceW', 'Nhận design character 2d', 'https://i.pinimg.com/736x/e5/75/17/e57517aab05bbf8f873c8c49df5cb17f.jpg', 'ACTIVE', 'ARTIST', 1, '2025-03-01'),
('bob_builder', 'bob.builder99@fpt.edu.com', 'C0nstruct!0nG0d', 'Bobby', 'Kỹ sư xây dựng chuyên nghiệp', 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-3.jpg', 'BANNED', 'CLIENT', 1, '2025-03-01'),
('charlie_dev', 'k20.never.have@fpt.edu.com', 'S3cur3D3vPa$$', 'CharDev', 'Developer chuyên back-end', 'https://i.pinimg.com/originals/8f/33/30/8f3330d6163782b88b506d396f5d156f.jpg', 'ACTIVE', 'ADMIN', 1, '2025-03-04'),
('emma_artist', 'emma.art@paintworld.com', 'Cr3ativ3Brush#', 'EmmaA', 'Họa sĩ sáng tạo, yêu nghệ thuật', 'picture.jpg', 'ACTIVE', 'ARTIST', 0, '2025-03-05'),
('david_gamer', 'david.gaming@oliv.net', 'L3v3lUpGamer!#', 'DaviG', 'Streamer game nổi tiếng', 'https://jbagy.me/wp-content/uploads/2025/03/anh-avatar-vo-tri-hai-cute-2.jpg', 'ACTIVE', 'CLIENT', 1, '2025-03-04'),
('sophia_travel', 'sophia.travel@journeys.com', 'Expl0r3TheW0rld!', 'SophiT', 'Travel blogger, khám phá thế giới', 'https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Avatar%20Doremon%20cute-doremon-deo-kinh-ram.jpg?1704788723947', 'ACTIVE', 'STAFF', 0, '2025-03-07'),
('michael_87', 'michael87@hotmail.com', 'qwe456hash', 'Mike', 'Game thủ chuyên nghiệp.', 'michael.jpg', 'ACTIVE', 'ADMIN', 0, '2025-03-08'),
('david.tech', 'david@techhub.com', 'd@v1dh@sh', 'David', 'Yêu thích công nghệ AI.', 'https://moc247.com/wp-content/uploads/2023/12/loa-mat-voi-101-hinh-anh-avatar-meo-cute-dang-yeu-dep-mat_2.jpg', 'BANNED', 'STAFF', 0, '2025-03-05'),
('kevin_coder', 'kevin.coder@pro.dev', 'c0d3rpass', 'Kev', 'Dev fullstack, đam mê JS.', 'kevin.jpg', 'ACTIVE', 'CLIENT', 1, '2025-03-10'),
('olivia_foodie', 'olivia.foodie@gmail.com', 'f00di3hash', 'Liv', 'Blogger ẩm thực.', 'https://thuthuatnhanh.com/wp-content/uploads/2020/10/hinh-anh-doraemon-ngai-ngung-390x390.jpg', 'ACTIVE', 'CLIENT', 1, '2025-03-11'),
('brian_startup', 'brian.startup@bizmail.com', 'st@rtup99', 'Brian', 'Founder công ty AI.', 'brian.jpg', 'ACTIVE', 'ADMIN', 0, '2025-03-12'),
('amanda_artist', 'amanda.artist@gmail.com', 'artsy123', 'Mandy', 'Họa sĩ vẽ tranh sơn dầu.', 'amanda.jpg', 'ACTIVE', 'CLIENT', 1, '2025-03-13'),
('karen_yoga', 'karen.yoga@yogalife.com', 'yog4pass', 'Karen', 'Hướng dẫn viên yoga.', 'https://moc247.com/wp-content/uploads/2023/12/loa-mat-voi-101-hinh-anh-avatar-meo-cute-dang-yeu-dep-mat_2.jpg', 'ACTIVE', 'CLIENT', 0, '2025-03-22'),
('tom_cars', 'tom.cars@auto.com', 'c@rlover', 'Tom', 'Sưu tầm siêu xe.', 'https://thuthuatnhanh.com/wp-content/uploads/2020/10/hinh-anh-doraemon-ngai-ngung-390x390.jpg', 'BANNED', 'CLIENT', 1, '2025-03-15'),
('henry_science', 'henry.science@labmail.com', 'sci3nce123', 'Henry', 'Nhà nghiên cứu vật lý.', 'https://thuthuatnhanh.com/wp-content/uploads/2020/10/hinh-anh-doraemon-ngai-ngung-390x390.jpg', 'ACTIVE', 'ADMIN', 1, '2025-03-16'),
('ryan_gamer', 'ryan.gamer@gamemail.com', 'g@m3rpass', 'Ryan', 'Stream game hằng đêm.', 'https://moc247.com/wp-content/uploads/2023/12/loa-mat-voi-101-hinh-anh-avatar-meo-cute-dang-yeu-dep-mat_2.jpg', 'BANNED', 'CLIENT', 1, '2025-03-17'),
('adam_smith', 'adam.smith@finance.com', 'Fin@nc3Gur#', 'Adam', 'Chuyên gia tài chính và đầu tư.', 'adam.jpg', 'ACTIVE', 'CLIENT', 0, '2025-03-18'),
('bella_travel', 'bella.travel@journeys.com', 'Tr@v3lB3lla!', 'Bella', 'Đam mê du lịch và khám phá.', 'bella.jpg', 'ACTIVE', 'STAFF', 1, '2025-03-19'),
('carter_music', 'carter.music@melody.com', 'MusiC!an#99', 'Carter', 'Nghệ sĩ piano và sáng tác nhạc.', 'carter.jpg', 'ACTIVE', 'CLIENT', 0, '2025-03-20'),
('daniel.photography', 'daniel.photo@shutter.com', 'Ph0t0Mast3r!', 'Daniel', 'Nhiếp ảnh gia chuyên nghiệp.', 'daniel.jpg', 'ACTIVE', 'CLIENT', 1, '2025-03-21'),
('emma_w.riter', 'emma.writer@words.com', 'Wr!t3rPass#', 'Emma', 'Tác giả sách và nhà báo.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7ZeB5YnmcEWMvxvvAeTrTHD0y4k0dRnD_lg&s', 'ACTIVE', 'STAFF', 0, '2025-03-22'),
('frank_eng.ineer', 'frank.engineer@tech.com', 'Eng!neerG33k', 'Frank', 'Kỹ sư phần mềm AI.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyJFNw2dvGVLIG-Qh559mcsfcLRIwXZyXPAA&s', 'ACTIVE', 'ADMIN', 1, '2025-03-22'),
('geo.rge_dev', 'george.dev@coding.com', 'C0d3Rul3s!', 'George', 'Fullstack developer.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkYuP4IuXCruH6lqkPEfXG4f4aQE0hZ5e-1xUWrS5ZHRoCvopYXQENKSFI8LBBrp1vSNE&usqp=CAU', 'ACTIVE', 'CLIENT', 1, '2025-03-22'),
('harry.sports', 'harry.sports@fitness.com', 'F1tn3sP@ss!', 'Harry', 'Huấn luyện viên thể hình.', 'https://www.caythuocdangian.com/wp-content/uploads/avatar-anime-1.jpg', 'ACTIVE', 'CLIENT', 0, '2025-03-05'),
('isabe.lla_fashion', 'isabella.fashion@trend.com', 'Tr3ndyL00k!', 'Isabella', 'Fashionista và blogger.', NULL, 'ACTIVE', 'CLIENT', 0, '2025-03-06'),
('jack_gaming', 'jack.gaming@stream.com', 'G@mingLif3!', 'Jack', 'Game thủ eSports.', 'jack.jpg', 'ACTIVE', 'CLIENT', 1, '2025-03-07');

INSERT INTO Users (ID, Username, Email, PasswordHash, FullName, Status, Role, IsPrivate, CreatedAt)
VALUES (123, 'testuser123', 'test123@email.com', 'testpass', 'Test User 123', 'ACTIVE', 'CLIENT', 0, NOW());

INSERT INTO Portfolio (ArtistID, Title, Description, CoverURL, Achievements, CreatedAt) VALUES
(1, 'Digital Art Collection', 'Bộ sưu tập tranh kỹ thuật số phong cách hiện đại.', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop', 'Đạt giải nhất cuộc thi tranh kỹ thuật số 2024', '2025-04-01'),
(2, 'Portrait Sketches', 'Chuyên về phác thảo chân dung.', 'cover2.jpg', 'Triển lãm tranh tại gallery HN 2023', '2025-04-02'),
(3, 'Landscape Paintings', 'Tranh phong cảnh thiên nhiên Việt Nam.', 'cover3.jpg', 'Bán tranh tại triển lãm quốc tế 2024', '2025-04-03'),
(4, 'Anime Style Works', 'Tác phẩm theo phong cách anime.', 'cover4.jpg', 'Top 10 nghệ sĩ trẻ năm 2023', '2025-04-04'),
(5, '3D Modeling Portfolio', 'Các mẫu 3D từ cơ bản đến nâng cao.', 'cover5.jpg', 'Tham gia dự án game indie', '2025-04-05'),
(6, 'Watercolor Art', 'Bộ tranh màu nước nhẹ nhàng.', 'cover6.jpg', 'Giải thưởng màu nước 2023', '2025-04-06'),
(7, 'Abstract Art', 'Tác phẩm nghệ thuật trừu tượng.', 'cover7.jpg', 'Triển lãm cá nhân 2024', '2025-04-07'),
(8, 'Character Designs', 'Thiết kế nhân vật cho phim hoạt hình.', 'cover8.jpg', 'Làm việc cho studio ABC', '2025-04-08'),
(9, 'Photography Portfolio', 'Ảnh nghệ thuật và chân dung.', 'cover9.jpg', 'Ảnh đoạt giải cuộc thi quốc gia', '2025-04-09'),
(10, 'Mixed Media Art', 'Kết hợp nhiều chất liệu khác nhau.', 'cover10.jpg', 'Tác phẩm trưng bày tại bảo tàng', '2025-04-10');


INSERT INTO Posts (UserID, Title, Content, IsDraft, Visibility, CreatedAt, UpdatedAt, IsFlagged) VALUES
(1, 'Bài viết giới thiệu', 'Đây là bài giới thiệu đầu tiên.', 0, 'PUBLIC', '2025-04-10', NULL, 0),
(2, 'Quá trình sáng tác', 'Chia sẻ quá trình làm tranh.', 0, 'PUBLIC', '2025-04-11', NULL, 0),
(3, 'Mẹo vẽ phong cảnh', 'Hướng dẫn vẽ phong cảnh cơ bản.', 1, 'PRIVATE', '2025-04-12', NULL, 0),
(4, 'Phác thảo chân dung', 'Các bước phác thảo chân dung nhanh.', 0, 'PUBLIC', '2025-04-13', NULL, 0),
(5, '3D modeling basics', 'Những kiến thức cơ bản về 3D.',0, 'PUBLIC', '2025-04-14', NULL, 0),
(6, 'Tranh màu nước', 'Kỹ thuật vẽ màu nước đẹp.', 0, 'PUBLIC', '2025-04-15', NULL, 0),
(7, 'Nghệ thuật trừu tượng', 'Ý tưởng và cảm hứng.', 0, 'PRIVATE', '2025-04-16', NULL, 0),
(8, 'Thiết kế nhân vật hoạt hình', 'Quy trình làm nhân vật.', 0, 'PUBLIC', '2025-04-17', NULL, 0),
(9, 'Bộ sưu tập ảnh mới', 'Ảnh chụp tại Hà Nội.',0, 'PUBLIC', '2025-04-18', NULL, 0),
(10, 'Kết hợp chất liệu', 'Kỹ thuật mixed media.', 0, 'PUBLIC', '2025-04-19', NULL, 0);



INSERT INTO Comments (PostID, UserID, Content, MediaURL, ParentID, CreatedAt, IsFlagged) VALUES
(1, 2, 'Bài viết rất hữu ích!', NULL, NULL, '2025-04-20', 0),
(1, 3, 'Mình thích phần hướng dẫn.', NULL, NULL, '2025-04-20', 0),
(2, 4, 'Cảm ơn bạn đã chia sẻ.', NULL, NULL, '2025-04-21', 0),
(3, 5, 'Có video hướng dẫn không?', NULL, NULL, '2025-04-21', 0),
(4, 6, 'Mình muốn học thêm.', NULL, NULL, '2025-04-22', 0),
(5, 7, 'Bài viết rất chuyên nghiệp.', NULL, NULL, '2025-04-22', 0),
(6, 8, 'Thích phong cách của bạn.', NULL, NULL, '2025-04-23', 0),
(7, 9, 'Tuyệt vời!', NULL, NULL, '2025-04-23', 0),
(8, 10, 'Mong bạn tiếp tục sáng tác.', NULL, NULL, '2025-04-24', 0),
(9, 1, 'Bài viết rất đẹp!', NULL, NULL, '2025-04-24', 0);


INSERT INTO Likes (UserID, PostID, LikedAt) VALUES
(2, 1, '2025-04-20'),
(3, 1, '2025-04-20'),
(4, 2, '2025-04-21'),
(5, 3, '2025-04-21'),
(6, 4, '2025-04-22'),
(7, 5, '2025-04-22'),
(8, 6, '2025-04-23'),
(9, 7, '2025-04-23'),
(10, 8, '2025-04-24'),
(1, 9, '2025-04-24');


INSERT INTO SavedPost (UserID, PostID, SavedAt) VALUES
(2, 1, '2025-04-20'),
(3, 1, '2025-04-20'),
(4, 2, '2025-04-21'),
(5, 3, '2025-04-21'),
(6, 4, '2025-04-22'),
(7, 5, '2025-04-22'),
(8, 6, '2025-04-23'),
(9, 7, '2025-04-23'),
(10, 8, '2025-04-24'),
(1, 9, '2025-04-24');


INSERT INTO Follows (FollowerID, FollowingID, Status, FollowAt) VALUES
(1, 2, 'ACCEPTED', '2025-04-10'),
(2, 3, 'PENDING', '2025-04-11'),
(3, 4, 'ACCEPTED', '2025-04-12'),
(4, 5, 'REJECT', '2025-04-13'),
(5, 6, 'ACCEPTED', '2025-04-14'),
(6, 7, 'ACCEPTED', '2025-04-15'),
(7, 8, 'PENDING', '2025-04-16'),
(8, 9, 'ACCEPTED', '2025-04-17'),
(9, 10, 'ACCEPTED', '2025-04-18'),
(10, 1, 'ACCEPTED', '2025-04-19');


INSERT INTO CommissionPricing (ArtistID, Title, Description, Price, EstimatedDays) VALUES
(1, 'Portrait Sketch', 'Phác thảo chân dung đơn giản.', 100000, 3),
(2, 'Digital Painting', 'Tranh kỹ thuật số chi tiết.', 500000, 7),
(3, 'Custom 3D Model', 'Mẫu 3D theo yêu cầu.', 1000000, 14),
(4, 'Watercolor Painting', 'Tranh màu nước.', 300000, 5),
(5, 'Character Design', 'Thiết kế nhân vật.', 400000, 6),
(6, 'Abstract Art', 'Tranh trừu tượng.', 350000, 5),
(7, 'Photography Session', 'Chụp ảnh nghệ thuật.', 700000, 2),
(8, 'Animation Clip', 'Video hoạt hình ngắn.', 1500000, 20),
(9, 'Logo Design', 'Thiết kế logo cá nhân.', 200000, 3),
(10, 'Mixed Media Art', 'Kết hợp nhiều chất liệu.', 600000, 8);


INSERT INTO CommissionRequest (ClientID, ArtistID, Title, Description, ReferenceURL, RequestAt, Status) VALUES
(2, 1, 'Portrait Request', 'Xin vẽ chân dung theo ảnh.', 'http://ref1.com', '2025-04-20', 'PENDING'),
(3, 2, 'Landscape Painting', 'Tranh phong cảnh Việt Nam.', 'http://ref2.com', '2025-04-21', 'APPROVED'),
(4, 3, '3D Model Request', 'Mẫu 3D nhân vật game.', 'http://ref3.com', '2025-04-22', 'REJECTED'),
(5, 4, 'Watercolor Request', 'Tranh màu nước phong cảnh.', 'http://ref4.com', '2025-04-23', 'PENDING'),
(6, 5, 'Character Design', 'Thiết kế nhân vật hoạt hình.', 'http://ref5.com', '2025-04-24', 'PENDING'),
(7, 6, 'Abstract Painting', 'Yêu cầu tranh trừu tượng.', 'http://ref6.com', '2025-04-25', 'APPROVED'),
(8, 7, 'Photography Shoot', 'Chụp ảnh cá nhân.', 'http://ref7.com', '2025-04-26', 'PENDING'),
(9, 8, 'Animation Clip', 'Làm video hoạt hình.', 'http://ref8.com', '2025-04-27', 'APPROVED'),
(10, 9, 'Logo Design', 'Thiết kế logo công ty.', 'http://ref9.com', '2025-04-28', 'REJECTED'),
(1, 10, 'Mixed Media Art', 'Tranh kết hợp chất liệu.', 'http://ref10.com', '2025-04-29', 'PENDING');

-- Sample Media data with real, lightweight image URLs
INSERT INTO Media (URL, Description, CreatedAt) VALUES
('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', 'Cute character illustration', '2025-04-01'),
('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png', 'Nature-themed character', '2025-04-01'),
('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png', 'Water-themed artwork', '2025-04-02'),
('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png', 'Fire-themed character', '2025-04-02'),
('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', 'Flying creature artwork', '2025-04-03'),
('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png', 'Water beast artwork', '2025-04-03'),
('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png', 'Psychic character concept', '2025-04-04'),
('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png', 'Mythical creature design', '2025-04-04'),
('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png', 'Dragon character concept', '2025-04-05'),
('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/249.png', 'Legendary beast design', '2025-04-05');

-- Link Media to Portfolios
INSERT INTO PortfolioMedia (ArtistID, MediaID) VALUES
(1, 1), -- Digital Art Collection
(1, 2),
(2, 3), -- Portrait Sketches
(2, 4),
(3, 1), -- Landscape Paintings
(3, 2),
(3, 3), -- Anime Style Works
(3, 4),
(5, 9), -- 3D Modeling Portfolio
(5, 10);

-- Sample Social Links data
INSERT INTO UserSocialLinks (UserID, Platform, URL, CreatedAt) VALUES
(1, 'Instagram', 'https://instagram.com/john_doe_art', '2025-03-01'),
(1, 'Twitter', 'https://twitter.com/john_doe_creates', '2025-03-01'),
(1, 'ArtStation', 'https://artstation.com/john_doe_portfolio', '2025-03-01'),
(2, 'Instagram', 'https://instagram.com/jane_smith_writes', '2025-03-02'),
(2, 'Facebook', 'https://facebook.com/jane.smith.writer', '2025-03-02'),
(3, 'DeviantArt', 'https://deviantart.com/alice_wonder_art', '2025-03-03'),
(3, 'Instagram', 'https://instagram.com/alice_creates', '2025-03-03'),
(4, 'ArtStation', 'https://artstation.com/bob_builder_designs', '2025-03-04'),
(5, 'Twitter', 'https://twitter.com/charlie_dev_codes', '2025-03-05'),
(5, 'GitHub', 'https://github.com/charlie_dev', '2025-03-05'),
(6, 'Instagram', 'https://instagram.com/emma_artist_gallery', '2025-03-06'),
(6, 'DeviantArt', 'https://deviantart.com/emma_artist', '2025-03-06'),
(6, 'ArtStation', 'https://artstation.com/emma_portfolio', '2025-03-06'),
(7, 'Twitch', 'https://twitch.tv/david_gamer_live', '2025-03-07'),
(7, 'YouTube', 'https://youtube.com/david_gamer', '2025-03-07'),
(8, 'Instagram', 'https://instagram.com/sophia_travels', '2025-03-08'),
(8, 'Facebook', 'https://facebook.com/sophia.travel.blog', '2025-03-08'),
(9, 'Twitter', 'https://twitter.com/michael_gaming', '2025-03-09'),
(10, 'LinkedIn', 'https://linkedin.com/in/david-tech', '2025-03-10'),
(11, 'GitHub', 'https://github.com/kevin_coder', '2025-03-11');


INSERT INTO Notifications (UserID, Type, Content, PostID, IsRead, CreatedAt)
VALUES
(123, 'INFO', 'Welcome to Artlanta! This is your first notification.', NULL, 0, NOW()),
(123, 'COMMENT', 'Someone commented on your post.', 1, 0, NOW()),
(123, 'LIKE', 'Your post received a new like!', 2, 1, NOW()),
(123, 'SYSTEM', 'Your profile was updated successfully.', NULL, 0, NOW());


