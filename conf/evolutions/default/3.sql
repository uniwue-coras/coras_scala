-- !Ups
alter table solution_node_matches
  add column correctness                    enum ('Correct', 'Partially', 'Wrong', 'Unspecified') not null default 'Unspecified',
  add column paragraph_citation_correctness enum ('Correct', 'Partially', 'Wrong', 'Unspecified') not null default 'Unspecified',
  add column explanation_correctness        enum ('Correct', 'Partially', 'Wrong', 'Unspecified') not null default 'Unspecified';

-- !Downs

alter table solution_node_matches
  drop column correctness,
  drop column paragraph_citation_correctness,
  drop column explanation_correctness;
