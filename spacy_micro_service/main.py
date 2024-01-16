from flask import Flask, jsonify, request
import spacy
from spacy.tokens import Doc
from typing import TypedDict

app = Flask(__name__)
app.json.sort_keys = False
# app.json.compact = True

nlp = spacy.load("de_core_news_md")


class Content(TypedDict):
    sample: str
    user: str


class Lemma(TypedDict):
    originalText: str
    lemma: str


def extract_lemmas_from_doc(doc: Doc) -> list[Lemma]:
    return [
        {"originalText": token.text, "lemma": token.lemma_}
        for token in doc
        if not token.is_stop and not token.is_punct
    ]


@app.route("/", methods=["POST"])
def route_index():
    if not request.is_json:
        return "No json header!", 400

    content: Optional[Content] = request.get_json(silent=True)

    if content is None:
        return "No json body!", 400

    sample_content = content["sample"]
    user_content = content["user"]

    sample_doc = nlp(sample_content)
    user_doc = nlp(user_content)

    similarity = sample_doc.similarity(user_doc)

    return jsonify(
        {
            "similarity": similarity,
            "sampleLemmas": extract_lemmas_from_doc(sample_doc),
            "userLemmas": extract_lemmas_from_doc(user_doc),
        }
    )


if __name__ == "__main__":
    app.debug = True
    app.run()
