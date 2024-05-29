from dataclasses import dataclass
from typing import NamedTuple, Optional
from paragraph_extractor import extract_paragraphs
from paragraph_citation import ParagraphCitation, ParagraphCitationLocation
import pytest


def location(
    start_index: int, end_index: int, *paragraphs: ParagraphCitation
) -> ParagraphCitationLocation:
    return ParagraphCitationLocation(start_index, end_index, [p for p in paragraphs])


@pytest.mark.parametrize(
    "input,output",
    [
        ("§ 1 GG", location(0, 5, ParagraphCitation("§", "GG", paragraph="1"))),
        (
            "§ 1 I GG",
            location(
                0, 7, ParagraphCitation("§", "GG", paragraph="1", sub_paragraph="1")
            ),
        ),
        (
            "§ 1 Abs. 1 GG",
            location(
                0, 12, ParagraphCitation("§", "GG", paragraph="1", sub_paragraph="1")
            ),
        ),
        (
            "§ 1b I GG",
            location(
                0, 8, ParagraphCitation("§", "GG", paragraph="1b", sub_paragraph="1")
            ),
        ),
        (
            "§ 1b Abs. 1 GG",
            location(
                0, 13, ParagraphCitation("§", "GG", paragraph="1b", sub_paragraph="1")
            ),
        ),
        (
            "§ 1 I S. 1 GG",
            location(
                0,
                12,
                ParagraphCitation(
                    "§", "GG", paragraph="1", sub_paragraph="1", sentence="1"
                ),
            ),
        ),
        (
            "§ 1 Abs. 1 S. 1 GG",
            location(
                0,
                17,
                ParagraphCitation(
                    "§", "GG", paragraph="1", sub_paragraph="1", sentence="1"
                ),
            ),
        ),
        (
            "§ 1 I, II GG",
            location(
                0,
                11,
                ParagraphCitation("§", "GG", paragraph="1", sub_paragraph="1"),
                ParagraphCitation("§", "GG", paragraph="1", sub_paragraph="2"),
            ),
        ),
    ],
)
def test_extract_paragraphs(input: str, output: ParagraphCitationLocation):
    result = extract_paragraphs(input)
    assert (
        result == output
    ), f"Expected to extract paragraphs {output} from '{input}' but got {result}"
