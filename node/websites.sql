-- SET NAMES utf8;
-- SET FOREIGN_KEY_CHECKS = 0;
--  Table structure for `websites`
DROP TABLE IF EXISTS `websites`;

CREATE TABLE `websites` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` char(20) NOT NULL DEFAULT '' COMMENT '站点名称',
    `url` varchar(255) NOT NULL DEFAULT '',
    `alexa` int(11) NOT NULL DEFAULT '0' COMMENT 'Alexa 排名',
    `country` char(10) NOT NULL DEFAULT '' COMMENT '国家',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8;

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user`(
    `id` BIGINT(10) NOT NULL AUTO_INCREMENT,
    `user_id` CHAR(20) NOT NULL DEFAULT '' COMMENT '用户账户id',
    `user_name` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '用户名称',
    `password` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '用户密码',
    `role_code` CHAR(30) NOT NULL DEFAULT '' COMMENT '用户分配的角色code',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '是否启用',
    `update_time` DATETIME COMMENT '修改日期',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `role_code` CHAR(30) NOT NULL DEFAULT '' COMMENT '角色code',
    `role_name` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '角色名称',
    `description` VARCHAR(30)  COMMENT '角色描述',
    `update_time` DATETIME COMMENT '修改日期',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;


DROP TABLE IF EXISTS `files`;
CREATE TABLE IF NOT EXISTS `files`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `filename` CHAR(30) NOT NULL DEFAULT '' COMMENT '文件名',
    `filepath` VARCHAR(255) NOT NULL DEFAULT '' COMMENT '存储路径',
    `description` VARCHAR(30)  COMMENT '描述',
    `update_time` DATETIME COMMENT '修改日期',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;


BEGIN;


INSERT INTO    `websites` VALUES 
    ('1', 'Google', 'https://www.google.cm/',   '1',   'USA'),
    ('2', '淘宝',   'https://www.taobao.com/',  '13',   'CN'),
    ('3', '菜鸟',   'http://www.runoob.com/',   '4689', 'CN'),
    ('4', '微博',   'http://weibo.com/'      ,  '20',   'CN'),
    ('5', 'Fook',   'https://www.facebook.com/','3',   'USA');


INSERT INTO `role` VALUES ('1','admin','管理员','拥有所有权限','2022-01-01 10:00:00'), ('2','staff','员工','拥有部分权限','2022-01-01 10:00:00');
INSERT INTO `user` VALUES ( 1 , 'zbx' ,'zheng','zbx12345','admin',1,'2022-01-01 10:00:00' ),( 2 , 'youke' ,'游客','123456','user',1 ,'2022-01-01 10:00:00');

COMMIT;