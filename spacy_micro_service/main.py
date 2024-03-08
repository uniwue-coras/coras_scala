from spacy import load as spacy_load
from spacy.tokens import Token
from flask import Flask, request, jsonify
from typing import TypedDict

app: Flask = Flask(__name__)
nlp = spacy_load("de_core_news_lg")


class Result(TypedDict):
    lemma: str
    pos: str


def filter_word(t: Token) -> bool:
    return t.is_stop or t.is_punct or t.is_space or t.like_num


def get_token_data(t: Token) -> Result:
    return {"lemma": t.lemma_, "pos": t.pos_}


def decode_text(text: str) -> dict[str, Result]:
    return dict([(t.text, get_token_data(t)) for t in nlp(text) if not filter_word(t)])


@app.route("/", methods=["POST"])
def route_index():
    return jsonify(decode_text(request.data.decode("utf-8")))


if __name__ == "__main__":
    app.run(host="0.0.0.0")
