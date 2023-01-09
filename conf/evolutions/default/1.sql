-- !Ups

-- users

create table if not exists users (
  username      varchar(100) not null primary key,
  maybe_pw_hash varchar(100),
  rights        varchar(10)  not null default 'Student'
);

-- correction helpers: abbreviations, synonyms, antonyms, ...

create table if not exists abbreviations (
  abbreviation varchar(10) not null primary key,
  real_text    varchar(50) not null
);

create table if not exists antonyms (
  positive varchar(50) not null,
  negative varchar(50) not null,

  primary key (positive, negative)
);

-- exercises

create table if not exists exercises (
  id    serial      not null primary key,
  title varchar(50) not null unique,
  text  text        not null
);

create table if not exists sample_solution_entries (
  exercise_id   integer     not null references exercises (id) on update cascade on delete cascade,
  id            integer     not null,
  child_index   integer     not null,
  parent_id     integer,
  text          text        not null,
  applicability varchar(20) not null,
  sub_text      text,

  primary key (exercise_id, id),
  foreign key (exercise_id, parent_id) references sample_solution_entries (exercise_id, id) on update cascade on delete cascade
);

-- user solutions

create table if not exists user_solution_entries (
  -- TODO: can't enforce foreign key since users doesn't have to be registered yet...
  username      varchar(100) not null, -- references users (username) on update cascade on delete cascade,
  exercise_id   integer      not null references exercises (id) on update cascade on delete cascade,
  id            integer      not null,
  child_index   integer      not null,
  text          text         not null,
  applicability varchar(20)  not null,
  sub_text      text,
  parent_id     integer,

  primary key (username, exercise_id, id),
  foreign key (username, exercise_id, parent_id) references user_solution_entries (username, exercise_id, id) on update cascade on delete cascade
);

create table if not exists solution_entry_matches (
  username        varchar(100) not null,
  exercise_id     integer      not null,
  sample_entry_id integer      not null,
  user_entry_id   integer      not null,
  maybe_certainty float,

  primary key (exercise_id, username, sample_entry_id, user_entry_id),
  foreign key (exercise_id, sample_entry_id) references sample_solution_entries (exercise_id, id) on update cascade on delete cascade,
  foreign key (username, exercise_id, user_entry_id) references user_solution_entries (username, exercise_id, id) on update cascade on delete cascade
);

-- initial values

insert into users(username, maybe_pw_hash, rights)
values ('admin', '$2a$10$X.tcQam1cP1wjhWxh/31RO02JKLZJS9l7eqdWLf0ss5SMub/TpzjC', 'Admin');

-- !Downs

drop table if exists
  solution_entry_matches,
  user_solution_entries,
  sample_solution_entries,
  exercises,
  antonyms,
  abbreviations,
  users;
