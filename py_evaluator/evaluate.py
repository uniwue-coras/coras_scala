from json import load as json_load
from typing import TypedDict

path = '/home/bjorn/uni_nextcloud/CorAs/export_coras.json'

class Exercise(TypedDict):
    pass

class ExportedData(TypedDict):
    abbreviations: list[any]
    relatedWordGroups: list[any]
    exercises: list[Exercise]

with open(path, 'r') as file:
    exported_data: ExportedData = json_load(file)

# print(exported_data.keys())

exes: list[Exercise] = exported_data['exercises']

print(f"Ex count: {len(exes)}")

