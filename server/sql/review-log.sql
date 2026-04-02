CREATE DATABASE IF NOT review_log_db;
USE review_log_db;

CREATE TABLE `user_table` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '사용자 식별용 고유번호',
  `username` varchar(20) NOT NULL UNIQUE COMMENT '사용자 아이디(중복불가)',
  `password` varchar(255) NOT NULL COMMENT '사용자 비밀번호(해시값저장)',
  `nickname` varchar(20) NOT NULL UNIQUE COMMENT '사용자 닉네임(중복불가)',
  `createdAt` datetime  DEFAULT CURRENT_TIMESTAMP COMMENT '계정 생성 일시',
  `refreshToken` varchar(512)  DEFAULT NULL COMMENT'JWT refresh token 보관용',
  PRIMARY KEY (`id`)
);

CREATE TABLE `review_Table` (
  `id` int NOT NULL AUTO_INCREMENT ,
  `title` text NOT NULL COMMENT '콘텐츠 제목',
  `score` DECIMAL(2,1) NOT NULL COMMENT '해당 콘텐츠의 평점',
  `content` text NOT NULL COMMENT '콘텐츠의 감상평',
  `write_date` date NOT NULL DEFAULT (CURRENT_DATE) COMMENT '리뷰가 작성된 날짜',
  `watch_date` date NOT NULL COMMENT '콘텐츠 시청 날짜',
  `type` char(10) NOT NULL COMMENT '콘텐츠의 종류 ( book / movie )',
  `content_image` text NULL COMMENT '표지 이미지의 url 주소',
  `user_id` int NOT NULL COMMENT '사용자 식별용 고유번호',
  PRIMARY KEY (`id`),
  CONSTRAINT chk_review_score CHECK (score >= 0.0 AND score <= 5.0),
  CONSTRAINT fk_review_user FOREIGN KEY (`user_id`) REFERENCES `user_table`(`id`)
);

CREATE TABLE `tag_Table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tagname` varchar(50) NOT NULL COMMENT '태그 이름',
  `type` varchar(50) NOT NULL COMMENT '태그 종류 ( genre / mood )',
  PRIMARY KEY (`id`),
  CONSTRAINT uq_tag_type_name UNIQUE (`type`,`tagname`)
);

INSERT INTO `tag_Table` (`tagname`, `type`) VALUES
-- 장르 태그
('SF', 'genre'), ('로맨스', 'genre'), ('스릴러', 'genre'), ('드라마', 'genre'),
('공포', 'genre'), ('액션', 'genre'), ('판타지', 'genre'), ('예술', 'genre'),
('코미디', 'genre'), ('인문', 'genre'), ('자기계발', 'genre'), ('추리', 'genre'),
('미스터리','genre'), ('에세이','genre'), ('스토리','genre'), ('스포츠','genre'),
('애니메이션','genre'),

-- 분위기 태그  
('잔잔한', 'mood'), ('몽환적인', 'mood'), ('유쾌한', 'mood'), ('무거운', 'mood'),
('우울한', 'mood'), ('신나는', 'mood'), ('속도감 있는', 'mood'), ('무서운', 'mood'),
('흥미진진한', 'mood'), ('따듯한', 'mood'), ('어두운', 'mood'), ('청량한', 'mood'),
('서정적인','mood'), ('유익한','mood'), ('현실적인','mood'), ('철학적인','mood'), 
('여운이 남는','mood'), ('애절한','mood'), ('감동적인','mood');

CREATE TABLE `reviewTag_Table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tag_id` int NOT NULL COMMENT '태그Id',
  `review_id` int NOT NULL COMMENT '리뷰 id',
  PRIMARY KEY (`id`),
  CONSTRAINT uq_review_tag UNIQUE (`review_id`, `tag_id`),
  CONSTRAINT fk_reviewtag_tag FOREIGN KEY (`tag_id`) REFERENCES `tag_Table`(`id`),
  CONSTRAINT fk_reviewtag_review FOREIGN KEY (`review_id`) REFERENCES `review_Table`(`id`)
);

