from typing import TypedDict, Any, Literal
from enum import Enum


class FlatSolutionNode(TypedDict):
    id: int
    childIndex: int
    isSubText: bool
    text: str
    applicability: Any


class UserSolutionNode(FlatSolutionNode, TypedDict):
    pass


class NodeMatch(TypedDict):
    sampleNodeId: int
    userNodeId: int
    matchStatus: Literal["Manual", "Automatic", "AutomaticRejected"]


class UserSolution(TypedDict):
    username: str
    userSolutionNodes: list[UserSolutionNode]
    nodeMatches: list[NodeMatch]
    correctionStatus: Any
    correctionSummary: str


class Exercise(TypedDict):
    id: int
    title: str
    text: str
    sampleSolutionNodes: list[FlatSolutionNode]
    userSolutions: list[UserSolution]


class ExportedRelatedWord(TypedDict):
    word: str
    isPositive: bool


class ExportedData(TypedDict):
    abbreviations: dict[str, str]
    relatedWordGroups: list[list[ExportedRelatedWord]]
    exercises: list[Exercise]


class SingleResult(TypedDict):
    correct: int
    missing: int
    wrong: int
