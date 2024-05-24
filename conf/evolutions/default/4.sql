-- !Ups

alter table explanation_annotations
  modify text varchar(500) not null,
  drop primary key,
  add primary key (username, exercise_id, sample_node_id, user_node_id, text);

-- !Downs

alter table explanation_annotations
  modify text text not null,
  drop primary key,
  add primary key (username, exercise_id, sample_node_id, user_node_id);

