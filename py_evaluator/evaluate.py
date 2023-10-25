from json import load as json_load
from type_defs import (
    Exercise,
    ExportedData,
    ExportedRelatedWord,
    UserSolution,
    FlatSolutionNode,
    UserSolutionNode,
    SingleResult,
)

path = "/home/bjorn/uni_nextcloud/CorAs/export_coras.json"


with open(path, "r") as file:
    exported_data: ExportedData = json_load(file)

result: dict[int, dict[str, SingleResult]] = {}

match_types = set()

for exercise in exported_data["exercises"]:
    ex_id = exercise["id"]
    # sample_solution: list[FlatSolutionNode] = exercise["sampleSolutionNodes"]

    result[ex_id] = {}

    for user_solution in exercise["userSolutions"]:
        username = user_solution["username"]

        correct: int = 0
        missing: int = 0
        wrong: int = 0

        for match in user_solution["nodeMatches"]:
            # sort matches in correct, missing, wrong...
            match_types.add(match["matchStatus"])

            match_status = match["matchStatus"]

            if match_status == "Automatic":
                correct = correct + 1
            elif match_status == "Manual":
                missing = missing + 1
            elif match_status == "AutomaticRejected":
                wrong = wrong + 1
            else:
                print(match_status)
                exit(1)

        result[ex_id][username] = {
            "correct": correct,
            "missing": missing,
            "wrong": wrong,
        }

print(result)

print(match_types)

wrongs = []

for ex_results in result.values():
    for user_results in ex_results.values():
        if user_results["wrong"] > 0:
            wrongs.append(ex_results)


print(wrongs)
