-- !Ups
alter table solution_node_matches
  add column correctness enum ('Correct', 'Partially', 'Wrong', 'Unspecified') not null default 'Unspecified';

-- !Downs
alter table solution_node_matches drop column correctness;
