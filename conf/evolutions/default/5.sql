-- !Ups

alter table user_solution_node_annotations
  add column annotation_type enum ('Manual', 'Automatic', 'RejectedAutomatic') not null default 'Manual';

-- !Downs

alter table user_solution_node_annotations
  drop column annotation_type;
