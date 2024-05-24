-- !Ups

create table if not exists exercise_text_blocks(
  exercise_id integer      not null references exercises(id) on update cascade on delete cascade,
  group_id    integer      not null,
  content     varchar(500) not null,

  primary key(exercise_id, group_id, content)
);

-- !Downs

drop table exercise_text_blocks;
