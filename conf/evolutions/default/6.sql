-- !Ups

alter table exercises
  add column is_finished boolean not null default false;

-- !Downs

alter table exercises
  drop column is_finished;
