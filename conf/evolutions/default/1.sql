-- !Ups

-- users

create table if not exists users (
  username      varchar(100) not null primary key,
  maybe_pw_hash varchar(100),
  rights        varchar(10)  not null default 'Student'
);

-- correction helpers: abbreviations, synonyms & antonyms, ...

create table if not exists abbreviations (
  abbreviation varchar(10) not null primary key,
  real_text    varchar(50) not null
);

create table if not exists related_word_groups (
  group_id integer auto_increment not null primary key
);

create table if not exists related_words (
  value       varchar(100) not null primary key,
  group_id    integer      not null references related_word_groups (group_id) on update cascade on delete cascade,
  is_positive boolean      not null default true
);

create table if not exists paragraph_synonyms (
  paragraph_type    varchar(10) not null,
  paragraph_number  integer     not null,
  section           integer     not null,
  sentence_number   integer,
  law_code          varchar(10) not null,
  synonym           varchar(50) not null,

  primary key(paragraph_type, paragraph_number, section, law_code)
);

-- exercises

create table if not exists exercises (
  id    int         not null primary key auto_increment,
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
  -- TODO: can't enforce foreign key since users don't have to be registered yet...
  username          varchar(100)                            not null,
  exercise_id       integer                                 not null references exercises (id) on update cascade on delete cascade,
  correction_status enum ('Waiting', 'Ongoing', 'Finished') not null default 'Waiting',
  review_uuid       varchar(100),

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
  username                       varchar(100)                                          not null,
  exercise_id                    integer                                               not null,
  sample_node_id                 integer                                               not null,
  user_node_id                   integer                                               not null,
  match_status                   enum ('Automatic', 'Manual', 'Deleted')               not null default 'Automatic', 
  paragraph_citation_correctness enum ('Correct', 'Partially', 'Wrong', 'Unspecified') not null default 'Unspecified',
  explanation_correctness        enum ('Correct', 'Partially', 'Wrong', 'Unspecified') not null default 'Unspecified',
  maybe_certainty float,


  primary key (exercise_id, username, sample_node_id, user_node_id),
  foreign key (exercise_id, sample_node_id) references sample_solution_nodes (exercise_id, id) on update cascade on delete cascade,
  foreign key (username, exercise_id, user_node_id) references user_solution_nodes (username, exercise_id, id) on update cascade on delete cascade
);

create table if not exists user_solution_node_annotations (
  username        varchar(100)                                      not null,
  exercise_id     integer                                           not null,
  user_node_id    integer                                           not null,
  id              integer                                           not null,

  error_type      enum ('Neutral', 'Missing', 'Wrong')              not null default 'Neutral',
  importance      enum ('Less', 'Medium', 'More')                   not null default 'Medium',
  start_index     integer                                           not null,
  end_index       integer                                           not null,
  text            text                                              not null,
  annotation_type enum ('Manual', 'Automatic', 'RejectedAutomatic') not null default 'Manual',

  primary key (username, exercise_id, user_node_id, id),
  foreign key (username, exercise_id, user_node_id) references user_solution_nodes (username, exercise_id, id) on update cascade on delete cascade
);

create table if not exists paragraph_citation_annotations (
  username          varchar(100)                                          not null,
  exercise_id       integer                                               not null,
  sample_node_id    integer                                               not null,
  user_node_id      integer                                               not null,
  awaited_paragraph varchar(100)                                          not null,
  correctness       enum('Correct', 'Partially', 'Wrong', 'Unspecified')  not null,
  cited_paragraph   varchar(100),
  explanation       varchar(1000),
  deleted           boolean,

  primary key (username, exercise_id, sample_node_id, user_node_id, awaited_paragraph),
  foreign key (exercise_id, username, sample_node_id, user_node_id)
    references solution_node_matches (exercise_id, username, sample_node_id, user_node_id)
    on update cascade on delete cascade
);

create table if not exists correction_summaries (
  exercise_id integer      not null,
  username    varchar(100) not null,
  comment     text         not null,
  points      integer      not null check (0 <= points and points <= 18),

  primary key (exercise_id, username),
  foreign key (exercise_id, username) references user_solutions (exercise_id, username) on update cascade on delete cascade
);

-- !Downs

drop table if exists
  correction_summaries,
  paragraph_citation_annotations,
  user_solution_node_annotations,
  solution_node_matches,
  user_solution_nodes,
  user_solutions,
  sample_solution_nodes,
  exercises,
  paragraph_synonyms,
  related_words,
  related_word_groups,
  abbreviations,
  users;
