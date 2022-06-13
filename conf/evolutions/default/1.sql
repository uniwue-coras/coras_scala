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
  id    serial      not null primary key,
  title varchar(50) not null unique,
  text  text        not null
);

-- sample solutions

create table if not exists sample_solution_nodes (
  exercise_id   integer            not null references exercises (id) on update cascade on delete cascade,
  id            integer            not null,

  node_text     text               not null,
  applicability applicability_type not null,

  parent_id     integer,

  primary key (exercise_id, id),
  foreign key (exercise_id, parent_id) references sample_solution_nodes (exercise_id, id) on update cascade on delete cascade
);

create table if not exists sample_solution_node_sub_texts (
  exercise_id   integer            not null,
  node_id       integer            not null,
  id            integer            not null,

  node_text     text               not null,
  applicability applicability_type not null,

  primary key (exercise_id, node_id, id),
  foreign key (exercise_id, node_id) references sample_solution_nodes (exercise_id, id) on update cascade on delete cascade
);

-- user solutions

create table if not exists user_solution_nodes (
  username      varchar(100)       not null references users (username) on update cascade on delete cascade,
  exercise_id   integer            not null references exercises (id) on update cascade on delete cascade,
  id            integer            not null,

  node_text     text               not null,
  applicability applicability_type not null,

  parent_id     integer,

  primary key (username, exercise_id, id),
  foreign key (username, exercise_id, parent_id) references user_solution_nodes (username, exercise_id, id) on update cascade on delete cascade
);

create table if not exists user_solution_node_sub_texts (
  username      varchar(100)       not null,
  exercise_id   integer            not null,
  node_id       integer            not null,
  id            integer            not null,

  node_text     text               not null,
  applicability applicability_type not null,

  primary key (username, exercise_id, node_id, id),
  foreign key (username, exercise_id, node_id) references user_solution_nodes (username, exercise_id, id) on update cascade on delete cascade
);

-- correction data

create table if not exists solution_node_matches (
  username       varchar(100) not null,
  exercise_id    integer      not null,
  id             integer      not null,
  sample_node_id integer      not null,
  user_node_id   integer      not null,

  parent_id      integer,

  primary key (username, exercise_id, id),

  unique (username, exercise_id, sample_node_id, user_node_id),

  foreign key (username, exercise_id, parent_id) references solution_node_matches (username, exercise_id, id) on update cascade on delete cascade,

  foreign key (exercise_id, sample_node_id) references sample_solution_nodes (exercise_id, id) on update cascade on delete cascade,
  foreign key (username, exercise_id, user_node_id) references user_solution_nodes (username, exercise_id, id) on update cascade on delete cascade
);

create table if not exists user_solution_node_comments (
  username     varchar(100) not null,
  exercise_id  integer      not null,
  match_id     integer      not null,

  start_index  integer      not null,
  end_index    integer      not null,
  node_comment text         not null,

  primary key (username, exercise_id, match_id, start_index, end_index),
  foreign key (username, exercise_id, match_id) references solution_node_matches (username, exercise_id, id) on update cascade on delete cascade
);

-- grant privileges

grant select, update, insert, delete on all tables in schema public to coras;

grant select, usage on all sequences in schema public to coras;

-- initial values

insert into users(username, maybe_pw_hash, rights)
values ('admin', '$2a$10$X.tcQam1cP1wjhWxh/31RO02JKLZJS9l7eqdWLf0ss5SMub/TpzjC', 'admin');

-- !Downs


drop table if exists user_solution_node_comments;

drop table if exists solution_node_matches;

drop table if exists user_solution_node_sub_texts;

drop table if exists user_solution_nodes;


drop table if exists sample_solution_node_sub_texts;

drop table if exists sample_solution_nodes;


drop table if exists exercises;

drop table if exists users;


drop cast if exists (character varying as applicability_type);

drop type if exists applicability_type;

drop cast if exists (character varying as rights_type);

drop type if exists rights_type;

