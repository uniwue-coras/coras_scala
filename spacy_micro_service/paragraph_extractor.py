from paragraph_citation import ParagraphCitation, ParagraphCitationLocation
from dataclasses import dataclass
from re import Match, compile as re_compile, Pattern
from typing import Optional, TypeVar, NamedTuple

T = TypeVar("T")

type Result[T] = Optional[tuple[str, int, T]]


@dataclass
class SubParagraphPart:
    sub_paragraph: Optional[str] = None
    sentence: Optional[str] = None
    number: Optional[str] = None
    alternative: Optional[str] = None


@dataclass
class ParagraphPart:
    paragraph: str
    sub_paragraph: Optional[str] = None
    sentence: Optional[str] = None
    number: Optional[str] = None
    alternative: Optional[str] = None


# Finds all position of § or Art.
__paragraph_regex: Pattern = re_compile(r"(§§*|Art\.)")

__paragraph_number_regex: Pattern = re_compile(r"^\s*(\d+[a-zA-Z]?)\s*")

__rest_regex: Pattern = re_compile(r"([\w\W]*?)([A-Z][a-zA-Z]+)")


def __read_from_sub_paragraph_number(text: str) -> Result[list[SubParagraphPart]]:
    # text should start with number...
    match = __paragraph_number_regex.match(text)

    if match is None:
        return None

    remaining_text = text[match.end() :]
    removed_length = match.end() - match.start() - 1

    return (
        remaining_text,
        removed_length,
        SubParagraphPart(sub_paragraph=match.group(1).strip()),
    )


def __read_from_paragraph_number(
    text: str,
) -> Result[list[ParagraphPart]]:
    # text should start with number...
    match = __paragraph_number_regex.match(text)

    if match is None:
        return None

    # remove matched part from string
    remaining_text = text[match.end() :]
    removed_length = match.end() - match.start()

    sub_paragraph_parts = []

    # TODO: sub_paragraph numbers?
    maybe_sub_paragraph_result = __read_from_sub_paragraph_number(remaining_text)
    while maybe_sub_paragraph_result is not None:
        remaining_text, sub_removed_len, sub_paragraph_part = maybe_sub_paragraph_result

        sub_paragraph_parts.push(sub_paragraph_part)
        removed_length = removed_length + sub_removed_len
        maybe_sub_paragraph_result = __read_from_paragraph_number(remaining_text)

    if len(sub_paragraph_parts) == 0:
        return (
            remaining_text,
            removed_length,
            [ParagraphPart(paragraph=match.group(1).strip())],
        )
    else:
        return (
            remaining_text,
            removed_length,
            [
                ParagraphPart(
                    paragraph=match.group(1).strip(),
                    sub_paragraph=sp.sub_paragraph,
                    sentence=sp.sentence,
                    alternative=sp.alternative,
                    number=sp.number,
                )
                for sp in sub_paragraph_parts
            ],
        )


def __read_match(match: Match, max_end_pos: Optional[int]) -> ParagraphCitationLocation:
    start_index = match.start()

    # remove already matched text
    if max_end_pos is None:
        remaining_text = match.string[match.end() :].strip()
    else:
        remaining_text = match.string[match.end() : max_end_pos].strip()

    paragraph_type = match.group(1).strip()
    removed_len = match.end() - match.start()

    paragraph_parts: list[ParagraphPart] = []

    maybe_next_paragraph_part = __read_from_paragraph_number(remaining_text)
    while maybe_next_paragraph_part is not None:
        remaining_text, sub_removed_len, next_paragraph = maybe_next_paragraph_part

        paragraph_parts.extend(next_paragraph)
        removed_len = removed_len + sub_removed_len
        maybe_next_paragraph_part = __read_from_paragraph_number(remaining_text)

    # consume anything until you've found anything that looks like a law code
    maybe_law_code_match = __rest_regex.match(remaining_text)

    if maybe_law_code_match is None:
        raise Exception(f"Could not find law code in >>{remaining_text}<<")

    rest = maybe_law_code_match.group(1).strip()
    law_code = maybe_law_code_match.group(2).strip()
    removed_len = (
        removed_len + maybe_law_code_match.end() - maybe_law_code_match.start()
    )

    paragraphs = [
        ParagraphCitation(
            paragraph_type,
            law_code,
            p.paragraph,
            p.sub_paragraph,
            p.sentence,
            p.number,
            p.alternative,
        )
        for p in paragraph_parts
    ]

    return ParagraphCitationLocation(
        start_index, start_index + removed_len, paragraphs, rest
    )


def extract_paragraphs(text: str) -> list[ParagraphCitationLocation]:
    matches: list[Match] = list(__paragraph_regex.finditer(text))

    locations: list[ParagraphCitationLocation] = []

    for index in range(len(matches)):
        # one citation can only last until next paragraph citation is started
        max_end_pos = matches[index + 1].start() if index < len(matches) - 1 else None

        location = __read_match(matches[index], max_end_pos)

        locations.append(location)

    return location
