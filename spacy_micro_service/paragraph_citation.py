from typing import TypedDict, Optional
from dataclasses import dataclass


@dataclass
class ParagraphCitation:
    paragraph_type: str
    law_code: str
    paragraph: str
    sub_paragraph: Optional[str] = None
    sentence: Optional[str] = None
    number: Optional[str] = None
    alternative: Optional[str] = None

    def jsonify(self) -> dict[str, any]:
        return {
            "paragraphType": self.paragraph_type,
            "lawCode": self.law_code,
            "paragraph": self.paragraph,
            "subParagraph": self.sub_paragraph,
            "sentence": self.sentence,
            "number": self.number,
            "alternative": self.alternative,
        }


@dataclass
class ParagraphCitationLocation:
    start_index: int
    end_index: int
    cited_paragraphs: list[ParagraphCitation]
    rest: str = ""

    def jsonify(self) -> dict[str, any]:
        return {
            "from": self.start_index,
            "to": self.end_index,
            "citedParagraphs": [cp.jsonify() for cp in self.cited_paragraphs],
            "rest": self.rest,
        }
