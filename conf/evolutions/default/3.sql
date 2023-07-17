-- !Ups

alter table user_solutions
  drop column review_uuid;

create table if not exists correction_summaries (
  exercise_id integer      not null,
  username    varchar(100) not null,
  comment     text         not null,
  points      integer      not null check (0 <= points and points <= 18),

  primary key (exercise_id, username),
  foreign key (exercise_id, username) references user_solutions (exercise_id, username) on update cascade on delete cascade
);

-- !Downs

drop table correction_summaries;

alter table user_solutions
  add column review_uuid varchar(50) not null unique default uuid();