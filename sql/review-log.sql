CREATE TABLE `Untitled` (

);

CREATE TABLE `리뷰 테이블` (
	`Key`	int	NOT NULL	DEFAULT auto_inc,
	`Field1`	text	NOT NULL	COMMENT '콘텐츠 제목',
	`Field2`	double	NOT NULL	COMMENT '해당 콘텐츠의 평점',
	`Field3`	text	NOT NULL	COMMENT '콘텐츠의 감상평',
	`Field5`	date	NOT NULL	DEFAULT now()	COMMENT '리뷰가 작성된 날짜',
	`Field6`	date	NOT NULL	DEFAULT now	COMMENT '콘텐츠 시청 날짜',
	`Field7`	char	NOT NULL	COMMENT '콘텐츠의 종류 ( book / movie )',
	`Field8`	text	NULL	COMMENT '표지 이미지의 url 주소',
	`Key2`	int	NOT NULL	DEFAULT auto_inc	COMMENT '사용자 식별용 고유번호'
);

CREATE TABLE `사용자 정보 테이블` (
	`Key`	int	NOT NULL	DEFAULT auto_inc	COMMENT '사용자 식별용 고유번호',
	`Field1`	varchar(20)	NOT NULL	DEFAULT unique	COMMENT '사용자 아이디(중복불가)',
	`Field2`	varchar(255)	NOT NULL	COMMENT '사용자 비밀번호(해시값저장)',
	`Field3`	varchar(20)	NOT NULL	DEFAULT unique	COMMENT '사용자 닉네임(중복불가)',
	`Field4`	timestamp	NOT NULL	DEFAULT now()	COMMENT '계정 생성 일시'
);

CREATE TABLE `리뷰-태그 중간 테이블` (
	`Key`	int	NOT NULL,
	`Key2`	int	NOT NULL	DEFAULT auto_inc	COMMENT '태그Id',
	`Key3`	int	NOT NULL	DEFAULT auto_inc	COMMENT '리뷰 id'
);

CREATE TABLE `태그 정보 테이블` (
	`Key`	int	NOT NULL	DEFAULT auto_inc,
	`Field`	varchar(50)	NOT NULL	COMMENT '태그 이름',
	`Field2`	varchar(50)	NOT NULL	COMMENT '태그 종류 ( genre / mood / feature )'
);

ALTER TABLE `리뷰 테이블` ADD CONSTRAINT `PK_리뷰 테이블` PRIMARY KEY (
	`Key`
);

ALTER TABLE `사용자 정보 테이블` ADD CONSTRAINT `PK_사용자 정보 테이블` PRIMARY KEY (
	`Key`
);

ALTER TABLE `리뷰-태그 중간 테이블` ADD CONSTRAINT `PK_리뷰-태그 중간 테이블` PRIMARY KEY (
	`Key`
);

ALTER TABLE `태그 정보 테이블` ADD CONSTRAINT `PK_태그 정보 테이블` PRIMARY KEY (
	`Key`
);

