-- !Ups

create type rights_type as enum ('student', 'corrector', 'admin');

create type applicability_type as enum ('NotSpecified', 'NotApplicable', 'Applicable');


create table if not exists users (
  username      varchar(100) not null primary key,
  maybe_pw_hash varchar(100),
  rights        rights_type  not null default 'student'
);

create table if not exists exercises (
  id                   serial      not null primary key,
  title                varchar(50) not null unique,
  text                 text        not null,
  sample_solution_json jsonb[]     not null
);

/* TODO: preliminary table... */
create table if not exists user_solutions (
  exercise_id   int          not null references exercises (id) on update cascade on delete cascade,
  username      varchar(100) not null references users (username) on update cascade on delete cascade,

  solution_json jsonb[]      not null,

  primary key (exercise_id, username)
);

create table if not exists corrections (
  exercise_id     int          not null references exercises (id) on update cascade on delete cascade,
  username        varchar(100) not null references users (username) on update cascade on delete cascade,

  correction_json jsonb        not null,

  primary key (exercise_id, username)
);

create table if not exists sample_solution_entries (
  exercise_id     integer references exercises (id) on update cascade on delete cascade,
  id              integer,

  text            text               not null,

  applicability   applicability_type not null,
  weight          integer,
  priority_points integer,

  parent_id       integer,

  primary key (exercise_id, id),
  foreign key (exercise_id, parent_id) references sample_solution_entries (exercise_id, id) on update cascade on delete cascade
);

create table if not exists user_solution_entries (
  username        varchar(100)       not null references users (username) on update cascade on delete cascade,
  exercise_id     integer            not null references exercises (id) on update cascade on delete cascade,
  id              integer            not null,

  text            text               not null,

  applicability   applicability_type not null,
  weight          integer,
  priority_points integer,

  parent_id       integer,

  primary key (username, exercise_id, id),
  foreign key (username, exercise_id, parent_id) references user_solution_entries (username, exercise_id, id) on update cascade on delete cascade
);


-- grant privileges

grant select, update, insert, delete on all tables in schema public to coras;

grant select, usage on all sequences in schema public to coras;

-- initial values

insert into users(username, maybe_pw_hash, rights)
values ('admin', '$2a$10$X.tcQam1cP1wjhWxh/31RO02JKLZJS9l7eqdWLf0ss5SMub/TpzjC', 'admin');

-- !Downs

drop table if exists user_solution_entries;

drop table if exists sample_solution_entries;


drop table if exists corrections;

drop table if exists user_solutions;


drop table if exists exercises;

drop table if exists users;


drop type if exists applicability_type;

drop type if exists rights_type;
