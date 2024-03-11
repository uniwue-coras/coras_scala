FROM python:3.11

WORKDIR /wordkir

ADD requirements.txt $WORKDIR

RUN pip install -r requirements.txt
RUN python -m spacy download de_core_news_lg

RUN pip install gunicorn

ADD main.py $WORKDIR

EXPOSE 8000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0", "main:app"]
