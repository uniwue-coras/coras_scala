-- !Ups
alter table sample_solution_nodes
add column focus_intensity enum('Less', 'Medium', 'More');

alter table user_solution_nodes
add column focus_intensity enum('Less', 'Medium', 'More');

-- !Downs
alter table sample_solution_nodes drop column focus_intensity;
alter table user_solution_nodes drop column focus_intensity;
