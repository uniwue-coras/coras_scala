set @exercise_id = 4,
  @username = '1';

delete from solution_node_matches
where exercise_id = @exercise_id
  and username = @username;

update user_solutions
set correction_status = 'Waiting'
where exercise_id = @exercise_id
  and username = @username;
