-- !Ups

alter table user_solutions add column correction_finished boolean not null default false;

update user_solutions set correction_finished = user_solutions.correction_status = 'Finished';

-- alter table user_solutions drop column correction_status;

-- !Downs

alter table user_solutions drop column correction_finished;
