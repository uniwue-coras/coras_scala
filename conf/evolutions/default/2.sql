-- !Ups
alter table user_solutions
add column correction_finished boolean not null default false;

update user_solutions
set correction_finished = user_solutions.correction_status = 'Finished';

alter table user_solutions drop column correction_status;

-- !Downs
alter table user_solutions
add column correction_status enum ('Waiting', 'Ongoing', 'Finished') not null default 'Ongoing';

update user_solutions
set correction_status = 'Finished'
where user_solutions.correction_finished;

alter table user_solutions drop column correction_finished;
