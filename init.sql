drop database if exists coras;
create database coras;

drop user if exists coras_admin;
drop user if exists coras;

create user coras_admin with password '1234';
create user coras with password '1234';

grant all privileges on database coras to coras_admin;
grant connect on database coras to coras;
