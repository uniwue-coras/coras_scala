-- !Ups

create table if not exists paragraph_synonyms (
  paragraph_type    varchar(10) not null,
  paragraph_number  integer     not null,
  section           integer     not null,
  sentence_number   integer,
  law_code          varchar(10) not null,
  synonym           varchar(50) not null,

  primary key(paragraph_type, paragraph_number, section, law_code)
);

-- !Downs

drop table if exists paragraph_synonyms;
