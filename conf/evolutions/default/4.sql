-- !Ups

alter table user_solutions
  add column review_uuid varchar(100);

-- !Downs

alter table user_solutions
  drop column review_uuid;

