-- ============================================
-- StyleMatch Database DDL
-- Database untuk Aplikasi Rekomendasi Outfit
-- ============================================

-- Buat Database
CREATE DATABASE IF NOT EXISTS stylematch;
USE stylematch;

-- ============================================
-- 1. Tabel Users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. Tabel Tops (Pakaian Atasan)
-- ============================================
CREATE TABLE IF NOT EXISTS tops (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  brand VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. Tabel Bottoms (Pakaian Bawahan)
-- ============================================
CREATE TABLE IF NOT EXISTS bottoms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  brand VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. Tabel Outfits (Kombinasi Outfit)
-- ============================================
CREATE TABLE IF NOT EXISTS outfits (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  style VARCHAR(50),
  image_url VARCHAR(255),
  top_id INT,
  bottom_id INT,
  min_weight DECIMAL(5,2),
  max_weight DECIMAL(5,2),
  min_height DECIMAL(5,2),
  max_height DECIMAL(5,2),
  weather_type ENUM('sunny', 'cloudy', 'rainy', 'windy'),
  min_temperature DECIMAL(5,2),
  max_temperature DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (top_id) REFERENCES tops(id) ON DELETE SET NULL,
  FOREIGN KEY (bottom_id) REFERENCES bottoms(id) ON DELETE SET NULL,
  INDEX idx_weather (weather_type),
  INDEX idx_weight (min_weight, max_weight),
  INDEX idx_height (min_height, max_height),
  INDEX idx_temperature (min_temperature, max_temperature)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. Tabel Outfit Ratings
-- ============================================
CREATE TABLE IF NOT EXISTS outfit_ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  outfit_id INT NOT NULL,
  user_id INT,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (outfit_id) REFERENCES outfits(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_outfit_id (outfit_id),
  INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. Tabel Outfit Likes
-- ============================================
CREATE TABLE IF NOT EXISTS outfit_likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  outfit_id INT NOT NULL,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (outfit_id) REFERENCES outfits(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_outfit_id (outfit_id),
  UNIQUE KEY unique_user_outfit_like (user_id, outfit_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. Tabel Reviews
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  outfits_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (outfits_id) REFERENCES outfits(id) ON DELETE CASCADE,
  INDEX idx_outfits_id (outfits_id),
  INDEX idx_rating (rating),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. Tabel Saved Outfits
-- ============================================
CREATE TABLE IF NOT EXISTS saved_outfits (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  description TEXT,
  top_id INT,
  bottom_id INT,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (top_id) REFERENCES tops(id) ON DELETE SET NULL,
  FOREIGN KEY (bottom_id) REFERENCES bottoms(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. Tabel Favourites (untuk tracking favourites)
-- ============================================
CREATE TABLE IF NOT EXISTS favourites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  outfit_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (outfit_id) REFERENCES outfits(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_outfit_fav (user_id, outfit_id),
  INDEX idx_user_id (user_id),
  INDEX idx_outfit_id (outfit_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VIEWS untuk Query yang Sering Digunakan
-- ============================================

-- View untuk Outfit dengan Rating dan Likes
CREATE OR REPLACE VIEW v_outfits_with_stats AS
SELECT 
  o.*,
  COALESCE(AVG(r.rating), 0) as avg_rating,
  COUNT(DISTINCT r.id) as rating_count,
  COUNT(DISTINCT l.id) as likes_count,
  t.name as top_name,
  t.image_url as top_image,
  t.category as top_category,
  b.name as bottom_name,
  b.image_url as bottom_image,
  b.category as bottom_category
FROM outfits o
LEFT JOIN outfit_ratings r ON o.id = r.outfit_id
LEFT JOIN outfit_likes l ON o.id = l.outfit_id
LEFT JOIN tops t ON o.top_id = t.id
LEFT JOIN bottoms b ON o.bottom_id = b.id
GROUP BY o.id;

-- View untuk Saved Outfits dengan Detail
CREATE OR REPLACE VIEW v_saved_outfits_detail AS
SELECT 
  so.id,
  so.name,
  so.description,
  so.user_id,
  so.created_at,
  t.id as top_id,
  t.name as top_name,
  t.image_url as top_image_url,
  t.category as top_category,
  b.id as bottom_id,
  b.name as bottom_name,
  b.image_url as bottom_image_url,
  b.category as bottom_category
FROM saved_outfits so
LEFT JOIN tops t ON so.top_id = t.id
LEFT JOIN bottoms b ON so.bottom_id = b.id;

-- ============================================
-- SHOW DATABASE STRUCTURE
-- ============================================
SHOW TABLES;

INSERT INTO tops (name, category, image_url) 
VALUES 
('Dark Business Blazer', 'Business', 'assets/images/tops/TopBusiness.png'),
('Maroon Knit Cardigan', 'Casual', 'assets/images/tops/TopCasual-1.jpg'),
('Light Blue Linen Shirt', 'Casual', 'assets/images/tops/TopCasual-2.jpg'),
('Brown V-Neck Sweater', 'Casual', 'assets/images/tops/TopCasual-3.jpg'),
('Plaid Flannel Shirt', 'College', 'assets/images/tops/TopCollege.png'),
('Black Minimalist Blazer', 'Minimalist', 'assets/images/tops/TopMinimalis.png'),
('Navy V-Neck Jersey', 'Sporty', 'assets/images/tops/TopSporty-1.png'),
('Black Football Jersey', 'Sporty', 'assets/images/tops/TopSporty-2.png');

INSERT INTO bottoms (name, category, image_url) 
VALUES 
('Black Cargo Pants', 'Business', 'assets/images/bottoms/BottomBusiness.png'),
('White Wide-Leg Pants', 'Casual', 'assets/images/bottoms/BottomCasual-1.jpg'),
('Black Wide-Leg Jeans', 'Casual', 'assets/images/bottoms/BottomCasual-2.jpg'),
('Light Wash Baggy Jeans', 'Casual', 'assets/images/bottoms/BottomCasual-3.jpg'),
('Dark Wash Skinny Jeans', 'College', 'assets/images/bottoms/BottomCollege.png'),
('Khaki Chino Pants', 'Minimalist', 'assets/images/bottoms/BottomMinimalist.png'),
('Black Jogger Sweatpants', 'Sporty', 'assets/images/bottoms/BottomSporty-1.png'),
('Adidas Wide-Leg Pants', 'Sporty', 'assets/images/bottoms/BottomSporty-2.png');

INSERT INTO outfits 
(title, description, image_url, top_id, bottom_id, style, min_weight, max_weight, min_height, max_height, weather_type, min_temperature, max_temperature) 
VALUES
(
  'Business Casual Look', 
  'Paduan blazer formal dengan celana jeans hitam wide-leg yang modern. Cocok untuk meeting santai atau kerja di hari Jumat.', 
  'assets/images/business_casual.jpg', 
  1, 3, 'Business', 
  60, 90, 165, 190, 
  'cloudy', 20, 28
),
(
  'Sunny Day Casual', 
  'Outfit santai yang ringan dan sejuk dengan kemeja linen dan celana putih. Sempurna untuk hari yang cerah dan panas.', 
  'assets/images/casual_look.jpg', 
  3, 2, 'Casual', 
  50, 80, 160, 180, 
  'sunny', 25, 35
),
(
  'Campus Style', 
  'Gaya klasik anak kuliahan dengan flanel dan jeans. Nyaman dan hangat, cocok untuk hari berangin di kampus.', 
  'assets/images/college.jpg', 
  5, 5, 'College', 
  45, 70, 150, 170, 
  'windy', 15, 25
),
(
  'Elegant Chic', 
  'Tampil elegan dengan paduan sweater V-neck dan jeans longgar. Memberikan kesan santai namun tetap berkelas.', 
  'assets/images/elegant_chic.jpg', 
  4, 4, 'Chic', 
  50, 75, 155, 175, 
  'cloudy', 18, 26
),
(
  'Minimalist Professional', 
  'Tampilan bersih dan profesional dengan blazer minimalis dan celana chino. Pilihan tepat untuk tampil rapi tanpa berlebihan.', 
  'assets/images/minimalist.jpg', 
  6, 6, 'Minimalist', 
  55, 85, 165, 185, 
  'rainy', 22, 30
),
(
  'Active Sporty Vibe', 
  'Kombinasi jersey sporty dengan celana training yang nyaman. Ideal untuk olahraga ringan atau sekadar tampil sporty.', 
  'assets/images/sporty.jpg', 
  7, 8, 'Sporty', 
  45, 75, 155, 175, 
  'cloudy', 18, 28
),
(
  'Street Style Look', 
  'Gaya street wear yang nyaman dengan jersey bola dan jogger pants. Sempurna untuk jalan-jalan santai.', 
  'assets/images/street_style.jpg', 
  8, 7, 'Street', 
  50, 85, 160, 185, 
  'sunny', 24, 32
);

ALTER TABLE tops
ADD COLUMN gender ENUM('Male', 'Female', 'Unisex') DEFAULT 'Unisex';

ALTER TABLE bottoms
ADD COLUMN gender ENUM('Male', 'Female', 'Unisex') DEFAULT 'Unisex';

UPDATE tops SET gender = 'Male' WHERE id IN (1, 5, 7);
UPDATE tops SET gender = 'Female' WHERE id IN (2, 3, 4, 6);
UPDATE tops SET gender = 'Unisex' WHERE id IN (8);

UPDATE bottoms SET gender = 'Male' WHERE id IN (1, 6, 7);
UPDATE bottoms SET gender = 'Female' WHERE id IN (2, 3, 4, 8);
UPDATE bottoms SET gender = 'Unisex' WHERE id IN (5);