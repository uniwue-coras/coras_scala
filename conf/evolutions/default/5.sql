-- !Ups
alter table paragraph_citation_annotations
  add column explanation varchar(1000) default null,
  add column deleted boolean default false;

-- !Downs
alter table paragraph_citation_annotations
  drop column explanation,
  drop column deleted;
