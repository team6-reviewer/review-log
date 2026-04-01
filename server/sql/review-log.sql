CREATE TABLE `review_Table` (
  `id` int NOT NULL AUTO_INCREMENT ,
  `title` text NOT NULL COMMENT '콘텐츠 제목',
  `score` double NOT NULL COMMENT '해당 콘텐츠의 평점',
  `content` text NOT NULL COMMENT '콘텐츠의 감상평',
  `write_date` date NOT NULL DEFAULT (CURRENT_DATE) COMMENT '리뷰가 작성된 날짜',
  `watch_date` date NOT NULL COMMENT '콘텐츠 시청 날짜',
  `type` char(10) NOT NULL COMMENT '콘텐츠의 종류 ( book / movie )',
  `content_image` text NULL COMMENT '표지 이미지의 url 주소',
  `user_id` int NOT NULL COMMENT '사용자 식별용 고유번호',
  PRIMARY KEY (`id`)
);

CREATE TABLE `user_Table` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '사용자 식별용 고유번호',
  `username` varchar(20) NOT NULL COMMENT '사용자 아이디(중복불가)',
  `password` varchar(255) NOT NULL COMMENT '사용자 비밀번호(해시값저장)',
  `nickname` varchar(20) NOT NULL COMMENT '사용자 닉네임(중복불가)',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '계정 생성 일시',
  PRIMARY KEY (`id`)
);

CREATE TABLE `reviewTag_Table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tag_id` int NOT NULL COMMENT '태그Id',
  `review_id` int NOT NULL COMMENT '리뷰 id',
  PRIMARY KEY (`id`)
);

CREATE TABLE `tag_Table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tagname` varchar(50) NOT NULL COMMENT '태그 이름',
  `type` varchar(50) NOT NULL COMMENT '태그 종류 ( genre / mood )',
  PRIMARY KEY (`id`)
);