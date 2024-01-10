-- !Ups

create table if not exists sample_solution_sub_text_nodes (
  exercise_id     integer     not null,
  parent_node_id  integer     not null,
  id              integer     not null,
  content         text        not null,
  applicability   varchar(20) not null,

  primary key (exercise_id, parent_node_id, id),
  foreign key (exercise_id, parent_node_id) references sample_solution_nodes (exercise_id, id) on update cascade on delete cascade
);

insert into sample_solution_sub_text_nodes (exercise_id, parent_node_id, id, content, applicability)
  select exercise_id, parent_id, child_index, text, applicability
  from sample_solution_nodes 
  where is_subtext;

create table if not exists user_solution_sub_text_nodes (
  username       varchar(100) not null,
  exercise_id    integer      not null,
  parent_node_id integer      not null,
  id             integer      not null,
  content        text         not null,
  applicability  varchar(20)  not null,

  primary key (username, exercise_id, parent_node_id, id),
  foreign key (username, exercise_id, parent_node_id) references user_solution_nodes (username, exercise_id, id) on update cascade on delete cascade
);

insert into user_solution_sub_text_nodes (username, exercise_id, parent_node_id, id, content, applicability)
  select username, exercise_id, parent_id, child_index, text, applicability
  from user_solution_nodes
  where is_subtext;

create table if not exists sub_text_matches (
  username           varchar(100) not null,
  exercise_id        integer      not null,
  sample_node_id     integer      not null,
  sample_sub_text_id integer      not null,
  user_node_id       integer      not null,
  user_sub_text_id   integer      not null,

  primary key (username, exercise_id, sample_node_id, sample_sub_text_id, user_node_id, user_sub_text_id),
  foreign key (exercise_id, sample_node_id, sample_sub_text_id)
    references sample_solution_sub_text_nodes (exercise_id, parent_node_id, id)
    on update cascade on delete cascade,
  foreign key (username, exercise_id, user_node_id, user_sub_text_id)
    references user_solution_sub_text_nodes (username, exercise_id, parent_node_id, id)
    on update cascade on delete cascade
);

-- move sample_sub_text <-> user_sub_text matches to other table
insert into sub_text_matches (username, exercise_id, sample_node_id, sample_sub_text_id, user_node_id, user_sub_text_id)
  select matches.username, matches.exercise_id, sample_nodes.parent_id, sample_nodes.child_index, user_nodes.parent_id, user_nodes.child_index
  from solution_node_matches as matches
  join sample_solution_nodes as sample_nodes
    on sample_nodes.exercise_id = matches.exercise_id and sample_nodes.id = matches.sample_node_id
  join user_solution_nodes as user_nodes
    on user_nodes.username = matches.username and user_nodes.exercise_id = matches.exercise_id and user_nodes.id = matches.user_node_id
  where sample_nodes.is_subtext and user_nodes.is_subtext;

delete matches from solution_node_matches as matches
  join sample_solution_nodes as sample_nodes
    on sample_nodes.exercise_id = matches.exercise_id and sample_nodes.id = matches.sample_node_id
  join user_solution_nodes as user_nodes
    on user_nodes.username = matches.username and user_nodes.exercise_id = matches.exercise_id and user_nodes.id = matches.user_node_id
  where sample_nodes.is_subtext and user_nodes.is_subtext;

-- update sample_node <-> user_sub_text match to sample_node <-> user_parent_node match!

update ignore solution_node_matches as matches
  join user_solution_nodes as user_nodes
    on user_nodes.username = matches.username and user_nodes.exercise_id = matches.exercise_id and user_nodes.id = matches.user_node_id
  set matches.user_node_id = user_nodes.parent_id
  where user_nodes.is_subtext;

-- update sample_sub_text <-> user_node match to sample_parent_node <-> user_node match!

update ignore solution_node_matches as matches
  join sample_solution_nodes as sample_nodes
    on sample_nodes.exercise_id = matches.exercise_id and sample_nodes.id = matches.sample_node_id
  set matches.sample_node_id = sample_nodes.parent_id
  where sample_nodes.is_subtext;

-- node annotations

create table if not exists sub_text_node_annotations (
  username            varchar(100)                                      not null,
  exercise_id         integer                                           not null,
  parent_node_id      integer                                           not null,
  sub_text_node_id    integer                                           not null,
  id                  integer                                           not null,

  error_type          enum ('Missing', 'Wrong')                         not null,
  importance          enum ('Less', 'Medium', 'More')                   not null default 'Medium',
  start_index         integer                                           not null,
  end_index           integer                                           not null,
  text                text                                              not null,
  annotation_type     enum ('Manual', 'Automatic', 'RejectedAutomatic') not null default 'Manual',

  primary key (username, exercise_id, parent_node_id, sub_text_node_id, id),
  foreign key (username, exercise_id, parent_node_id, sub_text_node_id)
    references user_solution_sub_text_nodes (username, exercise_id, parent_node_id, id)
    on update cascade
    on delete cascade
);

insert into sub_text_node_annotations (username, exercise_id, parent_node_id, sub_text_node_id, id, error_type, importance, start_index, end_index, text, annotation_type)
  select 
    annos.username,
    annos.exercise_id,
    user_nodes.parent_id,
    user_nodes.child_index,
    annos.id,
    annos.error_type,
    annos.importance,
    annos.start_index,
    annos.end_index,
    annos.text, 
    annos.annotation_type
  from user_solution_node_annotations as annos
  join user_solution_nodes as user_nodes on 
    annos.username = user_nodes.username 
    and annos.exercise_id = user_nodes.exercise_id 
    and annos.user_node_id = user_nodes.id
  where user_nodes.is_subtext;

delete annos from user_solution_node_annotations as annos
  join user_solution_nodes as user_nodes on 
    annos.username = user_nodes.username 
    and annos.exercise_id = user_nodes.exercise_id 
    and annos.user_node_id = user_nodes.id
  where user_nodes.is_subtext;

-- delete old data

delete from sample_solution_nodes where is_subtext;

alter table sample_solution_nodes
  drop column is_subtext;

delete from user_solution_nodes where is_subtext;

alter table user_solution_nodes
  drop column is_subtext;

-- !Downs

drop table if exists
  sub_text_matches,
  user_solution_sub_text_nodes,
  sample_solution_sub_text_nodes;
