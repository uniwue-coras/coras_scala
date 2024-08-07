# CorAs - Correction Assistent for legal solution outlines

CorAs is a tool to help correcting outlines of solutions for legal cases developed with

- [Play Framework](https://www.playframework.com/) (with Scala **2** as language) as server
- [MariaDB](https://mariadb.org/) as database
- [React](https://react.dev/) build with [Vite](https://vitejs.dev/) (with Typescript as language) as frontend
- [GraphQL](https://graphql.org/) for communication between back- and frontend
- [SpaCy](https://spacy.io/) for basic NLP

## Initial setup for development

This section outlines the steps needed to get a **development** instance of the database, backend + frontend up and running after cloning this repository.

```bash
git clone https://github.com/uniwue-coras/coras_scala.git
```

### Prerequisites

To start a development instance, you need to have a version of following tools installed:

- [JDK](https://www.oracle.com/java/technologies/downloads/), Version **11**
- [sbt](https://www.scala-sbt.org/)
- [Node.js](https://nodejs.org/en) with [npm](https://www.npmjs.com/)
- (optionally) [docker](https://www.docker.com/) with [docker-compose](https://docs.docker.com/compose/)

### Database

As the tool relies on a database to store the sample and user solution, the database should be setup first.
This can either be archieved by installing an instance of MariaDB on your maching or by using the `docker-compose.yaml` file provided.
You can find - and change - the neccessary connection parameters in the file [conf/application.conf](/conf/application.conf).

```bash
# start the MariaDB instance with docker (also runs an instance of the spacy micro service, see below)
docker compose up -d
```

After running the database migrations in Play (by starting it and confirming the migrations in the browser), you can import the default data with:

```bash
data/import_default_data.sh
```

When adding new migrations, you should update the default data, so they can still be imported:

```bash
data/update_default_data.sh
```

### Spacy "micro service"

The backend uses spaCy for simple NLP tasks such as tokenization and lemmatization of text found in solutions.

TODO...

### Backend

The backend (server) is written in Scala with the Play Framework (currently version `2.8.X`) and can be found in the folder `app`.
To start a development instance of the server listening on port `9016`, run the following command in the root directory:

**Important**: Version `2.8.X` only supports Java Version 8 and 11. Running with Java 17 will (probably) result in exceptions.

```bash
# start the server
sbt run
```

The task will react to source changes and trigger a recompilation on any new request (including any coming from the frontend).

If you navigate your browser to [localhost:9016](http://localhost:9016) you won't see much apart from error messages, such as when a database
evolution is needed, as the server only exposes a couple of routes (see below).

### Frontend

The frontend is written in Typescript with React built with Vite and can be found in the subfolder `vite_ui`.
Before the first start you need to install the dependencies with `npm`.
To start a development instance - that will also react to source changes on reload - go to the subfolder and run the following command:

```bash
# install dependencies
npm install

# start dev instance
npm run dev
```

You can access the frontend on your browser on [localhost:5116](http://localhost:5116).

## Overview of the code

This section provides a general overview of the code in this repository.

### Database

Besides the file [init.sql](init.sql) used to initialize the database when using docker the files for the database can be found in the
directory [conf/evolutions/default](conf/evolutions/default) named `*.sql`.
These files are split in an `Ups` and and `Downs` part and are run in ascending order by
[Play evolutions](https://www.playframework.com/documentation/2.8.x/Evolutions) to keep the database definitions up to date.

The changes in these files do **not** reflect to other code but must be adapted manually.

### Backend

The code for the backend can be found in the folder [app](/app) and is split into `controllers`, `model` and `views`.

- `controllers` contains the code that is responsible for providing the actual endpoints clients use
- `views` contains the file `graphiql.scala.html` which is used to provide a [GraphiQL](https://github.com/graphql/graphiql)
  endpoint to test the graphql definitions
- `model` contains the code that defines the actual business logic, i.e. interactions with the database and the correction of solutions

The main "entrypoint" into a Play application is however the file [conf/routes](conf/routes) which defines the endpoints the application exposes and
the functions that are called when these endpoints are accessed.

At the time of this writing the most important endpoint is `GET /graphql controllers.HomeController.graphql` which defines the GraphQL endpoint
that clients use to interact with the server defined in the file [HomeController.scala](app/controllers/HomeController.scala).

The GraphQL model is defined in various files, but you can start with the [RootQuery](app/model/graphql/RootQuery.scala) and [RootMutation](app/model/graphql/RootMutation.scala) files and follow the resolvers.

Changes in the GraphQL definitions are not reflected directly to the client but can be updated manually with
[GraphQL-Codegen](https://the-guild.dev/graphql/codegen) by running (in `/vite_ui`, see scripts in [packages.json](vite_ui/package.json)):

```bash
# refresh graphql type and query definitions for clients automatically
npm run graphql-generate-schema
```

### Frontend

The GraphQL queries are defined in various `*.graphql` files.
To update the generated queries and types for the queries you need to run

```bash
npm run graphql-generate
```

TODO...

### Matching (algorithm)

The correction depends on a matching of a learner solution against a provided sample solution.
Both solutions consist of headings in a tree structure that outline the text that would've been written in a completely formulated solution.
The tool uses this fact to first match the root nodes.
If a match is found for a sample and a user's node, the children of these nodes are matched recursively until no more child matches or
child nodes are found.

The matching algorithm for two lists of entries (headings, words, paragraphs, ...) (implemented in a more or less immutable/functional way,
see [Matcher.scala](app/model/matching/Matcher.scala)) can be defined as follows:

```python
def matching[T](sample_values: list[T], user_value: list[T]):
    matches: list[Match[T]] = []
    not_matched_sample: list[T] = []

    for sample_value in sample_values:
        maybe_match = find_match(sample_value, user_values)

        maybe_match match
            case Some(match) => matches.append(maybe_match)
            case None => not_matched_sample.append(not_matched_sample)

def find_match[T](sample_value: T, user_values: list[T]) -> Optional[Match[T]]:
    for user_value in user_values:
        if matches(sample_value, user_value):
            user_values.remove(user_value)
            return Some(Match(sample_value, user_value))

    return None
```
