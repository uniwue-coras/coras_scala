FROM python:3.11

WORKDIR /wordkir

ADD requirements.txt $WORKDIR

RUN pip install -r requirements.txt
RUN python -m spacy download de_core_news_lg

ADD main.py $WORKDIR

EXPOSE 5000

CMD ["python", "main.py"]
