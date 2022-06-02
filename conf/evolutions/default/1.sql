-- !Ups

create type rights_type as enum ('student', 'corrector', 'admin');

create cast (character varying as rights_type) with inout as assignment;

create type applicability_type as enum ('NotSpecified', 'NotApplicable', 'Applicable');

create cast (character varying as applicability_type) with inout as assignment;


create table if not exists users (
  username      varchar(100) primary key,
  maybe_pw_hash varchar(100),
  rights        rights_type not null default 'student',
  name          varchar(200)
);

create table if not exists exercises (
  id    serial primary key,
  title varchar(50) unique not null,
  text  text               not null
);

-- sample solutions

create table if not exists sample_solution_entries (
  exercise_id   integer references exercises (id) on update cascade on delete cascade,
  id            integer,

  entry_text    text               not null,
  applicability applicability_type not null,

  parent_id     integer,

  primary key (exercise_id, id),
  foreign key (exercise_id, parent_id) references sample_solution_entries (exercise_id, id) on update cascade on delete cascade
);

create table if not exists sample_solution_entry_sub_texts (
  exercise_id   integer,
  entry_id      integer,
  id            integer,

  entry_text    text               not null,
  applicability applicability_type not null,

  primary key (exercise_id, entry_id, id),
  foreign key (exercise_id, entry_id) references sample_solution_entries (exercise_id, id) on update cascade on delete cascade
);

-- user solutions

create table if not exists user_solution_entries (
  username      varchar(100)       not null references users (username) on update cascade on delete cascade,
  exercise_id   integer            not null references exercises (id) on update cascade on delete cascade,
  id            integer            not null,

  entry_text    text               not null,
  applicability applicability_type not null,

  parent_id     integer,

  primary key (username, exercise_id, id),
  foreign key (username, exercise_id, parent_id) references user_solution_entries (username, exercise_id, id) on update cascade on delete cascade
);

create table if not exists user_solution_entry_sub_texts (
  username      varchar(100)       not null,
  exercise_id   integer            not null,
  entry_id      integer            not null,
  id            integer            not null,

  entry_text    text               not null,
  applicability applicability_type not null,

  primary key (username, exercise_id, entry_id, id),
  foreign key (username, exercise_id, entry_id) references user_solution_entries (username, exercise_id, id) on update cascade on delete cascade
);

-- correction data

create table if not exists solution_entry_matches (
  username        varchar(100) not null,
  exercise_id     integer      not null,
  sample_entry_id integer      not null,
  user_entry_id   integer      not null,

  primary key (username, exercise_id, sample_entry_id, user_entry_id),
  foreign key (exercise_id, sample_entry_id) references sample_solution_entries (exercise_id, id) on update cascade on delete cascade,
  foreign key (username, exercise_id, user_entry_id) references user_solution_entries (username, exercise_id, id) on update cascade on delete cascade
);

create table if not exists user_solution_entry_comments (
  username        varchar(100) not null ,
  exercise_id     integer not null ,
  sample_entry_id integer not null ,
  user_entry_id   integer not null ,

  start_index     integer not null,
  end_index       integer not null,
  entry_comment   text    not null,

  primary key (username, exercise_id, sample_entry_id, user_entry_id, start_index, end_index),

  foreign key (exercise_id, sample_entry_id) references sample_solution_entries (exercise_id, id) on update cascade on delete cascade,
  foreign key (username, exercise_id, user_entry_id) references user_solution_entries (username, exercise_id, id) on update cascade on delete cascade
);

-- grant privileges

grant select, update, insert, delete on all tables in schema public to coras;

grant select, usage on all sequences in schema public to coras;

-- initial values

insert into users(username, maybe_pw_hash, rights)
values ('admin', '$2a$10$X.tcQam1cP1wjhWxh/31RO02JKLZJS9l7eqdWLf0ss5SMub/TpzjC', 'admin');

-- !Downs


drop table if exists user_solution_entry_comments;

drop table if exists solution_entry_matches;

drop table if exists user_solution_entry_sub_texts;

drop table if exists user_solution_entries;


drop table if exists sample_solution_entry_sub_texts;

drop table if exists sample_solution_entries;


drop table if exists exercises;

drop table if exists users;


drop cast if exists (character varying as applicability_type);

drop type if exists applicability_type;

drop cast if exists (character varying as rights_type);

drop type if exists rights_type;

