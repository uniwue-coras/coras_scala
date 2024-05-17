-- !Ups
alter table sample_solution_nodes
add column is_problem_focus boolean not null default false;
alter table user_solution_nodes
add column is_problem_focus boolean not null default false;

-- !Downs
alter table sample_solution_nodes drop column is_problem_focus;
alter table user_solution_nodes drop column is_problem_focus;
