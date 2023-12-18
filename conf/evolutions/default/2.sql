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

-- copy data...
insert into sample_solution_sub_text_nodes (exercise_id, parent_node_id, id, content, applicability)
  select exercise_id, parent_id, child_index, text, applicability
  from sample_solution_nodes 
  where is_subtext;

-- TODO: delete old subtexts in sample_sol_nodes, update table structure!

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

-- TODO: delete old subtexts in user_sol_nodes, update table structure!

-- !Downs

drop table if exists
  user_solution_sub_text_nodes,
  sample_solution_sub_text_nodes;
