CREATE TABLE `review_Table` (
	`id`	int	NOT NULL	DEFAULT auto_inc,
	`title`	text	NOT NULL	COMMENT '콘텐츠 제목',
	`score`	double	NOT NULL	COMMENT '해당 콘텐츠의 평점',
	`content`	text	NOT NULL	COMMENT '콘텐츠의 감상평',
	`write_date`	date	NOT NULL	DEFAULT now	COMMENT '리뷰가 작성된 날짜',
	`watch_date`	date	NOT NULL	COMMENT '콘텐츠 시청 날짜',
	`type`	char	NOT NULL	COMMENT '콘텐츠의 종류 ( book / movie )',
	`content_image`	text	NULL	COMMENT '표지 이미지의 url 주소',
	`user_id`	int	NOT NULL	DEFAULT auto_inc	COMMENT '사용자 식별용 고유번호'
);

CREATE TABLE `user_Table` (
	`id`	int	NOT NULL	DEFAULT auto_inc	COMMENT '사용자 식별용 고유번호',
	`username`	varchar(20)	NOT NULL	COMMENT '사용자 아이디(중복불가)',
	`password`	varchar(255)	NOT NULL	COMMENT '사용자 비밀번호(해시값저장)',
	`nickname`	varchar(20)	NOT NULL	COMMENT '사용자 닉네임(중복불가)',
	`createdAt`	timestamp	NOT NULL	DEFAULT now()	COMMENT '계정 생성 일시'
);

CREATE TABLE `reviewTag_Table` (
	`id`	int	NOT NULL,
	`tag_id`	int	NOT NULL	DEFAULT auto_inc	COMMENT '태그Id',
	`review_id`	int	NOT NULL	DEFAULT auto_inc	COMMENT '리뷰 id'
);

CREATE TABLE `tag_Table` (
	`id`	int	NOT NULL	DEFAULT auto_inc,
	`tagname`	varchar(50)	NOT NULL	COMMENT '태그 이름',
	`type`	varchar(50)	NOT NULL	COMMENT '태그 종류 ( genre / mood / feature )'
);

ALTER TABLE `review_Table` ADD CONSTRAINT `PK_REVIEW_TABLE` PRIMARY KEY (
	`id`
);

ALTER TABLE `user_Table` ADD CONSTRAINT `PK_USER_TABLE` PRIMARY KEY (
	`id`
);

ALTER TABLE `reviewTag_Table` ADD CONSTRAINT `PK_REVIEWTAG_TABLE` PRIMARY KEY (
	`id`
);

ALTER TABLE `tag_Table` ADD CONSTRAINT `PK_TAG_TABLE` PRIMARY KEY (
	`id`
);

