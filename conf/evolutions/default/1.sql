-- !Ups

create type rights_type as enum ('student', 'corrector', 'admin');

create cast (character varying as rights_type) with inout as assignment;

create type applicability_type as enum ('not_specified', 'not_applicable', 'applicable');

create type paragraph_type as enum ('german', 'bavarian');


create table if not exists users (
  username      varchar(100) primary key,
  maybe_pw_hash varchar(100),
  rights        rights_type not null default 'student',
  name          varchar(200)
);

create table if not exists synonym_bags (
  bag_id integer,
  word   varchar(100),

  primary key (bag_id, word)
);

create table if not exists exercises (
  id     serial primary key,
  title  varchar(50) unique not null,
  author varchar(100)       references users (username) on update cascade on delete set null,
  text   text               not null
);

-- sample solutions

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

create table if not exists sample_solution_entry_sub_texts (
  exercise_id   integer,
  entry_id      integer,
  id            integer,

  text          text               not null,
  applicability applicability_type not null default 'not_specified',

  primary key (exercise_id, entry_id, id),
  foreign key (exercise_id, entry_id) references sample_solution_entries (exercise_id, id) on update cascade on delete cascade
);

create table if not exists sample_solution_entry_paragraph_citations (
  exercise_id    integer,
  entry_id       integer,
  id             integer,

  start_index    integer        not null,
  end_index      integer        not null,
  paragraph_type paragraph_type not null,
  paragraph      integer        not null,
  sub_paragraph  integer,
  sentence       integer,
  law_code       varchar(100),

  primary key (exercise_id, entry_id, id),
  foreign key (exercise_id, entry_id) references sample_solution_entries (exercise_id, id) on update cascade on delete cascade
);

-- user solutions

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

create table if not exists user_solution_entry_sub_texts (
  username      varchar(100),
  exercise_id   integer,
  entry_id      integer,
  id            integer,

  text          text               not null,
  applicability applicability_type not null default 'not_specified',

  primary key (username, exercise_id, entry_id, id),
  foreign key (username, exercise_id, entry_id) references user_solution_entries (username, exercise_id, id) on update cascade on delete cascade
);

create table if not exists user_solution_entry_paragraph_citations (
  username       varchar(100),
  exercise_id    integer,
  entry_id       integer,
  id             integer,

  start_index    integer        not null,
  end_index      integer        not null,
  paragraph_type paragraph_type not null,
  paragraph      integer        not null,
  sub_paragraph  integer,
  sentence       integer,
  law_code       varchar(100),

  primary key (username, exercise_id, entry_id, id),
  foreign key (username, exercise_id, entry_id) references user_solution_entries (username, exercise_id, id) on update cascade on delete cascade
);

-- correction data

create table if not exists entry_corrections (
  username              varchar(100),
  exercise_id           integer,
  sample_entry_id       integer,
  user_entry_id         integer,

  applicability_correct boolean not null,
  applicability_comment text,

  definition_comment    text,

  comment               text,

  primary key (username, exercise_id, sample_entry_id, user_entry_id),

  foreign key (exercise_id, sample_entry_id) references sample_solution_entries (exercise_id, id) on update cascade on delete cascade,
  foreign key (username, exercise_id, user_entry_id) references user_solution_entries (username, exercise_id, id) on update cascade on delete cascade
);

create table if not exists sub_text_corrections (
  username              varchar(100),
  exercise_id           integer,
  sample_entry_id       integer,
  sample_sub_text_id    integer,
  user_entry_id         integer,
  user_sub_text_id      integer,

  applicability_correct boolean not null,
  applicability_comment text,

  comment               text,

  primary key (username, exercise_id, sample_entry_id, sample_sub_text_id, user_entry_id, user_sub_text_id),
  -- correction entry exists
  foreign key (username, exercise_id, sample_entry_id, user_entry_id)
    references entry_corrections (username, exercise_id, sample_entry_id, user_entry_id)
    on update cascade on delete cascade,
  -- sample sub text exists
  foreign key (exercise_id, sample_entry_id, sample_sub_text_id)
    references sample_solution_entry_sub_texts (exercise_id, entry_id, id)
    on update cascade on delete cascade,
  -- user sub text exists
  foreign key (username, exercise_id, user_entry_id, user_sub_text_id)
    references user_solution_entry_sub_texts (username, exercise_id, entry_id, id)
    on update cascade on delete cascade
);

create table if not exists paragraph_citation_corrections (
  username                     varchar(100),
  exercise_id                  integer,
  sample_entry_id              integer,
  sample_paragraph_citation_id integer,
  user_entry_id                integer,
  user_paragraph_citation_id   integer,

  comment                      text,

  primary key (username, exercise_id, sample_entry_id, sample_paragraph_citation_id, user_entry_id,
               user_paragraph_citation_id),
  -- correction entry exists
  foreign key (username, exercise_id, sample_entry_id, user_entry_id)
    references entry_corrections (username, exercise_id, sample_entry_id, user_entry_id)
    on update cascade on delete cascade,
  -- sample paragraph citation exists
  foreign key (exercise_id, sample_entry_id, sample_paragraph_citation_id)
    references sample_solution_entry_paragraph_citations (exercise_id, entry_id, id)
    on update cascade on delete cascade,
  -- user paragraph citation exists
  foreign key (username, exercise_id, user_entry_id, user_paragraph_citation_id)
    references user_solution_entry_paragraph_citations (username, exercise_id, entry_id, id)
    on update cascade on delete cascade
);

-- grant privileges

grant select, update, insert, delete on all tables in schema public to coras;

grant select, usage on all sequences in schema public to coras;

-- initial values

insert into users(username, maybe_pw_hash, rights)
values ('admin', '$2a$10$X.tcQam1cP1wjhWxh/31RO02JKLZJS9l7eqdWLf0ss5SMub/TpzjC', 'admin');

-- !Downs

drop table if exists paragraph_citation_corrections;

drop table if exists sub_text_corrections;

drop table if exists entry_corrections;


drop table if exists user_solution_entry_paragraph_citations;

drop table if exists user_solution_entry_sub_texts;

drop table if exists user_solution_entries;


drop table if exists sample_solution_entry_paragraph_citations;

drop table if exists sample_solution_entry_sub_texts;

drop table if exists sample_solution_entries;


drop table if exists exercises;

drop table if exists users;


drop type if exists paragraph_type;

drop type if exists applicability_type;

drop cast if exists (character varying as rights_type);

drop type if exists rights_type;

