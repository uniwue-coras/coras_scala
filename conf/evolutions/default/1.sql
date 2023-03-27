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
  id    int         not null auto_increment primary key,
  title varchar(50) not null unique,
  text  text        not null
);

create table if not exists sample_solution_nodes (
  exercise_id   integer     not null references exercises (id) on update cascade on delete cascade,
  id            integer     not null,

  child_index   integer     not null,
  is_subtext    boolean     not null default false,
  text          text        not null,
  applicability varchar(20) not null,

  parent_id     integer,

  primary key (exercise_id, id),
  foreign key (exercise_id, parent_id) references sample_solution_nodes (exercise_id, id) on update cascade on delete cascade
);

-- user solutions

create table if not exists user_solutions (
  -- can't enforce foreign key since users don't have to be registered yet...
  username          varchar(100)                            not null,
  exercise_id       integer                                 not null references exercises (id) on update cascade on delete cascade,

  correction_status enum ('Waiting', 'Ongoing', 'Finished') not null default 'Waiting',

  primary key (username, exercise_id)
);

create table if not exists user_solution_nodes (
  username      varchar(100) not null,
  exercise_id   integer      not null,
  id            integer      not null,

  child_index   integer      not null,
  is_subtext    boolean      not null default false,
  text          text         not null,
  applicability varchar(20)  not null,

  parent_id     integer,

  primary key (username, exercise_id, id),
  foreign key (username, exercise_id) references user_solutions (username, exercise_id) on update cascade on delete cascade,
  foreign key (username, exercise_id, parent_id) references user_solution_nodes (username, exercise_id, id) on update cascade on delete cascade
);

-- correction

create table if not exists solution_node_matches (
  username        varchar(100)                              not null,
  exercise_id     integer                                   not null,
  sample_node_id  integer                                   not null,
  user_node_id    integer                                   not null,
  match_status    enum ('Automatic', 'Confirmed', 'Manual') not null default 'Automatic',
  maybe_certainty float,

  primary key (exercise_id, username, sample_node_id, user_node_id),
  foreign key (exercise_id, sample_node_id) references sample_solution_nodes (exercise_id, id) on update cascade on delete cascade,
  foreign key (username, exercise_id, user_node_id) references user_solution_nodes (username, exercise_id, id) on update cascade on delete cascade
);

create table if not exists user_solution_node_annotations (
  username     varchar(100)              not null,
  exercise_id  integer                   not null,
  user_node_id integer                   not null,
  id           integer                   not null,

  error_type   enum ('Missing', 'Wrong') not null,
  start_index  integer                   not null,
  end_index    integer                   not null,
  text         text                      not null,

  primary key (username, exercise_id, user_node_id, id),
  foreign key (username, exercise_id, user_node_id) references user_solution_nodes (username, exercise_id, id) on update cascade on delete cascade
);

-- initial values

insert into users(username, maybe_pw_hash, rights)
values ('admin', '$2a$10$X.tcQam1cP1wjhWxh/31RO02JKLZJS9l7eqdWLf0ss5SMub/TpzjC', 'Admin');

-- !Downs

drop table if exists
  user_solution_node_annotations,
  solution_node_matches,
  user_solution_nodes,
  user_solutions,
  sample_solution_nodes,
  exercises,
  antonyms,
  abbreviations,
  users;
