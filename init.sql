drop database if exists coras;
create database coras;

drop user if exists coras;
create user coras with password '1234';
grant all privileges on database coras to coras;
