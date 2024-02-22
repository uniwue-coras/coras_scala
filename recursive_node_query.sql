with recursive nodes as (
  select exercise_id,
    username,
    id,
    text,
    parent_id
  from user_solution_nodes
  where exercise_id = 1
    and username = '2109371'
    and id = 0
  union
  select n.exercise_id,
    n.username,
    n.id,
    n.text as t,
    n.parent_id
  from user_solution_nodes as n
    join nodes on n.parent_id = nodes.id
    and n.exercise_id = nodes.exercise_id
    and n.username = nodes.username
)
select *
from nodes;
