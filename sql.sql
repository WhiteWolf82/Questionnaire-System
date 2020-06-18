create database questionnaire_system;
use questionnaire_system;

create table user(
	username varchar(20) primary key,
    password varchar(20) not null,
    email varchar(50) not null unique,
    phone varchar(50),
    sex boolean,
    info varchar(100)
);

create table questionnaire(
	username varchar(20) not null,
    naire_id varchar(50) not null primary key,
    naire_title varchar(100) not null,
    naire_info varchar(100),
    naire_status int not null,
    create_time datetime not null,
    start_time datetime not null,
    end_time datetime not null,
    write_type int not null,
    write_time int,
    is_star boolean,
    is_trash boolean,
    foreign key(username) references user(username)
);

create table question(
	question_id varchar(50) not null primary key,
    naire_id varchar(50) not null,
    question_type int not null,
    question_title varchar(100) not null,
    question_option varchar(1000),
    is_require boolean,
    add_order int not null auto_increment,
    foreign key(naire_id) references questionnaire(naire_id),
    key(add_order)
);

create table answer(
	username varchar(20),
    answer_id varchar(50) not null primary key,
    naire_id varchar(50) not null,
    question_id varchar(50) not null,
    answer_type int not null,
    answer_option varchar(1000),
    add_order int not null auto_increment,
    foreign key(naire_id) references questionnaire(naire_id),
    foreign key(question_id) references question(question_id),
    key(add_order)
);

create table answerinfo(
	ip_addr varchar(30) not null,
    naire_id varchar(50) not null,
    write_type int not null,
    answer_cnt int not null,
    foreign key(naire_id) references questionnaire(naire_id),
    primary key(ip_addr, naire_id)
);

set global event_scheduler = on;

delimiter //
create procedure updateStatus()
begin
	update questionnaire set naire_status = -1 where now() < start_time;
	update questionnaire set naire_status = 0 where now() >= start_time and now() < end_time;
	update questionnaire set naire_status = 1 where now() > end_time;
end//
delimiter ;

create event if not exists update_event
	on schedule every 30 second
    on completion preserve
    do call updateStatus();
    
create event if not exists update_answerinfo_event
	on schedule every 1 day
    do update answerinfo set answer_cnt = 0 where write_type <> 0