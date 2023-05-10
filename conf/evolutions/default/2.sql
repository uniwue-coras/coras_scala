-- !Ups

insert into users(username, maybe_pw_hash, rights)
values ('admin', '$2a$10$X.tcQam1cP1wjhWxh/31RO02JKLZJS9l7eqdWLf0ss5SMub/TpzjC', 'Admin')
on duplicate key update username = username;

insert into synonyms (group_id, value)
values (1, 'Sachentscheidungsvoraussetzungen'),
       (1, 'Zulässigkeit')
on duplicate key update value = value;

-- !Downs
