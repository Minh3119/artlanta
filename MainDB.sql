-- DROP & CREATE DATABASE s
DROP DATABASE IF EXISTS ARTLANTA;
CREATE DATABASE ARTLANTA;
USE ARTLANTA;

-- Main Media Link -- 

CREATE TABLE Media (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    URL VARCHAR(255) NOT NULL,
    Description VARCHAR(255)
);



-- USERS
CREATE TABLE Users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    FullName VARCHAR(100),
    Bio VARCHAR(255),
    AvatarURL VARCHAR(255) DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/3/38/Solid_white_bordered.png',
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

CREATE TABLE MusicMedia(
	ID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Playlist VARCHAR(50) NOT NULL,
    MediaURL VARCHAR(255) NOT NULL,
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






-- MESSAGING --
-- SELECT * FROM Conversations WHERE User1ID = ? OR User2ID = ?;
CREATE TABLE Conversations (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    User1ID INT,
    User2ID INT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(User1ID) REFERENCES Users(ID),
    FOREIGN KEY(User2ID) REFERENCES Users(ID),
    UNIQUE (User1ID, User2ID)
);

-- User-specific conversation view
CREATE TABLE UserConversations (
    UserID INT,
    ConversationID INT,
    Type ENUM('chat', 'pending', 'archived') NOT NULL DEFAULT 'chat',
    PRIMARY KEY (UserID, ConversationID),
    FOREIGN KEY (ConversationID) REFERENCES Conversations(ID)
);

CREATE TABLE Messages (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ConversationID INT,
    SenderID INT,
    Content TEXT,
    MediaURL VARCHAR(255),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(ConversationID) REFERENCES Conversations(ID),
    FOREIGN KEY(SenderID) REFERENCES Users(ID),
    isDeleted BOOLEAN DEFAULT FALSE,
    deletedAt DATETIME NULL
);

CREATE TABLE ConversationReads (
    ConversationID INT not null,
    UserID INT not null,
    LastReadMessageID INT,  -- can be null
    LastReadAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(ConversationID) REFERENCES Conversations(ID),
    FOREIGN KEY(UserID) REFERENCES Users(ID),
    FOREIGN KEY(LastReadMessageID) REFERENCES Messages(ID),
    PRIMARY KEY (ConversationID, UserID)
);




























-- SAMPLE DATA--

INSERT INTO Users (Username, Email, PasswordHash, FullName, Bio, AvatarURL, Status, Role, IsPrivate, CreatedAt)
VALUES
('john_doe', 'john.doe1975@chingchong.com', 'P@ssw0rd!123', 'Johnny', 'Graphic Designer', 'https://pbs.twimg.com/media/E8J9YcQVUAgoPn8.jpg', 'ACTIVE', 'ARTIST', 0, '2025-02-28'),
('jane_smith', 'jane.s.writer@fbt.com', 'Writ3rL1f3$', 'Janie Smithhhh', 'Nhà văn và blogger nổi tiếng', 'https://i.pinimg.com/736x/a8/3e/d4/a83ed42b038b230d3b1372fd3f542495.jpg', 'ACTIVE', 'STAFF', 0, '2025-03-01'),
('alice_wonder', 'alice.wonderland@edu.com', 'Tr@v3lPass#', 'AliceW', 'Nhận design character 2d', 'https://i.pinimg.com/736x/e5/75/17/e57517aab05bbf8f873c8c49df5cb17f.jpg', 'ACTIVE', 'ARTIST', 1, '2025-03-01'),
('bob_builder', 'bob.builder99@fpt.edu.com', 'C0nstruct!0nG0d', 'Bobby', 'Kỹ sư xây dựng chuyên nghiệp', 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-3.jpg', 'BANNED', 'CLIENT', 1, '2025-03-01'),
('charlie_dev', 'k20.never.have@fpt.edu.com', 'S3cur3D3vPa$$', 'CharDev', 'Developer chuyên back-end', 'https://i.pinimg.com/originals/8f/33/30/8f3330d6163782b88b506d396f5d156f.jpg', 'ACTIVE', 'ADMIN', 1, '2025-03-04'),
('emma_artist', 'emma.art@paintworld.com', 'Cr3ativ3Brush#', 'EmmaA', 'Họa sĩ sáng tạo, yêu nghệ thuật', 'https://i.pinimg.com/736x/7a/b5/bd/7ab5bd271b5b5c3c1104c88da3fd2ff8.jpg', 'ACTIVE', 'ARTIST', 0, '2025-03-05'),
('david_gamer', 'david.gaming@oliv.net', 'L3v3lUpGamer!#', 'DaviG', 'Streamer game nổi tiếng', 'https://jbagy.me/wp-content/uploads/2025/03/anh-avatar-vo-tri-hai-cute-2.jpg', 'ACTIVE', 'CLIENT', 1, '2025-03-04'),
('sophia_travel', 'sophia.travel@journeys.com', 'Expl0r3TheW0rld!', 'SophiT', 'Travel blogger, khám phá thế giới', 'https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Avatar%20Doremon%20cute-doremon-deo-kinh-ram.jpg?1704788723947', 'ACTIVE', 'STAFF', 0, '2025-03-07'),
('michael_87', 'michael87@hotmail.com', 'qwe456hash', 'Mike', 'Game thủ chuyên nghiệp.', 'https://i.pinimg.com/736x/07/d7/0f/07d70fb2938593e1f7320d36cddb40ea.jpg', 'ACTIVE', 'ADMIN', 0, '2025-03-08'),
('david.tech', 'david@techhub.com', 'd@v1dh@sh', 'David', 'Yêu thích công nghệ AI.', 'https://moc247.com/wp-content/uploads/2023/12/loa-mat-voi-101-hinh-anh-avatar-meo-cute-dang-yeu-dep-mat_2.jpg', 'BANNED', 'STAFF', 0, '2025-03-05'),
('kevin_coder', 'kevin.coder@pro.dev', 'c0d3rpass', 'Kev', 'Dev fullstack, đam mê JS.', 'https://i.pinimg.com/736x/9a/26/49/9a2649364cad50d23c3ebaef5441ec6e.jpg', 'ACTIVE', 'CLIENT', 1, '2025-03-10'),
('olivia_foodie', 'olivia.foodie@gmail.com', 'f00di3hash', 'Liv', 'Blogger ẩm thực.', 'https://thuthuatnhanh.com/wp-content/uploads/2020/10/hinh-anh-doraemon-ngai-ngung-390x390.jpg', 'ACTIVE', 'CLIENT', 1, '2025-03-11'),
('brian_startup', 'brian.startup@bizmail.com', 'st@rtup99', 'Brian', 'Founder công ty AI.', 'https://i.pinimg.com/736x/c2/33/71/c23371ccc0ae7f835d61f479670bfdbe.jpg', 'ACTIVE', 'ADMIN', 0, '2025-03-12'),
('amanda_artist', 'amanda.artist@gmail.com', 'artsy123', 'Mandy', 'Họa sĩ vẽ tranh sơn dầu.', 'https://i.pinimg.com/736x/f5/6f/e4/f56fe431bb79703e3f18240321dfb09c.jpg', 'ACTIVE', 'CLIENT', 1, '2025-03-13'),
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

INSERT INTO Portfolio (ArtistID, Title, Description, CoverURL, Achievements, CreatedAt) VALUES
(1, 'Digital Art Collection', 'Bộ sưu tập tranh kỹ thuật số phong cách hiện đại.', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop', 'Đạt giải nhất cuộc thi tranh kỹ thuật số 2024', '2025-04-01'),
(2, 'Portrait Sketches', 'Chuyên về phác thảo chân dung.', 'cover2.jpg', 'Triển lãm tranh tại gallery HN 2023', '2025-04-02'),
(3, 'Landscape Paintings', 'Tranh phong cảnh thiên nhiên Việt Nam.', 'https://i.pinimg.com/736x/e1/bf/33/e1bf336ede878927b2edcc465da6629d.jpg', 'Bán tranh tại triển lãm quốc tế 2024', '2025-04-03'),
(4, 'Anime Style Works', 'Tác phẩm theo phong cách anime.', 'cover4.jpg', 'Top 10 nghệ sĩ trẻ năm 2023', '2025-04-04'),
(5, '3D Modeling Portfolio', 'Các mẫu 3D từ cơ bản đến nâng cao.', 'cover5.jpg', 'Tham gia dự án game indie', '2025-04-05'),
(6, 'Watercolor Art', 'Bộ tranh màu nước nhẹ nhàng.', 'https://i.pinimg.com/736x/64/ae/b4/64aeb49cfa238dfac0c06cf416d15599.jpg', 'Giải thưởng màu nước 2023', '2025-04-06'),
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
(10, 'Kết hợp chất liệu', 'Kỹ thuật mixed media.', 0, 'PUBLIC', '2025-04-19', NULL, 0),
(11, 'Đỉnh cao nghệ thuật mới', 'Đỉnh cao nghệ thuật mới', 0, 'PUBLIC', '2025-04-19', NULL, 0),
(12, 'Tranh tôi mới ', 'Tranh tôi mới vẽ nè bro', 0, 'PUBLIC', '2025-04-19', NULL, 0),
(13, 'Kết hợp chất liệu', 'Những tone màu hợp với nhau.', 0, 'PUBLIC', '2025-04-19', NULL, 0),
(14, 'Kết hợp chất liệu', 'Các kỹ thuật vẽ phức tạp.', 0, 'PUBLIC', '2025-04-19', NULL, 0);




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
(1, 1, '2025-04-20'),
(1, 2, '2025-04-20'),
(1, 3, '2025-04-20'),
(2, 1, '2025-04-20'),
(3, 1, '2025-04-20'),
(4, 2, '2025-04-21'),
(5, 3, '2025-04-21'),
(6, 4, '2025-04-22'),
(7, 5, '2025-04-22'),
(8, 6, '2025-04-23'),
(9, 7, '2025-04-23'),
(10, 8, '2025-04-24'),
(1, 9, '2025-04-24'),
(9, 1, '2025-04-20');


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
INSERT INTO Media (URL, Description) VALUES
('https://i.pinimg.com/736x/0e/e2/f5/0ee2f5afea2a6dc5108298b410751cc8.jpg', 'Cute character illustration'),
('https://i.pinimg.com/736x/70/87/f5/7087f520a25d2c76052ebdbd593e849a.jpg', 'Nature-themed character'),
('https://i.pinimg.com/736x/84/f3/19/84f319e74946e06fd8afea52c1db3e0b.jpg', 'Water-themed artwork'),
('https://i.pinimg.com/736x/69/91/7a/69917acb2e8c10ed822e1efa85dee759.jpg', 'Fire-themed character'),
('https://i.pinimg.com/736x/7e/4a/71/7e4a71b6f79187f77289beaa1e1d476c.jpg', 'Flying creature artwork'),
('https://i.pinimg.com/736x/8b/d6/5a/8bd65ab420e51f0a9706fffa96d9f54d.jpg', 'Water beast artwork'),
('https://i.pinimg.com/736x/67/53/39/675339178e57ae7985d20d87fceee499.jpg', 'Psychic character concept'),
('https://i.pinimg.com/736x/02/42/0a/02420a7e4af9c03b381577394a35608d.jpg', 'Mythical creature design'),
('https://i.pinimg.com/736x/d5/5b/6c/d55b6c725a66bd51dde099652c95cda4.jpg', 'Dragon character concept'),
('https://i.pinimg.com/736x/a7/d2/71/a7d27153673ae86ea51e484a528a667d.jpg', 'Legendary beast design'),
('https://i.pinimg.com/originals/54/e0/0d/54e00d34f2eefd58798d055090ce49e4.gif', ''),
('https://i.pinimg.com/originals/54/e0/0d/54e00d34f2eefd58798d055090ce49e4.gif', ''),
('https://i.pinimg.com/736x/48/8e/7a/488e7a5a24daf041c66b28f8f4895909.jpg', ''),
('https://i.pinimg.com/736x/a5/dd/e6/a5dde6448aa477ab075975525ea93d52.jpg', ''),
('https://i.pinimg.com/736x/70/d9/3f/70d93ffeccd4509b66f5fcaf86b914f7.jpg', ''),
('https://i.pinimg.com/736x/8e/4a/3e/8e4a3ec21da25c06f1ded1ff1749403d.jpg', ''),
('https://i.pinimg.com/736x/e5/98/21/e5982112c7c3091f1a61de2a2a157fe2.jpg', ''),
('https://i.pinimg.com/736x/e1/bf/33/e1bf336ede878927b2edcc465da6629d.jpg', '');

-- Link Media to Portfolios
INSERT INTO PortfolioMedia (ArtistID, MediaID) VALUES
(1, 1), -- Digital Art Collection
(1, 2),
(2, 3), -- Portrait Sketches
(2, 4),
(3, 7), -- Landscape Paintings
(3, 8),
(3, 6), -- Anime Style Works
(3, 5),
(6, 9), -- 3D Modeling Portfolio
(6, 10),
(6,12);

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


-- giả sử post ID 1 có 3 ảnh
INSERT INTO PostMedia (PostID, MediaID) VALUES             
(1, 1),
(1, 2),
(1, 3),
(2, 4),
(2, 5),
(3, 6),
(4, 7),
(4, 8),
(5, 9),
(5, 10),
(6, 2),
(8,11),
(7,12),
(9,13),
(10,15),
(11,16),
(12,17),
(13,14),
(14,18);

USE ARTLANTA;
SELECT * FROM Users u LEFT JOIN Posts p on u.ID=p.UserID ;


-- SAMPLE DATA FOR MESSAGING --

INSERT INTO Conversations (User1ID, User2ID) VALUES (1, 2);
INSERT INTO Conversations (User1ID, User2ID) VALUES (1, 3);

-- Messages for Conversation 1 (between User 1 and 2) --
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Hey, how are you?', NULL, '2025-06-13 23:26:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'I am good, thanks! Check this out.', 'https://i.pinimg.com/736x/0e/e2/f5/0ee2f5afea2a6dc5108298b410751cc8.jpg', '2025-06-13 23:27:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Nice photo!', NULL, '2025-06-13 23:28:07');

-- Messages for Conversation 2 (between User 2 and 3) --
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 2, 'Hi, are you available for a meeting?', NULL, '2025-06-13 23:29:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 3, 'Sure, let me know the time.', NULL, '2025-06-13 23:30:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 2, 'Here is the document.', 'https://example.com/doc.pdf', '2025-06-13 23:31:07');

-- Additional bulk messages for testing --
-- 50 messages for Conversation 1 (User 1 & 2) --
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 4 in Conversation 1', NULL, '2025-06-13 23:32:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 5 in Conversation 1', 'https://i.pinimg.com/736x/70/87/f5/7087f520a25d2c76052ebdbd593e849a.jpg', '2025-06-13 23:33:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 6 in Conversation 1', NULL, '2025-06-13 23:34:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 7 in Conversation 1', NULL, '2025-06-13 23:35:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 8 in Conversation 1', 'https://i.pinimg.com/736x/84/f3/19/84f319e74946e06fd8afea52c1db3e0b.jpg', '2025-06-13 23:36:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 9 in Conversation 1', NULL, '2025-06-13 23:37:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 10 in Conversation 1', NULL, '2025-06-13 23:38:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 11 in Conversation 1', 'https://i.pinimg.com/736x/69/91/7a/69917acb2e8c10ed822e1efa85dee759.jpg', '2025-06-13 23:39:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 12 in Conversation 1', NULL, '2025-06-13 23:40:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 13 in Conversation 1', NULL, '2025-06-13 23:41:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 14 in Conversation 1', 'https://example.com/media14.jpg', '2025-06-13 23:42:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 15 in Conversation 1', NULL, '2025-06-13 23:43:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 16 in Conversation 1', NULL, '2025-06-13 23:44:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 17 in Conversation 1', 'https://example.com/media17.jpg', '2025-06-13 23:45:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 18 in Conversation 1', NULL, '2025-06-13 23:46:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 19 in Conversation 1', NULL, '2025-06-13 23:47:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 20 in Conversation 1', 'https://example.com/media20.jpg', '2025-06-13 23:48:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 21 in Conversation 1', NULL, '2025-06-13 23:49:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 22 in Conversation 1', NULL, '2025-06-13 23:50:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 23 in Conversation 1', 'https://example.com/media23.jpg', '2025-06-13 23:51:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 24 in Conversation 1', NULL, '2025-06-13 23:52:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 25 in Conversation 1', NULL, '2025-06-13 23:53:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 26 in Conversation 1', 'https://example.com/media26.jpg', '2025-06-13 23:54:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 27 in Conversation 1', NULL, '2025-06-13 23:55:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 28 in Conversation 1', NULL, '2025-06-13 23:56:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 29 in Conversation 1', 'https://example.com/media29.jpg', '2025-06-13 23:57:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 30 in Conversation 1', NULL, '2025-06-13 23:58:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 31 in Conversation 1', NULL, '2025-06-13 23:59:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 32 in Conversation 1', 'https://example.com/media32.jpg', '2025-06-14 00:00:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 33 in Conversation 1', NULL, '2025-06-14 00:01:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 34 in Conversation 1', NULL, '2025-06-14 00:02:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 35 in Conversation 1', 'https://example.com/media35.jpg', '2025-06-14 00:03:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 36 in Conversation 1', NULL, '2025-06-14 00:04:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 37 in Conversation 1', NULL, '2025-06-14 00:05:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 38 in Conversation 1', 'https://example.com/media38.jpg', '2025-06-14 00:06:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 39 in Conversation 1', NULL, '2025-06-14 00:07:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 40 in Conversation 1', NULL, '2025-06-14 00:08:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 41 in Conversation 1', 'https://i.pinimg.com/736x/0e/e2/f5/0ee2f5afea2a6dc5108298b410751cc8.jpg', '2025-06-14 00:09:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 42 in Conversation 1', NULL, '2025-06-14 00:10:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 43 in Conversation 1', NULL, '2025-06-14 00:11:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 44 in Conversation 1', 'https://i.pinimg.com/736x/70/87/f5/7087f520a25d2c76052ebdbd593e849a.jpg', '2025-06-14 00:12:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 45 in Conversation 1', NULL, '2025-06-14 00:13:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 46 in Conversation 1', NULL, '2025-06-14 00:14:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 47 in Conversation 1', 'https://i.pinimg.com/736x/84/f3/19/84f319e74946e06fd8afea52c1db3e0b.jpg', '2025-06-14 00:15:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 48 in Conversation 1', NULL, '2025-06-14 00:16:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 2, 'Message 49 in Conversation 1', NULL, '2025-06-14 00:17:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (1, 1, 'Message 50 in Conversation 1', 'https://i.pinimg.com/736x/69/91/7a/69917acb2e8c10ed822e1efa85dee759.jpg', '2025-06-14 00:18:07');

-- 20 messages for Conversation 2 (User 1 & 3) --
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 1, 'Message 4 in Conversation 2', NULL, '2025-06-14 00:19:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 3, 'Message 5 in Conversation 2', 'https://example.com/media5.jpg', '2025-06-14 00:20:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 1, 'Message 6 in Conversation 2', NULL, '2025-06-14 00:21:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 3, 'Message 7 in Conversation 2', NULL, '2025-06-14 00:22:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 1, 'Message 8 in Conversation 2', 'https://example.com/media8.jpg', '2025-06-14 00:23:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 3, 'Message 9 in Conversation 2', NULL, '2025-06-14 00:24:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 1, 'Message 10 in Conversation 2', NULL, '2025-06-14 00:25:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 3, 'Message 11 in Conversation 2', 'https://example.com/media11.jpg', '2025-06-14 00:26:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 1, 'Message 12 in Conversation 2', NULL, '2025-06-14 00:27:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 3, 'Message 13 in Conversation 2', NULL, '2025-06-14 00:28:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 1, 'Message 14 in Conversation 2', 'https://example.com/media14.jpg', '2025-06-14 00:29:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 3, 'Message 15 in Conversation 2', NULL, '2025-06-14 00:30:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 1, 'Message 16 in Conversation 2', NULL, '2025-06-14 00:31:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 3, 'Message 17 in Conversation 2', 'https://example.com/media17.jpg', '2025-06-14 00:32:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 1, 'Message 18 in Conversation 2', NULL, '2025-06-14 00:33:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 3, 'Message 19 in Conversation 2', NULL, '2025-06-14 00:34:07');
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES (2, 1, 'Message 20 in Conversation 2', 'https://example.com/media20.jpg', '2025-06-14 00:35:07');

-- Test data for UserConversations
-- Conversation 1: User 1 and User 2 (both have it as 'chat')
INSERT INTO UserConversations (UserID, ConversationID, Type) VALUES (1, 1, 'chat');
INSERT INTO UserConversations (UserID, ConversationID, Type) VALUES (2, 1, 'chat');

-- Conversation 2: User 1 and User 3 (User1 has it as 'chat', User3 has it as 'pending')
INSERT INTO UserConversations (UserID, ConversationID, Type) VALUES (1, 2, 'chat');
INSERT INTO UserConversations (UserID, ConversationID, Type) VALUES (3, 2, 'pending');

-- Additional conversations for testing different scenarios
-- Conversation 3: User 2 and User 3 (both have it as 'chat')
INSERT INTO Conversations (User1ID, User2ID) VALUES (2, 3);
INSERT INTO UserConversations (UserID, ConversationID, Type) VALUES (2, 3, 'chat');
INSERT INTO UserConversations (UserID, ConversationID, Type) VALUES (3, 3, 'chat');

-- Conversation 4: User 1 and User 4 (User1 has it as 'archived', User4 has it as 'chat')
INSERT INTO Conversations (User1ID, User2ID) VALUES (1, 4);
INSERT INTO UserConversations (UserID, ConversationID, Type) VALUES (1, 4, 'archived');
INSERT INTO UserConversations (UserID, ConversationID, Type) VALUES (4, 4, 'chat');

-- Conversation 5: User 2 and User 5 (User2 has it as 'pending', User5 has it as 'pending')
INSERT INTO Conversations (User1ID, User2ID) VALUES (2, 5);
INSERT INTO UserConversations (UserID, ConversationID, Type) VALUES (2, 5, 'pending');
INSERT INTO UserConversations (UserID, ConversationID, Type) VALUES (5, 5, 'pending');

-- Conversation 6: User 3 and User 4 (User3 has it as 'archived', User4 has it as 'archived')
INSERT INTO Conversations (User1ID, User2ID) VALUES (3, 4);
INSERT INTO UserConversations (UserID, ConversationID, Type) VALUES (3, 6, 'archived');
INSERT INTO UserConversations (UserID, ConversationID, Type) VALUES (4, 6, 'archived');


-- Add test messages for conversation 3 (User 2 and 3)
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES 
(3, 2, 'Hi there! How are you?', NULL, '2025-06-23 10:00:00'),
(3, 3, 'I''m doing great, thanks for asking!', NULL, '2025-06-23 10:05:00'),
(3, 2, 'Would you like to collaborate on a project?', NULL, '2025-06-23 10:10:00');

-- Add test messages for conversation 4 (User 1 and 4)
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES 
(4, 1, 'Hello! I saw your artwork, it''s amazing!', NULL, '2025-06-23 11:00:00'),
(4, 4, 'Thank you so much! I appreciate it.', NULL, '2025-06-23 11:15:00');

-- Add test messages for conversation 5 (User 2 and 5)
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES 
(5, 2, 'Are we still meeting tomorrow?', NULL, '2025-06-23 09:00:00'),
(5, 5, 'Yes, at 2 PM at the cafe?', NULL, '2025-06-23 09:05:00'),
(5, 2, 'Perfect, see you then!', NULL, '2025-06-23 09:06:00');

-- Add test messages for conversation 6 (User 4 and 3)
INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL, CreatedAt) VALUES 
(6, 4, 'Are we still meeting tomorrow?', NULL, '2025-06-23 09:00:00'),
(6, 3, 'Yes, at 2 PM at the cafe?', NULL, '2025-06-23 09:05:00'),
(6, 4, 'Perfect, see you then!', NULL, '2025-06-23 09:06:00');