-- DROP & CREATE DATABASE
DROP DATABASE IF EXISTS ARTLANTA;
CREATE DATABASE ARTLANTA;
USE ARTLANTA;

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
    IsPrivate BOOLEAN DEFAULT 0
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
    MediaURL VARCHAR(255),
    IsDraft BOOLEAN DEFAULT 0,
    Visibility VARCHAR(20) DEFAULT 'PUBLIC' CHECK (Visibility IN ('PUBLIC','PRIVATE')),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME,
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY(UserID) REFERENCES Users(ID) ON DELETE CASCADE
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
    IsDeleted BOOLEAN DEFAULT 0,
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

-- Sample Data for Users Table
INSERT INTO Users (Username, Email, PasswordHash, FullName, Bio, AvatarURL, Gender, DOB, Location, Role, Status, Language) VALUES
('john_doe', 'john.doe@email.com', 'hashed_password_123', 'John Doe', 'Professional digital artist specializing in concept art', 'https://example.com/avatars/john.jpg', 1, '1990-05-15', 'New York, USA', 'ARTIST', 'ACTIVE', 'en'),
('admin_sarah', 'sarah.admin@artlanta.com', 'admin_hash_456', 'Sarah Johnson', 'Platform Administrator', 'https://example.com/avatars/sarah.jpg', 0, '1988-08-22', 'San Francisco, USA', 'ADMIN', 'ACTIVE', 'en'),
('maria_art', 'maria@email.com', 'artist_hash_789', 'Maria Garcia', 'Traditional painter turned digital artist', 'https://example.com/avatars/maria.jpg', 0, '1995-03-10', 'Barcelona, Spain', 'ARTIST', 'ACTIVE', 'en'),
('tom_client', 'tom@email.com', 'client_hash_101', 'Tom Wilson', 'Art enthusiast and collector', 'https://example.com/avatars/tom.jpg', 1, '1992-11-30', 'London, UK', 'CLIENT', 'ACTIVE', 'en'),
('staff_alex', 'alex.staff@artlanta.com', 'staff_hash_202', 'Alex Chen', 'Community Manager', 'https://example.com/avatars/alex.jpg', 1, '1991-07-25', 'Toronto, Canada', 'STAFF', 'ACTIVE', 'en'),
('lisa_draws', 'lisa@email.com', 'artist_hash_303', 'Lisa Nguyen', 'Digital illustrator and manga artist', 'https://example.com/avatars/lisa.jpg', 0, '1993-09-18', 'Tokyo, Japan', 'ARTIST', 'ACTIVE', 'vn'),
('banned_user', 'banned@email.com', 'banned_hash_404', 'Banned User', 'Account banned for violation', 'https://example.com/avatars/default.jpg', 1, '1994-12-05', 'Unknown', 'CLIENT', 'BANNED', 'en'),
('private_jane', 'jane@email.com', 'private_hash_505', 'Jane Smith', 'Private account', 'https://example.com/avatars/jane.jpg', 0, '1997-04-20', 'Private', 'CLIENT', 'ACTIVE', 'en'),
('art_master', 'master@email.com', 'master_hash_606', 'David Kim', 'Professional concept artist with 10 years experience', 'https://example.com/avatars/david.jpg', 1, '1985-01-15', 'Seoul, Korea', 'ARTIST', 'ACTIVE', 'en'),
('casual_client', 'casual@email.com', 'client_hash_707', 'Emma Brown', 'Art lover and occasional commissioner', 'https://example.com/avatars/emma.jpg', 0, '1996-06-12', 'Melbourne, Australia', 'CLIENT', 'ACTIVE', 'en');

-- Update some timestamps to make the data more realistic
UPDATE Users SET 
    CreatedAt = DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY),
    LastLogin = DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 7) DAY);

-- Sample Data for UserSocialLinks Table
INSERT INTO UserSocialLinks (UserID, Platform, URL) VALUES
-- John Doe (Artist) social links
(1, 'Instagram', 'https://instagram.com/john_doe_art'),
(1, 'ArtStation', 'https://artstation.com/john_doe'),
(1, 'Twitter', 'https://twitter.com/john_doe_art'),
-- Sarah Johnson (Admin) social links
(2, 'LinkedIn', 'https://linkedin.com/in/sarah-johnson'),
(2, 'Twitter', 'https://twitter.com/sarah_admin'),
-- Maria Garcia (Artist) social links
(3, 'Instagram', 'https://instagram.com/maria_art'),
(3, 'DeviantArt', 'https://deviantart.com/maria_art'),
(3, 'Facebook', 'https://facebook.com/mariagarcia.art'),
-- Tom Wilson (Client) social link
(4, 'Instagram', 'https://instagram.com/tom_wilson'),
-- Alex Chen (Staff) social links
(5, 'LinkedIn', 'https://linkedin.com/in/alex-chen'),
(5, 'Twitter', 'https://twitter.com/staff_alex');

-- Sample Data for Portfolio Table
INSERT INTO Portfolio (ArtistID, Title, Description, CoverURL, Achievements) VALUES
(1, 'Digital Dreams', 'A collection of concept art and digital illustrations spanning various genres and styles', 
   'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop',
   'Featured Artist on ArtStation 2023, Best Digital Art Award 2022, 100k+ Instagram followers'),

(3, 'Traditional Meets Digital', 'Showcasing my journey from traditional painting to digital art, with focus on nature and portraits',
   'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1000&auto=format&fit=crop',
   'Barcelona Digital Arts Exhibition Winner 2023, Published Artist in Digital Arts Magazine');

-- Update their timestamps to be realistic
UPDATE Portfolio SET 
    CreatedAt = DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY);

Select *  from Users LIMIT 1


