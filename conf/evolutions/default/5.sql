-- !Ups

create table if not exists exercise_text_blocks (
  exercise_id integer      not null references exercises(id) on update cascade on delete cascade,
  id          integer      not null,
  start_text  varchar(100) not null,

  primary key(exercise_id, id)
);

create table if not exists exercise_text_block_ends (
  exercise_id integer      not null,
  block_id    integer      not null,
  text        varchar(50)  not null,

  primary key(exercise_id, block_id, text),
  foreign key(exercise_id, block_id) references exercise_text_blocks(exercise_id, id) on update cascade on delete cascade
);

-- !Downs

drop table 
  exercise_text_block_ends,
  exercise_text_blocks;
