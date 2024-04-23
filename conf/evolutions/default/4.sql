-- !Ups

create table if not exists paragraph_citation_annotations (
  username        varchar(100)             not null,
  exercise_id     integer                  not null,
  sample_node_id  integer                  not null,
  user_node_id    integer                  not null,
  error_type      enum('Missing', 'Wrong') not null default 'Wrong',

  primary key (username, exercise_id, sample_node_id, user_node_id),
  foreign key (exercise_id, username, sample_node_id, user_node_id)
    references solution_node_matches (exercise_id, username, sample_node_id, user_node_id)
    on update cascade on delete cascade
);

-- !Downs

drop table if exists paragraph_citation_annotations;
