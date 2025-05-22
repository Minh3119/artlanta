-- Drop database if it exists
DROP DATABASE IF EXISTS `Artlanta`;

-- Create a new database
CREATE DATABASE `Artlanta`;

-- Select (use) the database
USE `Artlanta`;

CREATE TABLE Users (
    `ID` INT PRIMARY KEY auto_increment,
    `Username` NVARCHAR(50) NOT NULL UNIQUE,
    `Email` NVARCHAR(100) UNIQUE NOT NULL,
    `PasswordHash` NVARCHAR(255) NOT NULL,
    `CreatedAt` DATETIME DEFAULT NOW(),
    `DisplayName` NVARCHAR(100) NULL, 
    `Bio` NVARCHAR(255) NULL, 
    `AvatarURL` NVARCHAR(255) NULL, 
    `Status` NVARCHAR(20) DEFAULT N'ACTIVE' CHECK (`Status` IN (N'ACTIVE', N'BANNED', N'DEACTIVATED')), 
    `Role` NVARCHAR(20) DEFAULT N'USER' CHECK (`Role` IN (N'USER', N'MODERATOR', N'ADMIN'))
);

INSERT INTO Users (Username, Email, PasswordHash, DisplayName, Bio, AvatarURL, Status, Role) VALUES 
('ArtisanBrush', 'brush.arts@example.com', 'PaintPass123', 'Clara Brush', 'Watercolor enthusiast creating vibrant landscapes', 'https://avatar.com/clara.png', 'ACTIVE', 'USER'),
('SketchVibe', 'sketch.vibe@example.com', 'DrawEasy456', 'Vince Sketch', 'Urban sketcher capturing city life', 'https://avatar.com/vince.png', 'ACTIVE', 'USER'),
('CanvasDreamer', 'dream.canvas@example.com', 'ColorMix789', 'Lila Canvas', 'Abstract painter dreaming in colors', 'https://avatar.com/lila.png', 'ACTIVE', 'MODERATOR'),
('MuralMagic', 'mural.magic@example.com', 'ArtWall101', 'Max Mural', 'Street artist transforming walls', 'https://avatar.com/max.png', 'ACTIVE', 'USER'),
('ClayCrafter', 'clay.craft@example.com', 'SculptPro202', 'Emma Clay', 'Ceramic sculptor shaping emotions', 'https://avatar.com/emma.png', 'DEACTIVATED', 'USER'),
('InkSorcerer', 'ink.sorcery@example.com', 'TattooInk303', 'Theo Ink', 'Tattoo artist with a flair for fantasy', 'https://avatar.com/theo.png', 'ACTIVE', 'ADMIN'),
('PixelPainter', 'pixel.art@example.com', 'DigitalBrush404', 'Nora Pixel', 'Digital illustrator crafting pixel perfection', 'https://avatar.com/nora.png', 'ACTIVE', 'USER'),
('GraffitiGlow', 'glow.graffiti@example.com', 'SprayCan505', 'Jade Glow', 'Graffiti artist lighting up the streets', 'https://avatar.com/jade.png', 'BANNED', 'USER'),
('PastelPoet', 'pastel.poet@example.com', 'SoftHue606', 'Eli Pastel', 'Pastel artist blending poetry and color', 'https://avatar.com/eli.png', 'ACTIVE', 'USER'),
('MosaicMuse', 'mosaic.muse@example.com', 'TileArt707', 'Zoe Mosaic', 'Mosaic creator telling stories in tiles', 'https://avatar.com/zoe.png', 'ACTIVE', 'MODERATOR');

