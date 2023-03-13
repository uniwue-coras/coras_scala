drop user if exists coras;
create user coras identified by '1234';

drop database if exists coras;
create database coras;

grant all privileges on coras.* to coras;
flush privileges;
