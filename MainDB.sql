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
    Role VARCHAR(20) DEFAULT 'CLIENT' CHECK (Role IN ('CLIENT', 'ARTIST', 'ADMIN', 'MODERATOR', 'MODERATOR')),
    Status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (Status IN ('ACTIVE', 'BANNED', 'DEACTIVATED')),
    Language VARCHAR(10) DEFAULT 'vn' CHECK (Language IN ('en','vn')),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    LastLogin DATETIME,
    IsPrivate BOOLEAN DEFAULT 0,
    IsFlagged BOOLEAN DEFAULT 0
);

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

CREATE TABLE LivePosts (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    Title VARCHAR(100),
    LiveID VARCHAR(255),
    LiveView INT NOT NULL,
    LiveStatus VARCHAR(20) default 'Live' CHECK (LiveStatus IN ('Live','Post')),
    Visibility VARCHAR(20) DEFAULT 'PUBLIC' CHECK (Visibility IN ('PUBLIC','PRIVATE')),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(UserID) REFERENCES Users(ID) ON DELETE CASCADE
);
CREATE TABLE Gallery (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT default 0,
    LivePostID INT NOT NULL,
    ImageUrl VARCHAR(500) NOT NULL,
    GalleryLike INT default 0,
    FOREIGN KEY(UserID) REFERENCES Users(ID) ON DELETE CASCADE,
    FOREIGN KEY (LivePostID) REFERENCES LivePosts(ID) ON DELETE CASCADE
);

CREATE TABLE LiveChatMessages (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    LivePostID INT NOT NULL,
    UserID INT NOT NULL,
    ChatType VARCHAR(20) DEFAULT 'Chat',
    Message TEXT NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (LivePostID) REFERENCES LivePosts(ID) ON DELETE CASCADE
);
CREATE TABLE Auctions (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    SalerID INT default 0,
    LivePostID INT NOT NULL,
    ImageUrl VARCHAR(500) NOT NULL,
    Price INT NOT NULL CHECK (Price >= 0),
    UserID INT default 0,
    IsBid VARCHAR(20) default 'NoBid',
    FOREIGN KEY(UserID) REFERENCES Users(ID) ON DELETE CASCADE,
    FOREIGN KEY (LivePostID) REFERENCES LivePosts(ID) ON DELETE CASCADE
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
    FollowedID INT,
    Status VARCHAR(10) DEFAULT 'ACCEPTED' CHECK (Status IN ('PENDING', 'ACCEPTED', 'REJECT')),
    FollowAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(FollowerID) REFERENCES Users(ID),
    FOREIGN KEY(FollowedID) REFERENCES Users(ID)
);

-- WALLET AND TRANSACTION SYSTEM
CREATE TABLE Wallets (
    UserID INT PRIMARY KEY,
    Balance DECIMAL(12,2) DEFAULT 0,
    Currency VARCHAR(10) DEFAULT 'VND',
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(ID)
);

CREATE TABLE Transactions (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    PaymentMethod VARCHAR(20),
    Amount DECIMAL(12,2),
    Currency VARCHAR(10) DEFAULT 'VND',
    Status VARCHAR(99),
    TransactionType VARCHAR(50),   -- deposit, withdraw, donate_send, donate_receive
    Description VARCHAR(255),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(ID)
);

-- PAYMENT
CREATE TABLE Payment (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Price INT NOT NULL,
    Type VARCHAR(20) DEFAULT 'VietQR' CHECK (Type IN ('Paypal', 'ATM', 'VietQR')),
    Tax INT DEFAULT 5
);


-- COMMISSION 
CREATE TABLE CommissionRequest (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ClientID INT NOT NULL,                            -- người thuê
    ArtistID INT NOT NULL,                            -- người được thuê
	ShortDescription TEXT NOT NULL,                   -- mô tả yêu cầu                 
    ReferenceURL VARCHAR(255),                        -- ảnh/tham khảo gửi kèm (nếu có)
    ProposedPrice DECIMAL(10,2),                      -- giá khách đề xuất (có thể bị thương lượng qua tin nhắn)
    ProposedDeadline DATETIME,                        -- thời gian mong muốn hoàn thành
    Status ENUM('PENDING', 'REJECTED', 'ACCEPTED') DEFAULT 'PENDING', -- trạng thái duyệt
    ArtistReply TEXT,                                 -- phản hồi ngắn từ artist nếu từ chối
    RequestAt DATETIME DEFAULT CURRENT_TIMESTAMP,     -- thời điểm gửi yêu cầu
    RespondedAt DATETIME,                             -- thời điểm artist phản hồi (accept/reject)
    FOREIGN KEY(ClientID) REFERENCES Users(ID),
    FOREIGN KEY(ArtistID) REFERENCES Users(ID)
);


CREATE TABLE Commission (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    RequestID INT UNIQUE NOT NULL,            -- gắn với request đã được ACCEPTED
    Title VARCHAR(100),                       -- tiêu đề tóm tắt (có thể copy từ request)
    Description TEXT,                         -- mô tả cuối cùng sau khi chốt
    Price DECIMAL(10,2) NOT NULL,             -- giá cuối đã thống nhất
    Deadline DATETIME NOT NULL,               -- hạn cuối mà artist phải nộp
    FileDeliveryURL VARCHAR(255),             -- link tải bản hoàn chỉnh (nếu có),
    PreviewImageURL VARCHAR(255),             -- link ảnh preview có watermark (nếu có),
    Status ENUM('IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'IN_PROGRESS',
    ArtistSeenFinal BOOLEAN DEFAULT FALSE,    -- đánh dấu artist đã gửi xong chưa
    ClientConfirmed BOOLEAN DEFAULT FALSE,    -- đánh dấu client đã xác nhận hoàn tất chưa
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(RequestID) REFERENCES CommissionRequest(ID)
);

CREATE TABLE CommissionRequirementDetail (
    ID           INT AUTO_INCREMENT PRIMARY KEY,
    CommissionID INT NOT NULL REFERENCES Commission(ID),
    DetailKey    VARCHAR(50) NOT NULL COMMENT 'ví dụ: specs, style, materials…',
    DetailValue  TEXT        NOT NULL COMMENT 'giá trị tương ứng',
    CreatedAt    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE CommissionHistory (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    CommissionID INT NOT NULL,
    ChangedField VARCHAR(50),       
    OldValue TEXT,
    NewValue TEXT,
    ChangedBy INT,                     
    ChangedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(CommissionID) REFERENCES Commission(ID),
    FOREIGN KEY(ChangedBy) REFERENCES Users(ID)
);



/*-- REVIEWS
CREATE TABLE Review (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    CommissionID INT,
    ReviewerID INT,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment VARCHAR(1000),
    ReviewAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(CommissionID) REFERENCES Commission(ID),
    FOREIGN KEY(ReviewerID) REFERENCES Users(ID)
); */


-- REPORTS
CREATE TABLE ReportPost (
    ReporterID INT,
    PostID INT,
    Reason VARCHAR(255),
    ReportAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(20) DEFAULT 'PENDING',
    PRIMARY KEY (ReporterID, PostID),
    FOREIGN KEY (ReporterID) REFERENCES Users(ID),
    FOREIGN KEY (PostID) REFERENCES Posts(ID)
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
 CREATE TABLE MusicPlayTime(
	ID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    PlayTime INT,
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

-- Trigger xóa comment con khi comment cha bị xóa
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
END$$

-- Trigger ghi lịch sử khi Commission bị cập nhật
CREATE TRIGGER trg_commission_update
AFTER UPDATE ON Commission
FOR EACH ROW
BEGIN
    DECLARE uid INT DEFAULT NULL; -- backend nên set user id vào khi gọi query

    IF NEW.Title <> OLD.Title THEN
        INSERT INTO CommissionHistory (CommissionID, ChangedField, OldValue, NewValue, ChangedBy)
        VALUES (NEW.ID, 'Title', OLD.Title, NEW.Title, uid);
    END IF;

    IF NEW.Description <> OLD.Description THEN
        INSERT INTO CommissionHistory (CommissionID, ChangedField, OldValue, NewValue, ChangedBy)
        VALUES (NEW.ID, 'Description', OLD.Description, NEW.Description, uid);
    END IF;

    IF NEW.Price <> OLD.Price THEN
        INSERT INTO CommissionHistory (CommissionID, ChangedField, OldValue, NewValue, ChangedBy)
        VALUES (NEW.ID, 'Price', OLD.Price, NEW.Price, uid);
    END IF;

    IF NEW.Deadline <> OLD.Deadline THEN
        INSERT INTO CommissionHistory (CommissionID, ChangedField, OldValue, NewValue, ChangedBy)
        VALUES (NEW.ID, 'Deadline', OLD.Deadline, NEW.Deadline, uid);
    END IF;

    IF NEW.FileDeliveryURL <> OLD.FileDeliveryURL THEN
        INSERT INTO CommissionHistory (CommissionID, ChangedField, OldValue, NewValue, ChangedBy)
        VALUES (NEW.ID, 'FileDeliveryURL', OLD.FileDeliveryURL, NEW.FileDeliveryURL, uid);
    END IF;

    IF NEW.Status <> OLD.Status THEN
        INSERT INTO CommissionHistory (CommissionID, ChangedField, OldValue, NewValue, ChangedBy)
        VALUES (NEW.ID, 'Status', OLD.Status, NEW.Status, uid);
    END IF;

    IF NEW.ArtistSeenFinal <> OLD.ArtistSeenFinal THEN
        INSERT INTO CommissionHistory (CommissionID, ChangedField, OldValue, NewValue, ChangedBy)
        VALUES (NEW.ID, 'ArtistSeenFinal', OLD.ArtistSeenFinal, NEW.ArtistSeenFinal, uid);
    END IF;

    IF NEW.ClientConfirmed <> OLD.ClientConfirmed THEN
        INSERT INTO CommissionHistory (CommissionID, ChangedField, OldValue, NewValue, ChangedBy)
        VALUES (NEW.ID, 'ClientConfirmed', OLD.ClientConfirmed, NEW.ClientConfirmed, uid);
    END IF;
END$$

-- Trigger ghi log khi chi tiết yêu cầu thay đổi
CREATE TRIGGER trg_update_commission_detail
AFTER UPDATE ON CommissionRequirementDetail
FOR EACH ROW
BEGIN
    DECLARE uid INT DEFAULT NULL;

    IF NEW.DetailValue <> OLD.DetailValue THEN
        INSERT INTO CommissionHistory (
            CommissionID,
            ChangedField,
            OldValue,
            NewValue,
            ChangedBy,
            ChangedAt
        )
        VALUES (
            NEW.CommissionID,
            CONCAT('Requirement - ', NEW.DetailKey),
            OLD.DetailValue,
            NEW.DetailValue,
            uid,
            NOW()
        );
    END IF;
END$$

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

Create table LiveMessages(
	ID INT AUTO_INCREMENT PRIMARY KEY,
    SenderID INT,
    Content TEXT,
    RoomID INT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(RoomID) REFERENCES LivePosts(ID),
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



-- Create events table
CREATE TABLE events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    location VARCHAR(255),
    creator_id INT NOT NULL,
    image_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES Users(ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create event_followers table for managing event attendees/followers
CREATE TABLE event_followers (
    event_id INT,
    user_id INT,
    status ENUM('interested', 'going', 'not_going') DEFAULT 'interested',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(ID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create event_posts table for linking posts to events
CREATE TABLE event_posts (
    event_id INT,
    post_id INT,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, post_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES Posts(ID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE ArtistInfo (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL UNIQUE,
    
    PhoneNumber VARCHAR(20) NOT NULL,
    Specialty VARCHAR(100),
    ExperienceYears INT DEFAULT 0 CHECK (ExperienceYears >= 0),
    eKYC BOOLEAN DEFAULT FALSE,
    DailySpent int DEFAULT 1000000,
	stripe_account_id VARCHAR(255) DEFAULT Null,
    
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (UserID) REFERENCES Users(ID)
);

CREATE TABLE Escrows (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    FromUserID INT NOT NULL,           -- người gửi tiền (bên thanh toán)
    ToUserID INT NOT NULL,             -- người nhận tiền
    Amount DECIMAL(12,2) NOT NULL,
    Currency VARCHAR(10) DEFAULT 'VND',
    Status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, RELEASED, CANCELED
    Description VARCHAR(255),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    ReleasedAt DATETIME,               -- khi chuyển tiền cho người nhận
    FOREIGN KEY (FromUserID) REFERENCES Users(ID),
    FOREIGN KEY (ToUserID) REFERENCES Users(ID)
);










-- ================================
-- INSERT 2 USERS: 1 ARTIST & 1 CLIENT
-- ================================

-- Artist: Minh Anh - Họa sĩ chuyên nghiệp
INSERT INTO Users (Username, Email, PasswordHash, FullName, Bio, AvatarURL, Gender, DOB, Location, Role, Status, Language, CreatedAt, LastLogin, IsPrivate, IsFlagged)
VALUES 
('minh_anh_artist', 'minhanh.artist@gmail.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TttxN0nXyWFNzM6VehSdt7r.lqzS', 
 'Nguyễn Minh Anh', 
 'Họa sĩ chuyên nghiệp với 8 năm kinh nghiệm trong lĩnh vực digital art, concept art cho game và anime. Chuyên vẽ character design, portrait và illustration. Đã hoàn thành hơn 500+ commission cho khách hàng quốc tế.',
 'https://i.pinimg.com/736x/4f/27/9d/4f279d361960af96bf63836386393601.jpg',
 0, '1995-08-15 00:00:00', 'Quận 1, TP.HCM', 'ARTIST', 'ACTIVE', 'vn',
 '2023-01-15 09:30:00', '2025-07-26 14:22:00', 0, 0),

-- Client: David Trần - Nhà phát triển game indie
('david_tran_dev', 'david.tran.gamedev@outlook.com', '$2b$12$M8x2c3yqBWVHxkd0LHAkCOYz6TttxN0nXyWFNzM6VehSdt7r.abc123',
 'Trần Hoàng David',
 'Game Developer và Founder của studio indie "Pixel Dreams". Đam mê tạo ra những trò chơi mobile độc đáo với art style Việt Nam. Hiện đang phát triển game RPG "Huyền Thoại Việt" cần nhiều artwork chất lượng cao.',
 'https://i.pinimg.com/736x/0a/8c/d4/0a8cd40fd3db2dbb67eef7f6ce10aca6.jpg',
 1, '1992-03-22 00:00:00', 'Quận 7, TP.HCM', 'CLIENT', 'ACTIVE', 'vn',
 '2023-03-10 16:45:00', '2025-07-26 13:15:00', 0, 0);

INSERT INTO Users (Username, Email, PasswordHash, FullName, Bio, AvatarURL, Status, Role, IsPrivate, CreatedAt)
VALUES
('john_doe', 'john.doe1975@chingchong.com', 'P@ssw0rd!123', 'Johnny', 'Graphic Designer', 'https://pbs.twimg.com/media/E8J9YcQVUAgoPn8.jpg', 'ACTIVE', 'ARTIST', 0, '2025-02-28'),
('jane_smith', 'jane.s.writer@fbt.com', 'Writ3rL1f3$', 'Janie', 'Nhà văn và blogger nổi tiếng', 'https://i.pinimg.com/736x/a8/3e/d4/a83ed42b038b230d3b1372fd3f542495.jpg', 'ACTIVE', 'MODERATOR', 0, '2025-03-01'),
('alice_wonder', 'alice.wonderland@edu.com', 'Tr@v3lPass#', 'AliceW', 'Nhận design character 2d', 'https://i.pinimg.com/736x/e5/75/17/e57517aab05bbf8f873c8c49df5cb17f.jpg', 'ACTIVE', 'ARTIST', 1, '2025-03-01'),
('bob_builder', 'bob.builder99@fpt.edu.com', 'C0nstruct!0nG0d', 'Bobby', 'Kỹ sư xây dựng chuyên nghiệp', 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-3.jpg', 'BANNED', 'CLIENT', 1, '2025-03-01'),
('charlie_dev', 'k20.never.have@fpt.edu.com', 'S3cur3D3vPa$$', 'CharDev', 'Developer chuyên back-end', 'https://i.pinimg.com/originals/8f/33/30/8f3330d6163782b88b506d396f5d156f.jpg', 'ACTIVE', 'ADMIN', 1, '2025-03-04'),
('emma_artist', 'emma.art@paintworld.com', 'Cr3ativ3Brush#', 'EmmaA', 'Họa sĩ sáng tạo, yêu nghệ thuật', 'https://i.pinimg.com/736x/7a/b5/bd/7ab5bd271b5b5c3c1104c88da3fd2ff8.jpg', 'ACTIVE', 'ARTIST', 0, '2025-03-05'),
('david_gamer', 'david.gaming@oliv.net', 'L3v3lUpGamer!#', 'DaviG', 'Streamer game nổi tiếng', 'https://jbagy.me/wp-content/uploads/2025/03/anh-avatar-vo-tri-hai-cute-2.jpg', 'ACTIVE', 'CLIENT', 1, '2025-03-04'),
('sophia_travel', 'sophia.travel@journeys.com', 'Expl0r3TheW0rld!', 'SophiT', 'Travel blogger, khám phá thế giới', 'https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Avatar%20Doremon%20cute-doremon-deo-kinh-ram.jpg?1704788723947', 'ACTIVE', 'MODERATOR', 0, '2025-03-07'),
('michael_87', 'michael87@hotmail.com', 'qwe456hash', 'Mike', 'Game thủ chuyên nghiệp.', 'https://i.pinimg.com/736x/07/d7/0f/07d70fb2938593e1f7320d36cddb40ea.jpg', 'ACTIVE', 'ADMIN', 0, '2025-03-08'),
('david.tech', 'david@techhub.com', 'd@v1dh@sh', 'David', 'Yêu thích công nghệ AI.', 'https://moc247.com/wp-content/uploads/2023/12/loa-mat-voi-101-hinh-anh-avatar-meo-cute-dang-yeu-dep-mat_2.jpg', 'BANNED', 'MODERATOR', 0, '2025-03-05'),
('kevin_coder', 'kevin.coder@pro.dev', 'c0d3rpass', 'Kev', 'Dev fullstack, đam mê JS.', 'https://i.pinimg.com/736x/9a/26/49/9a2649364cad50d23c3ebaef5441ec6e.jpg', 'ACTIVE', 'CLIENT', 1, '2025-03-10'),
('olivia_foodie', 'olivia.foodie@gmail.com', 'f00di3hash', 'Liv', 'Blogger ẩm thực.', 'https://thuthuatnhanh.com/wp-content/uploads/2020/10/hinh-anh-doraemon-ngai-ngung-390x390.jpg', 'ACTIVE', 'CLIENT', 1, '2025-03-11'),
('brian_startup', 'brian.startup@bizmail.com', 'st@rtup99', 'Brian', 'Founder công ty AI.', 'https://i.pinimg.com/736x/c2/33/71/c23371ccc0ae7f835d61f479670bfdbe.jpg', 'ACTIVE', 'ADMIN', 0, '2025-03-12'),
('amanda_artist', 'amanda.artist@gmail.com', 'artsy123', 'Mandy', 'Họa sĩ vẽ tranh sơn dầu.', 'https://i.pinimg.com/736x/f5/6f/e4/f56fe431bb79703e3f18240321dfb09c.jpg', 'ACTIVE', 'CLIENT', 1, '2025-03-13'),
('karen_yoga', 'karen.yoga@yogalife.com', 'yog4pass', 'Karen', 'Hướng dẫn viên yoga.', 'https://moc247.com/wp-content/uploads/2023/12/loa-mat-voi-101-hinh-anh-avatar-meo-cute-dang-yeu-dep-mat_2.jpg', 'ACTIVE', 'CLIENT', 0, '2025-03-22'),
('tom_cars', 'tom.cars@auto.com', 'c@rlover', 'Tom', 'Sưu tầm siêu xe.', 'https://thuthuatnhanh.com/wp-content/uploads/2020/10/hinh-anh-doraemon-ngai-ngung-390x390.jpg', 'BANNED', 'CLIENT', 1, '2025-03-15'),
('henry_science', 'henry.science@labmail.com', 'sci3nce123', 'Henry', 'Nhà nghiên cứu vật lý.', 'https://thuthuatnhanh.com/wp-content/uploads/2020/10/hinh-anh-doraemon-ngai-ngung-390x390.jpg', 'ACTIVE', 'ADMIN', 1, '2025-03-16'),
('ryan_gamer', 'ryan.gamer@gamemail.com', 'g@m3rpass', 'Ryan', 'Stream game hằng đêm.', 'https://moc247.com/wp-content/uploads/2023/12/loa-mat-voi-101-hinh-anh-avatar-meo-cute-dang-yeu-dep-mat_2.jpg', 'BANNED', 'CLIENT', 1, '2025-03-17'),
('adam_smith', 'adam.smith@finance.com', 'Fin@nc3Gur#', 'Adam', 'Chuyên gia tài chính và đầu tư.', 'adam.jpg', 'ACTIVE', 'CLIENT', 0, '2025-03-18'),
('bella_travel', 'bella.travel@journeys.com', 'Tr@v3lB3lla!', 'Bella', 'Đam mê du lịch và khám phá.', 'bella.jpg', 'ACTIVE', 'MODERATOR', 1, '2025-03-19'),
('carter_music', 'carter.music@melody.com', 'MusiC!an#99', 'Carter', 'Nghệ sĩ piano và sáng tác nhạc.', 'carter.jpg', 'ACTIVE', 'CLIENT', 0, '2025-03-20'),
('daniel.photography', 'daniel.photo@shutter.com', 'Ph0t0Mast3r!', 'Daniel', 'Nhiếp ảnh gia chuyên nghiệp.', 'daniel.jpg', 'ACTIVE', 'CLIENT', 1, '2025-03-21'),
('emma_w.riter', 'emma.writer@words.com', 'Wr!t3rPass#', 'Emma', 'Tác giả sách và nhà báo.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7ZeB5YnmcEWMvxvvAeTrTHD0y4k0dRnD_lg&s', 'ACTIVE', 'MODERATOR', 0, '2025-03-22'),
('frank_eng.ineer', 'frank.engineer@tech.com', 'Eng!neerG33k', 'Frank', 'Kỹ sư phần mềm AI.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyJFNw2dvGVLIG-Qh559mcsfcLRIwXZyXPAA&s', 'ACTIVE', 'ADMIN', 1, '2025-03-22'),
('geo.rge_dev', 'george.dev@coding.com', 'C0d3Rul3s!', 'George', 'Fullstack developer.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkYuP4IuXCruH6lqkPEfXG4f4aQE0hZ5e-1xUWrS5ZHRoCvopYXQENKSFI8LBBrp1vSNE&usqp=CAU', 'ACTIVE', 'CLIENT', 1, '2025-03-22'),
('harry.sports', 'harry.sports@fitness.com', 'F1tn3sP@ss!', 'Harry', 'Huấn luyện viên thể hình.', 'https://www.caythuocdangian.com/wp-content/uploads/avatar-anime-1.jpg', 'ACTIVE', 'CLIENT', 0, '2025-03-05'),
('isabe.lla_fashion', 'isabella.fashion@trend.com', 'Tr3ndyL00k!', 'Isabella', 'Fashionista và blogger.', NULL, 'ACTIVE', 'CLIENT', 0, '2025-03-06'),
('jack_gaming', 'jack.gaming@stream.com', 'G@mingLif3!', 'Jack', 'Game thủ eSports.', 'jack.jpg', 'ACTIVE', 'CLIENT', 1, '2025-03-07');

-- ================================
-- ARTIST INFO CHO MINH ANH
-- ================================
INSERT INTO ArtistInfo (UserID, PhoneNumber, Specialty, ExperienceYears, eKYC, DailySpent, stripe_account_id, CreatedAt)
VALUES 
((SELECT ID FROM Users WHERE Username = 'minh_anh_artist'), 
 '+84901234567', 'Digital Art, Character Design, Concept Art', 8, TRUE, 2000000, 'acct_1234567890abcdef', '2023-01-15 10:00:00');

-- ================================
-- PORTFOLIO CHO MINH ANH
-- ================================
INSERT INTO Portfolio (ArtistID, Title, Description, CoverURL, Achievements, CreatedAt)
VALUES 
((SELECT ID FROM Users WHERE Username = 'minh_anh_artist'),
 'Digital Art Portfolio - Minh Anh',
 'Chuyên nghiệp trong việc tạo ra character design, concept art và illustration cho game, anime và manga. Phong cách đa dạng từ realistic đến anime/manga style. Sử dụng thành thạo Photoshop, Clip Studio Paint, Procreate.',
 'https://i.pinimg.com/1200x/eb/ec/ef/ebecef4598a23caaf0457820efcd1758.jpg',
 '• 500+ commission hoàn thành thành công\n• Hợp tác với 3 studio game lớn tại Việt Nam\n• Featured artist trên ArtStation 2023\n• Winner của Digital Art Contest VN 2022\n• 15K+ followers trên Instagram\n• Average rating 4.9/5 từ 200+ reviews',
 '2023-01-15 11:00:00');

-- ================================
-- WALLET CHO CẢ 2 USER
-- ================================
INSERT INTO Wallets (UserID, Balance, Currency, UpdatedAt)
VALUES 
((SELECT ID FROM Users WHERE Username = 'minh_anh_artist'), 15750000.00, 'VND', '2025-07-26 14:00:00'),
((SELECT ID FROM Users WHERE Username = 'david_tran_dev'), 8250000.00, 'VND', '2025-07-26 13:30:00');

-- ================================
-- TẠO CONVERSATION GIỮA 2 NGƯỜI
-- ================================
INSERT INTO Conversations (User1ID, User2ID, CreatedAt)
VALUES 
((SELECT ID FROM Users WHERE Username = 'david_tran_dev'),
 (SELECT ID FROM Users WHERE Username = 'minh_anh_artist'),
 '2025-07-15 09:20:00');

-- ================================
-- COMMISSION REQUEST CHI TIẾT
-- ================================
INSERT INTO CommissionRequest (ClientID, ArtistID, ShortDescription, ReferenceURL, ProposedPrice, ProposedDeadline, Status, ArtistReply, RequestAt, RespondedAt)
VALUES 
((SELECT ID FROM Users WHERE Username = 'david_tran_dev'),
 (SELECT ID FROM Users WHERE Username = 'minh_anh_artist'),
 'Tôi cần thiết kế 5 main character cho game RPG "Huyền Thoại Việt". Mỗi character cần có 3 pose khác nhau (idle, attack, skill). Style anime nhưng có elements truyền thống Việt Nam. Characters bao gồm: Warrior (áo giáp cổ VN), Mage (áo dài + phép thuật), Archer (trang phục thổ cẩm), Assassin (ninja VN), Support (thầy cúng). Cần file PSD với layers riêng biệt, resolution 2048x2048 cho mỗi pose.',
 'https://reference-images-vietnamese-characters.zip',
 4500000.00,
 '2025-08-15 23:59:59',
 'ACCEPTED',
 'Project rất thú vị! Tôi có kinh nghiệm làm character cho game và rất yêu thích văn hóa Việt Nam. Chúng ta có thể thảo luận thêm về chi tiết qua tin nhắn.',
 '2025-07-15 09:30:00',
 '2025-07-15 14:20:00');

-- ================================
-- TẠO COMMISSION TỪ REQUEST
-- ================================
INSERT INTO Commission (RequestID, Title, Description, Price, Deadline, Status, CreatedAt, UpdatedAt)
VALUES 
(1, 
 'Character Design - Game "Huyền Thoại Việt"',
 'Thiết kế 5 main character cho game RPG mobile với phong cách anime-Vietnamese fusion. Bao gồm:\n\n1. WARRIOR - "Thần Trận"\n- Giới tính: Nam\n- Tuổi: 28\n- Trang phục: Áo giáp cổ Việt Nam kết hợp elements hiện đại\n- Vũ khí: Đao phượng hoàng (phoenix blade)\n- Personality: Dũng mãnh, lãnh đạo\n- 3 poses: Idle (stance tự tin), Attack (chém ngang), Ultimate skill (triệu hồi phượng hoàng)\n\n2. MAGE - "Tiên Nữ"\n- Giới tính: Nữ\n- Tuổi: 24\n- Trang phục: Áo dài trắng với chi tiết thêu rồng, nón lá ma thuật\n- Vũ khí: Trúc bút (magic bamboo staff)\n- Elements: Thuỷ, mộc\n- 3 poses: Idle (thiền định), Cast spell (vẽ phù chú), Ultimate (triệu hồi rồng nước)\n\n3. ARCHER - "Cung Thủ Rừng"\n- Giới tính: Nữ\n- Tuổi: 22\n- Trang phục: Trang phục thổ cẩm của dân tộc thiểu số, accessories từ tre nứa\n- Vũ khí: Cung tre với tên lửa thần\n- 3 poses: Idle (canh gác), Shoot (bắn tên), Multi-shot ultimate\n\n4. ASSASSIN - "Bóng Đêm"\n- Giới tính: Nam\n- Tuổi: 26\n- Trang phục: Ninja outfit màu đen với mask rồng, sandals\n- Vũ khí: Dual kunai + shuriken hình lá sen\n- 3 poses: Idle (ẩn mình), Stealth attack (đâm sau lưng), Shadow clone ultimate\n\n5. SUPPORT - "Thầy Cúng"\n- Giới tính: Nam\n- Tuổi: 45\n- Trang phục: Áo dài nam màu vàng, turban, chuỗi tràng hạt\n- Tool: Linh bùa, đèn thờ\n- 3 poses: Idle (đọc kinh), Heal spell (tung bùa chú), Mass resurrection\n\nYêu cầu kỹ thuật:\n- Resolution: 2048x2048 pixels mỗi pose\n- Format: PSD với layers riêng biệt (line art, base color, shading, effects, background)\n- Color palette: Warm tones với accent colors đặc trưng VN\n- Background: Transparent hoặc simple gradient\n- Style reference: Genshin Impact meets Vietnamese traditional art',
 5200000.00,
 '2025-08-18 23:59:59',
 'IN_PROGRESS',
 '2025-07-15 15:00:00',
 '2025-07-20 10:30:00');

-- ================================
-- COMMISSION REQUIREMENT DETAILS
-- ================================
INSERT INTO CommissionRequirementDetail (CommissionID, DetailKey, DetailValue, CreatedAt)
VALUES 
(1, 'File_Format', 'PSD với layers riêng biệt (Line Art, Base Colors, Shading, Highlights, Effects, Background)', '2025-07-15 15:05:00'),
(1, 'Resolution', '2048x2048 pixels cho mỗi pose, 300 DPI', '2025-07-15 15:05:00'),
(1, 'Color_Mode', 'RGB, sRGB color space', '2025-07-15 15:05:00'),
(1, 'Revision_Rounds', 'Tối đa 3 lần chỉnh sửa major cho mỗi character, unlimited minor tweaks', '2025-07-15 15:05:00'),
(1, 'Reference_Style', 'Anime style như Genshin Impact, Fire Emblem Heroes, nhưng có elements Việt Nam', '2025-07-15 15:05:00'),
(1, 'Color_Palette', 'Warm earth tones, đỏ lacquer, vàng gold, xanh jade, trắng ivory như traditional VN art', '2025-07-15 15:05:00'),
(1, 'Character_Expressions', 'Mỗi character cần có facial expression phù hợp với personality', '2025-07-15 15:05:00'),
(1, 'Weapon_Details', 'Weapons cần có intricate details và engravings theo văn hoá VN', '2025-07-15 15:05:00'),
(1, 'Clothing_Accuracy', 'Trang phục phải historically accurate nhưng có stylized elements cho game', '2025-07-15 15:05:00'),
(1, 'Progress_Updates', 'Weekly progress update với sketch/WIP images', '2025-07-15 15:05:00');

-- ================================
-- COMMISSION HISTORY - TRACK CHANGES
-- ================================
INSERT INTO CommissionHistory (CommissionID, ChangedField, OldValue, NewValue, ChangedBy, ChangedAt)
VALUES 
(1, 'Price', '4500000.00', '5200000.00', (SELECT ID FROM Users WHERE Username = 'minh_anh_artist'), '2025-07-15 14:45:00'),
(1, 'Deadline', '2025-08-15 23:59:59', '2025-08-18 23:59:59', (SELECT ID FROM Users WHERE Username = 'david_tran_dev'), '2025-07-15 15:10:00'),
(1, 'Description', 'Basic character descriptions', 'Detailed character descriptions with poses and technical requirements', (SELECT ID FROM Users WHERE Username = 'minh_anh_artist'), '2025-07-15 15:15:00'),
(1, 'Status', 'PENDING', 'IN_PROGRESS', (SELECT ID FROM Users WHERE Username = 'minh_anh_artist'), '2025-07-15 15:30:00');

-- ================================
-- TIN NHẮN TRAO ĐỔI CÔNG VIỆC CHI TIẾT
-- ================================
INSERT INTO Messages (ConversationID, SenderID, Content, CreatedAt)
VALUES 
-- Tin nhắn đầu tiên từ David
(1, (SELECT ID FROM Users WHERE Username = 'david_tran_dev'), 
 'Chào anh Minh Anh! Em là David, founder của Pixel Dreams studio. Em đã xem portfolio của anh trên platform và rất ấn tượng với style art của anh, đặc biệt là những character design cho game. Em đang develop một game RPG mobile tên "Huyền Thoại Việt" và cần thiết kế main characters. Anh có thể nhận project này không ạ?', 
 '2025-07-15 09:25:00'),

-- Phản hồi từ Minh Anh
(1, (SELECT ID FROM Users WHERE Username = 'minh_anh_artist'), 
 'Chào David! Cảm ơn em đã liên hệ. Anh rất thích ý tưởng game RPG Việt Nam, nghe rất thú vị! Anh có kinh nghiệm làm character design cho game, đã làm cho vài studio trong nước. Em có thể share thêm chi tiết về project không? Như là art style em muốn, số lượng characters, timeline, budget range... để anh evaluate xem có thể nhận không ạ.', 
 '2025-07-15 09:45:00'),

-- David giải thích chi tiết project
(1, (SELECT ID FROM Users WHERE Username = 'david_tran_dev'),
 'Dạ anh! Project này em định làm 5 main characters cho team chính trong game. Style em muốn là anime nhưng có融入 elements văn hoá Việt Nam, kiểu như traditional clothing, weapons, accessories... Em muốn mỗi character thể hiện 1 class RPG khác nhau: Warrior, Mage, Archer, Assassin, Support.\n\nEm cần mỗi character có 3 poses: idle stance, attack pose, và ultimate skill pose. File delivery em muốn là PSD với layers tách riêng để team em có thể dễ dàng implement vào game engine.\n\nTimeline em hi vọng là khoảng 3-4 tuần. Về budget, em nghĩ khoảng 4-5 triệu cho toàn bộ. Anh thấy thế nào?',
 '2025-07-15 10:15:00'),

-- Minh Anh thảo luận về technical requirements
(1, (SELECT ID FROM Users WHERE Username = 'minh_anh_artist'),
 'Nghe hay đấy David! Anh rất thích concept này. Vài câu hỏi technical:\n\n1. Resolution em cần bao nhiêu? Cho mobile thì thường 1024x1024 hoặc 2048x2048?\n2. Em có reference images hay mood board nào không? Để anh hiểu rõ hơn về direction em muốn\n3. Color palette có constraints gì không? \n4. Characters có cần background hay transparent?\n5. Em có cần concepts sketches trước khi anh start final artwork không?\n\nVề pricing, với scope này (5 chars x 3 poses = 15 full illustrations + PSD organization), anh nghĩ 5.2 triệu sẽ hợp lý hơn. Timeline 3-4 tuần là OK nhé!',
 '2025-07-15 11:30:00'),

-- David trả lời technical questions
(1, (SELECT ID FROM Users WHERE Username = 'david_tran_dev'),
 'Dạ anh!\n\n1. Resolution: 2048x2048 sẽ perfect, em cần high-res để scale cho các devices khác nhau\n2. Em sẽ gửi reference pack cho anh, gồm traditional Vietnamese clothing references, weapon designs, và một số anime character styles em thích\n3. Color palette: Em muốn warm earth tones làm chính, có accent colors như đỏ lacquer, vàng gold, xanh jade... very Vietnamese feeling\n4. Transparent background nhé anh, để em dễ composite\n5. Concept sketches would be great! Em muốn review và feedback trước khi anh làm final\n\n5.2 triệu là OK với em đấy anh. Em sẽ tạo official commission request ngay!',
 '2025-07-15 12:00:00'),

-- Sau khi tạo commission request
(1, (SELECT ID FROM Users WHERE Username = 'minh_anh_artist'),
 'Perfect! Anh đã nhận được commission request của em và accept rồi nhé. Reference package em gửi rất detailed, anh thích lắm!\n\nPlan của anh sẽ là:\n- Tuần 1: Concept sketches cho cả 5 characters (chỉ idle poses)\n- Tuần 2: Refine concepts + làm final artwork cho 2 characters đầu tiên (all poses)\n- Tuần 3: Hoàn thành 2 characters tiếp theo\n- Tuần 4: Character cuối + final revisions\n\nAnh sẽ update progress weekly và gửi WIP images để em feedback. Sounds good?',
 '2025-07-15 15:35:00'),

-- Thảo luận về specific characters
(1, (SELECT ID FROM Users WHERE Username = 'david_tran_dev'),
 'Sounds perfect anh! Em có thêm vài ý tưởng cho từng character:\n\nWarrior: Em muốn anh ấy là leader type, confident và noble. Armor design có thể inspired by Trần dynasty?\n\nMage: Em nghĩ 1 cô gái gentle và elegant, áo dài style nhưng có magical elements. Maybe cô ấy có thể float một chút?\n\nArcher: Forest ranger vibe, ethnic minority clothing, very connected to nature\n\nAssassin: Mysterious và deadly, nhưng không quá dark. Ninja nhưng có Vietnamese touch\n\nSupport: Older wise character, như thầy cúng hay thầy phù thủy gì đó\n\nAnh thấy direction này thế nào?',
 '2025-07-15 16:00:00'),

-- Minh Anh brainstorm thêm
(1, (SELECT ID FROM Users WHERE Username = 'minh_anh_artist'),
 'Excellent ideas David! Anh đã start sketching một số concepts dựa trên em describe:\n\nWarrior "Thần Trận": Anh nghĩ tên này hay đấy. Armor sẽ combine Trần dynasty elements với modern fantasy. Weapon có thể là đao phượng hoàng?\n\nMage "Tiên Nữ": Áo dài trắng với embroidered dragons, nón lá nhưng có magical aura. Staff có thể là trúc bút traditional?\n\nArcher: Trang phục thổ cẩm rất beautiful cho character này. Cung tre với tên có đuôi lông chim\n\nAssassin "Bóng Đêm": Ninja outfit nhưng mask design theo dragon motif, weapons là kunai + shuriken hình lá sen\n\nSupport: "Thầy Cúng" - older man với áo dài nam, turban, holding linh bùa\n\nAnh sẽ sketch rough concepts cho cả 5 và gửi em review vào cuối tuần này!',
 '2025-07-16 09:15:00'),

-- Progress update 1
(1, (SELECT ID FROM Users WHERE Username = 'minh_anh_artist'),
 'Hi David! Weekly update đây:\n\nAnh đã hoàn thành rough sketches cho cả 5 characters (idle poses). Overall feedback từ em thế nào? Có character nào cần adjust major không?\n\nTrong tuần này anh sẽ refine Warrior và Mage concepts, sau đó start final artwork. Em có prefer character nào làm trước không?',
 '2025-07-22 14:30:00'),

-- David feedback
(1, (SELECT ID FROM Users WHERE Username = 'david_tran_dev'),
 'Anh ơi, sketches tuyệt vời luôn! Team em đều rất impressed. Có vài minor adjustments:\n\n- Warrior: Có thể make armor elaborate hơn một chút không anh? Em muốn anh ấy really stand out as leader\n- Mage: Perfect! Cô ấy exactly như em imagine\n- Archer: Cung có thể bigger một tí? To show power\n- Assassin: Mask design có thể subtle hơn? Current design hơi too elaborate\n- Support: Maybe thêm một số mystic accessories?\n\nEm muốn anh làm Warrior và Mage trước nhé, họ là 2 main characters của story.',
 '2025-07-22 16:45:00');



-- ================================
-- NHIỀU COMMISSION REQUESTS CHO ARTIST (Minh Anh)
-- ================================
INSERT INTO CommissionRequest (ClientID, ArtistID, ShortDescription, ReferenceURL, ProposedPrice, ProposedDeadline, Status, ArtistReply, RequestAt, RespondedAt)
VALUES 
-- Request 2: PENDING
((SELECT ID FROM Users WHERE Username = 'john_doe'), 
 (SELECT ID FROM Users WHERE Username = 'minh_anh_artist'),
 'Cần thiết kế logo và branding package cho startup fintech "VietPay". Bao gồm logo chính, variations, color palette, typography guide. Style modern và professional.',
 'https://i.pinimg.com/736x/1e/97/a5/1e97a5a07eeed3b717cfa42815800c66.jpg',
 1800000.00, '2025-08-05 23:59:59', 'PENDING', NULL, '2025-07-25 10:30:00', NULL),

-- Request 3: ACCEPTED
((SELECT ID FROM Users WHERE Username = 'alice_wonder'), 
 (SELECT ID FROM Users WHERE Username = 'minh_anh_artist'),
 'Portrait commission cho bạn trai. Style anime/manga, size A3, digital painting. Có reference photos.',
 'https://i.pinimg.com/736x/0f/d0/76/0fd07622a9eaff9241b21194e240ec31.jpg',
 800000.00, '2025-08-10 23:59:59', 'PENDING', 'Dễ thương quá! Anh sẽ làm portrait style anime romantic cho em nhé.', '2025-07-23 14:20:00', '2025-07-23 18:45:00'),

-- Request 4: REJECTED
((SELECT ID FROM Users WHERE Username = 'emma_artist'), 
 (SELECT ID FROM Users WHERE Username = 'minh_anh_artist'),
 'Cần vẽ 20 NSFW illustrations cho webtoon romance. Explicit content. Budget 3 triệu.',
 NULL,
 3000000.00, '2025-08-20 23:59:59', 'REJECTED', 'Xin lỗi em, anh không nhận loại content này. Em có thể tìm artist khác chuyên về NSFW art.', '2025-07-20 16:00:00', '2025-07-20 19:30:00'),

-- Request 5: PENDING
((SELECT ID FROM Users WHERE Username = 'charlie_dev'), 
 (SELECT ID FROM Users WHERE Username = 'minh_anh_artist'),
 'Website illustrations cho company portfolio thiên về mảng làm game. Cần 8 custom illustrations về Gaming themes. Vector format.',
 'https://i.pinimg.com/736x/02/c8/30/02c8301cc32ce79dce58586ce95a5d2e.jpg',
 2400000.00, '2025-08-12 23:59:59', 'PENDING', NULL, '2025-07-24 09:15:00', NULL),

-- Request 6: ACCEPTED
((SELECT ID FROM Users WHERE Username = 'sophia_travel'), 
 (SELECT ID FROM Users WHERE Username = 'minh_anh_artist'),
 'Book cover design cho travel guide "Hidden Gems" với style hoạt hình kiểu CN. Cần front cover, back cover, spine. Print-ready.',
 'https://i.pinimg.com/736x/b2/b9/be/b2b9bee991392cb20b426b57fa51f527.jpg',
 1200000.00, '2025-08-08 23:59:59', 'PENDING', 'Chủ đề du lịch VN rất thú vị! Anh sẽ design cover beautiful và eye-catching.', '2025-07-22 11:00:00', '2025-07-22 15:20:00'),



-- Request 8: PENDING
((SELECT ID FROM Users WHERE Username = 'olivia_foodie'), 
 (SELECT ID FROM Users WHERE Username = 'minh_anh_artist'),
 'Food illustrations cho cookbook "Vietnamese Street Food". Cần 25 detailed food illustrations. Watercolor style.',
 'https://i.pinimg.com/1200x/3a/b7/cb/3ab7cbf5c316c441cef2ad9a2d295ed2.jpg',
 3500000.00, '2025-08-25 23:59:59', 'PENDING', NULL, '2025-07-25 13:45:00', NULL),

-- Request 9: ACCEPTED
((SELECT ID FROM Users WHERE Username = 'brian_startup'), 
 (SELECT ID FROM Users WHERE Username = 'minh_anh_artist'),
 'App UI/UX illustrations cho meditation app "Zen Garden". Cần icons, onboarding illustrations, character mascot.',
 'https://i.pinimg.com/1200x/fe/3d/b1/fe3db1f01b80696efdd0e6230043621c.jpg',
 2800000.00, '2025-08-15 23:59:59', 'PENDING', 'Meditation app sounds peaceful! Anh rất interested và có experience với UI illustration.', '2025-07-21 16:30:00', '2025-07-21 20:15:00'),

-- Request 10: P
((SELECT ID FROM Users WHERE Username = 'amanda_artist'), 
 (SELECT ID FROM Users WHERE Username = 'minh_anh_artist'),
 'Collaboration request: Em muốn invite anh join art exhibition. Không có payment nhưng có exposure và networking.',
 NULL,
 0.00, '2025-09-01 23:59:59', 'ACCEPTED', 'Cảm ơn em đã nghĩ đến anh! Nhưng hiện tại anh đang focus vào paid commissions. Chúc exhibition của em thành công!', '2025-07-19 10:00:00', '2025-07-19 14:20:00'),

-- Request 11: PENDING
((SELECT ID FROM Users WHERE Username = 'karen_yoga'), 
 (SELECT ID FROM Users WHERE Username = 'minh_anh_artist'),
 'Yoga pose illustrations cho instructional book. 30 detailed poses, line art style. Cần anatomically correct.',
 'https://i.pinimg.com/736x/c6/22/da/c622da6cac1f75e11ac6bfbb3a61cd12.jpg',
 2100000.00, '2025-08-18 23:59:59', 'PENDING', NULL, '2025-07-26 07:30:00', NULL);

-- ================================
-- NHIỀU COMMISSION REQUESTS TỪ CLIENT (David)
-- ================================
INSERT INTO CommissionRequest (ClientID, ArtistID, ShortDescription, ReferenceURL, ProposedPrice, ProposedDeadline, Status, ArtistReply, RequestAt, RespondedAt)
VALUES 
-- Request từ David tới artist khác - PENDING
((SELECT ID FROM Users WHERE Username = 'david_tran_dev'),
 (SELECT ID FROM Users WHERE Username = 'emma_artist'),
 'Background art cho game "Huyền Thoại Việt". Cần 8 environment backgrounds: ancient temple, bamboo forest, Hoi An street, Mekong delta, Sapa mountains, imperial palace, cave dungeon, final boss arena.',
 'https://environment-refs.jpg',
 3200000.00, '2025-08-20 23:59:59', 'PENDING', NULL, '2025-07-24 15:00:00', NULL);












INSERT INTO Portfolio (ArtistID, Title, Description, CoverURL, Achievements, CreatedAt) VALUES
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


INSERT INTO Follows (FollowerID, FollowedID, Status, FollowAt) VALUES
(1, 2, 'ACCEPTED', '2025-04-10'),
(2, 3, 'PENDING', '2025-04-11'),
(3, 4, 'ACCEPTED', '2025-04-12'),
(4, 5, 'REJECT', '2025-04-13'),
(5, 6, 'ACCEPTED', '2025-04-14'),
(6, 7, 'ACCEPTED', '2025-04-15'),
(7, 8, 'PENDING', '2025-04-16'),
(8, 9, 'ACCEPTED', '2025-04-17'),
(9, 10, 'ACCEPTED', '2025-04-18'),
(10, 1, 'ACCEPTED', '2025-04-19'),
(1, 2, 'ACCEPTED', '2025-04-10'),
(2, 3, 'PENDING', '2025-04-11'),
(3, 4, 'ACCEPTED', '2025-04-12'),
(4, 5, 'REJECT', '2025-04-13'),
(5, 6, 'ACCEPTED', '2025-04-14'),
(6, 7, 'ACCEPTED', '2025-04-15'),
(7, 8, 'PENDING', '2025-04-16'),
(8, 9, 'ACCEPTED', '2025-04-17'),
(9, 10, 'ACCEPTED', '2025-04-18'),
(10, 1, 'ACCEPTED', '2025-04-19'),

(11, 6, 'ACCEPTED', '2025-06-10'),
(12, 4, 'ACCEPTED', '2025-06-10'),
(13, 8, 'ACCEPTED', '2025-06-10'),
(14, 20, 'ACCEPTED', '2025-06-10'),
(15, 10, 'ACCEPTED', '2025-06-10'),
(16, 7, 'ACCEPTED', '2025-06-10'),
(17, 22, 'ACCEPTED', '2025-06-10'),
(18, 24, 'ACCEPTED', '2025-06-10'),
(19, 9, 'ACCEPTED', '2025-06-10'),
(20, 16, 'ACCEPTED', '2025-06-10'),

(21, 3, 'ACCEPTED', '2025-06-11'),
(22, 25, 'ACCEPTED', '2025-06-11'),
(23, 6, 'ACCEPTED', '2025-06-11'),
(24, 12, 'ACCEPTED', '2025-06-11'),
(25, 15, 'ACCEPTED', '2025-06-11'),
(26, 4, 'ACCEPTED', '2025-06-11'),
(27, 19, 'ACCEPTED', '2025-06-11'),
(28, 7, 'ACCEPTED', '2025-06-11');


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
SELECT * FROM Users u LEFT JOIN Posts p on u.ID=p.UserID;


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



-- Add some sample events data
INSERT INTO events (title, description, start_time, end_time, location, creator_id, image_url)
VALUES 
('Art Exhibition', 'Join us for an amazing art exhibition featuring local artists', '2024-04-01 18:00:00', '2024-04-01 21:00:00', 'Atlanta Art Gallery', 1, NULL),
('Photography Workshop', 'Learn the basics of photography', '2024-04-15 14:00:00', '2024-04-15 17:00:00', 'Downtown Studio', 2, NULL);

-- Add some sample event followers
INSERT INTO event_followers (event_id, user_id, status)
VALUES 
(1, 2, 'going'),
(1, 3, 'interested'),
(2, 1, 'going'),
(2, 4, 'interested');



INSERT INTO Follows (FollowerID, FollowedID, Status, FollowAt) VALUES
(1, 2, 'ACCEPTED', '2025-04-10'),
(2, 3, 'PENDING', '2025-04-11'),
(3, 4, 'ACCEPTED', '2025-04-12'),
(4, 5, 'REJECT', '2025-04-13'),
(5, 6, 'ACCEPTED', '2025-04-14'),
(6, 7, 'ACCEPTED', '2025-04-15'),
(7, 8, 'PENDING', '2025-04-16'),
(8, 9, 'ACCEPTED', '2025-04-17'),
(9, 10, 'ACCEPTED', '2025-04-18'),
(10, 1, 'ACCEPTED', '2025-04-19'),
(1, 2, 'ACCEPTED', '2025-04-10'),
(2, 3, 'PENDING', '2025-04-11'),
(3, 4, 'ACCEPTED', '2025-04-12'),
(4, 5, 'REJECT', '2025-04-13'),
(5, 6, 'ACCEPTED', '2025-04-14'),
(6, 7, 'ACCEPTED', '2025-04-15'),
(7, 8, 'PENDING', '2025-04-16'),
(8, 9, 'ACCEPTED', '2025-04-17'),
(9, 10, 'ACCEPTED', '2025-04-18'),
(10, 1, 'ACCEPTED', '2025-04-19'),

(11, 6, 'ACCEPTED', '2025-06-10'),
(12, 4, 'ACCEPTED', '2025-06-10'),
(13, 8, 'ACCEPTED', '2025-06-10'),
(14, 20, 'ACCEPTED', '2025-06-10'),
(15, 10, 'ACCEPTED', '2025-06-10'),
(16, 7, 'ACCEPTED', '2025-06-10'),
(17, 22, 'ACCEPTED', '2025-06-10'),
(18, 24, 'ACCEPTED', '2025-06-10'),
(19, 9, 'ACCEPTED', '2025-06-10'),
(20, 16, 'ACCEPTED', '2025-06-10'),

(21, 3, 'ACCEPTED', '2025-06-11'),
(22, 25, 'ACCEPTED', '2025-06-11'),
(23, 6, 'ACCEPTED', '2025-06-11'),
(24, 12, 'ACCEPTED', '2025-06-11'),
(25, 15, 'ACCEPTED', '2025-06-11'),
(26, 4, 'ACCEPTED', '2025-06-11'),
(27, 19, 'ACCEPTED', '2025-06-11'),
(28, 7, 'ACCEPTED', '2025-06-11');
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

INSERT INTO Wallets (UserID, Balance, Currency)
VALUES 
  (3, 1200000.00, 'VND'),
  (4, 350000.00, 'VND'),
  (5, 50000.00, 'VND'),
  (6, 999999.99, 'VND'),
  (7, 70000.00, 'VND'),
  (8, 440000.00, 'VND'),
  (9, 0.00, 'VND'),
  (10, 300000.00, 'VND'),
  (13, 9000000.00, 'VND');



  
INSERT INTO Transactions (UserID, PaymentMethod, Amount, Currency, Status, TransactionType, Description, CreatedAt)
VALUES
(1, 'vnpay', 150000.00, 'VND', 'success', 'deposit', 'Nạp tiền qua VNPay, txnRef: a1', '2025-01-01 10:15:00'),
(2, 'vnpay', 22000.00, 'VND', 'success', 'deposit', 'Nạp tiền qua VNPay, txnRef: b2', '2025-06-03 14:20:00'),
(3, 'stripe', 250.00, 'USD', 'success', 'deposit', 'Nạp tiền qua Stripe, sessionId: s1', '2025-06-04 09:10:00'),
(4, 'paypal', 120.50, 'USD', 'success', 'deposit', 'Nạp tiền qua PayPal, orderId: p1', '2025-07-05 16:00:00'),
(5, 'vnpay', 10000.00, 'VND', 'success', 'deposit', 'Nạp tiền qua VNPay, txnRef: c3', '2025-08-08 13:30:00'),
(6, 'stripe', 800.99, 'USD', 'success', 'deposit', 'Nạp tiền qua Stripe, sessionId: s2', '2025-09-10 11:25:00'),
(7, 'paypal', 600.75, 'USD', 'success', 'deposit', 'Nạp tiền qua PayPal, orderId: p2', '2025-12-12 15:40:00'),
(8, 'vnpay', 50000.00, 'VND', 'success', 'deposit', 'Nạp tiền qua VNPay, txnRef: d4', '2026-06-15 18:05:00'),
(9, 'stripe', 100.00, 'USD', 'success', 'deposit', 'Nạp tiền qua Stripe, sessionId: s3', '2028-06-20 08:45:00'),
(10, 'paypal', 50.50, 'USD', 'success', 'deposit', 'Nạp tiền qua PayPal, orderId: p3', '2027-06-25 17:50:00');

INSERT INTO CommissionRequest (ClientID, ArtistID, ShortDescription, ReferenceURL, ProposedPrice, ProposedDeadline, Status, ArtistReply, RequestAt, RespondedAt)
VALUES
(2, 1, 'Portrait of my pet', 'https://i.pinimg.com/1200x/6a/1a/18/6a1a18472a84fb0aa929672fa834441f.jpg', 200000, '2025-07-01', 'PENDING', NULL, '2025-06-15', NULL),
(3, 2, 'Landscape painting of Hanoi', NULL, 500000, '2025-07-10', 'REJECTED', 'Sorry, I am busy this month.', '2025-06-16', '2025-06-17'),
(4, 3, 'Anime style character', 'https://imgur.com/char.jpg', 350000, '2025-07-05', 'ACCEPTED', NULL, '2025-06-18', '2025-06-19');

-- Commission sample data (assuming the 3rd request was accepted)
INSERT INTO Commission (RequestID, Title, Description, Price, Deadline, FileDeliveryURL, Status, ArtistSeenFinal, ClientConfirmed, CreatedAt, UpdatedAt)
VALUES
(3, 'Anime Character Commission', 'Finalized anime character design as discussed.', 37000, '2025-07-05', NULL, 'COMPLETED', FALSE, FALSE, '2025-06-19', '2025-06-19');

-- CommissionRequirementDetail sample data
INSERT INTO CommissionRequirementDetail (CommissionID, DetailKey, DetailValue)
VALUES
(1, 'Style', 'Anime, vibrant colors'),
(1, 'Format', 'PNG, 3000x4000px'),
(1, 'Background', 'Transparent');

-- CommissionHistory sample data
INSERT INTO CommissionHistory (CommissionID, ChangedField, OldValue, NewValue, ChangedBy)
VALUES
(1, 'Status', 'IN_PROGRESS', 'COMPLETED', 3),
(1, 'Price', '35000', '37000', 4);

-- User 1 as Client, User 2 as Artist
INSERT INTO CommissionRequest (ClientID, ArtistID, ShortDescription, ReferenceURL, ProposedPrice, ProposedDeadline, Status, ArtistReply, RequestAt, RespondedAt)
VALUES
(1, 2, 'Chibi portrait in anime style', 'https://imgur.com/chibi1.jpg', 12000, '2025-07-15', 'PENDING', NULL, '2025-06-20', NULL),
(1, 2, 'Realistic pet painting', 'https://imgur.com/pet2.jpg', 30000, '2025-07-20', 'REJECTED', 'Sorry, I do not paint pets.', '2025-06-21', '2025-06-22'),
(11, 1, 'Landscape with mountains', NULL, 25000, '2025-07-25', 'ACCEPTED', NULL, '2025-06-23', '2025-06-24');

-- User 2 as Client, User 1 as Artist
INSERT INTO CommissionRequest (ClientID, ArtistID, ShortDescription, ReferenceURL, ProposedPrice, ProposedDeadline, Status, ArtistReply, RequestAt, RespondedAt)
VALUES
(2, 1, 'Cartoon avatar', 'https://i.pinimg.com/736x/0a/8f/bb/0a8fbba508d98b19403ff8ce530f0e2f.jpg', 9000, '2025-07-18', 'PENDING', NULL, '2025-06-25', NULL),
(2, 1, 'Family portrait', NULL, 40000, '2025-07-30', 'REJECTED', 'Currently not accepting new commissions.', '2025-06-26', '2025-06-27'),
(2, 1, 'Fantasy character full body', 'https://imgur.com/fantasy1.jpg', 35000, '2025-08-01', 'ACCEPTED', NULL, '2025-06-28', '2025-06-29');

-- For accepted requests, create corresponding commissions
-- Let's assume the accepted requests above have IDs 6 and 9 (update IDs as per your DB auto-increment)
-- You may need to check the actual IDs after insertion

-- For (1,2) Landscape with mountains (assume CommissionRequest ID = 6)
INSERT INTO Commission (RequestID, Title, Description, Price, Deadline, FileDeliveryURL, Status, ArtistSeenFinal, ClientConfirmed, CreatedAt, UpdatedAt)
VALUES
(6, 'Landscape with Mountains', 'Finalized landscape painting with mountains as requested.', 27000, '2025-07-25', NULL, 'IN_PROGRESS', FALSE, FALSE, '2025-06-24', '2025-06-24');

-- For (2,1) Fantasy character full body (assume CommissionRequest ID = 9)
INSERT INTO Commission (RequestID, Title, Description, Price, Deadline, FileDeliveryURL, Status, ArtistSeenFinal, ClientConfirmed, CreatedAt, UpdatedAt)
VALUES
(9, 'Fantasy Character Full Body', 'Full body fantasy character illustration.', 35000, '2025-08-10', NULL, 'CANCELLED', FALSE, FALSE, '2025-06-29', '2025-06-29');

-- For CommissionID 2 (Landscape with Mountains)
INSERT INTO CommissionRequirementDetail (CommissionID, DetailKey, DetailValue)
VALUES
(2, 'Style', 'Realistic'),
(2, 'Size', 'A3'),
(2, 'Color', 'Vibrant');

-- For CommissionID 3 (Fantasy Character Full Body)
INSERT INTO CommissionRequirementDetail (CommissionID, DetailKey, DetailValue)
VALUES
(3, 'Pose', 'Dynamic action'),
(3, 'Background', 'Simple gradient'),
(3, 'Outfit', 'Medieval armor');

-- For CommissionID 2
INSERT INTO CommissionHistory (CommissionID, ChangedField, OldValue, NewValue, ChangedBy)
VALUES
(2, 'Status', 'IN_PROGRESS', 'COMPLETED', 2),
(2, 'Price', '25000', '27000', 1);

-- For CommissionID 3
INSERT INTO CommissionHistory (CommissionID, ChangedField, OldValue, NewValue, ChangedBy)
VALUES
(3, 'Status', 'IN_PROGRESS', 'CANCELLED', 1),
(3, 'Deadline', '2025-08-01', '2025-08-10', 2);


-- New commission requests for fresh commissions
INSERT INTO CommissionRequest (ClientID, ArtistID, ShortDescription, ReferenceURL, ProposedPrice, ProposedDeadline, Status, ArtistReply, RequestAt, RespondedAt)
VALUES
-- User 3 as Client, User 6 as Artist (Fresh commission)
(3, 6, 'Digital portrait of my daughter', 'https://imgur.com/portrait1.jpg', 18000, '2025-08-15', 'ACCEPTED', NULL, '2025-07-01', '2025-07-02'),
-- User 4 as Client, User 1 as Artist (Fresh commission)
(7, 1, 'Logo design for startup company', 'https://imgur.com/logo1.jpg', 45000, '2025-08-20', 'ACCEPTED', NULL, '2025-07-03', '2025-07-04'),
-- User 5 as Client, User 2 as Artist (Fresh commission)
(5, 2, 'Book cover illustration', 'https://imgur.com/bookcover1.jpg', 32000, '2025-08-25', 'ACCEPTED', NULL, '2025-07-05', '2025-07-06'),
-- User 6 as Client, User 3 as Artist (Fresh commission)
(6, 3, 'Character concept art for game', 'https://imgur.com/gamechar1.jpg', 28000, '2025-08-30', 'ACCEPTED', NULL, '2025-07-07', '2025-07-08'),
-- User 7 as Client, User 4 as Artist (Fresh commission)
(7, 4, 'Wedding invitation design', 'https://imgur.com/wedding1.jpg', 15000, '2025-09-05', 'ACCEPTED', NULL, '2025-07-09', '2025-07-10');

-- Fresh commissions (these will have NO history records)
INSERT INTO Commission (RequestID, Title, Description, Price, Deadline, FileDeliveryURL, Status, ArtistSeenFinal, ClientConfirmed, CreatedAt, UpdatedAt)
VALUES
-- Commission ID 4: Digital Portrait (Fresh - no history)
(10, 'Digital Portrait - Daughter', 'Beautiful digital portrait of client\'s daughter in a garden setting with soft lighting and warm colors.', 18000, '2025-08-15', NULL, 'IN_PROGRESS', FALSE, FALSE, '2025-07-02', '2025-07-02'),
-- Commission ID 5: Logo Design (Fresh - no history)
(11, 'Startup Logo Design', 'Modern and minimalist logo design for a tech startup company. Should be scalable and work well in both color and monochrome.', 45000, '2025-08-20', NULL, 'IN_PROGRESS', FALSE, FALSE, '2025-07-04', '2025-07-04'),
-- Commission ID 6: Book Cover (Fresh - no history)
(12, 'Fantasy Book Cover', 'Epic fantasy book cover illustration featuring a dragon and knight in a mystical forest setting.', 32000, '2025-08-25', NULL, 'IN_PROGRESS', FALSE, FALSE, '2025-07-06', '2025-07-06'),
-- Commission ID 7: Game Character (Fresh - no history)
(13, 'Game Character Concept', 'Detailed character concept art for a female warrior in futuristic armor with unique weapon design.', 28000, '2025-08-30', NULL, 'IN_PROGRESS', FALSE, FALSE, '2025-07-08', '2025-07-08'),
-- Commission ID 8: Wedding Invitation (Fresh - no history)
(14, 'Elegant Wedding Invitation', 'Sophisticated wedding invitation design with floral elements and elegant typography for a summer wedding.', 15000, '2025-09-05', NULL, 'IN_PROGRESS', FALSE, FALSE, '2025-07-10', '2025-07-10');

-- Commission requirement details for fresh commissions
INSERT INTO CommissionRequirementDetail (CommissionID, DetailKey, DetailValue)
VALUES
-- For Commission ID 4 (Digital Portrait)
(4, 'Style', 'Realistic digital painting'),
(4, 'Size', '4000x5000px'),
(4, 'Color Palette', 'Warm tones, garden setting'),
-- For Commission ID 5 (Logo Design)
(5, 'Style', 'Minimalist, modern'),
(5, 'Format', 'Vector files (AI, SVG)'),
(5, 'Color Scheme', 'Blue and white primary'),
-- For Commission ID 6 (Book Cover)
(6, 'Style', 'Epic fantasy illustration'),
(6, 'Size', 'A4 format'),
(6, 'Elements', 'Dragon, knight, mystical forest'),
-- For Commission ID 7 (Game Character)
(7, 'Style', 'Concept art, detailed'),
(7, 'Pose', 'Dynamic action pose'),
(7, 'Armor Style', 'Futuristic, sleek design'),
-- For Commission ID 8 (Wedding Invitation)
(8, 'Style', 'Elegant, romantic'),
(8, 'Theme', 'Summer garden wedding'),
(8, 'Typography', 'Script and serif fonts');






INSERT INTO ArtistInfo (UserID, PhoneNumber, Specialty, ExperienceYears, eKYC, DailySpent, stripe_account_id)
VALUES 
(3, '0911222333', 'Anime Style', 2, FALSE, 1000000, NULL),
(6, '0988777666', 'Watercolor', 4, TRUE, 1000000, 'acct_6zxyABC');

SET GLOBAL event_scheduler = ON;

CREATE EVENT ResetDailySpent
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_DATE + INTERVAL 1 DAY
DO
    UPDATE ArtistInfo 
    SET DailySpent = 1000000,
        LastResetDate = CURRENT_DATE
    WHERE LastResetDate < CURRENT_DATE;
    






