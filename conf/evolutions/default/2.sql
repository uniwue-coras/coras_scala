-- !Ups

insert into users(username, maybe_pw_hash, rights)
values ('admin', '$2a$10$X.tcQam1cP1wjhWxh/31RO02JKLZJS9l7eqdWLf0ss5SMub/TpzjC', 'Admin')
on duplicate key update username = username;

insert into related_words (group_id, value)
values (1, 'sachentscheidungsvoraussetzungen'),
       (1, 'zulässigkeit'),
       (2, 'vorverfahren'),
       (2, 'widerspruchsverfahren'),
       (3, 'beklagter'),
       (3, 'klagegegner')
on duplicate key update value = value;

insert into abbreviations (abbreviation, real_text)
values ('rw', 'rechtswidrigkeit'),
       ('vrw', 'verwaltungsrechtsweg'),
       ('ör', 'öffentlichrechtlich')
on duplicate key update real_text = values(real_text);

-- !Downs
