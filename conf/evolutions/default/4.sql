-- !Ups

create table if not exists paragraph_citation_annotations (
  username          varchar(100) not null,
  exercise_id       integer      not null,
  sample_node_id    integer      not null,
  user_node_id      integer      not null,
  awaited_paragraph varchar(100) not null,
  cited_paragraph   varchar(100),

  primary key (username, exercise_id, sample_node_id, user_node_id, awaited_paragraph),
  foreign key (exercise_id, username, sample_node_id, user_node_id)
    references solution_node_matches (exercise_id, username, sample_node_id, user_node_id)
    on update cascade on delete cascade
);

alter table exercises drop column text;

-- !Downs

alter table exercises add column text not null default '';

drop table if exists paragraph_citation_annotations;