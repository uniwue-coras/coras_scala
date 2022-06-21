db.auth('root', '1234');

db.createUser({
  user: 'coras',
  pwd: '1234',
  roles: [
    {db: 'coras', role: 'readWrite'}
  ]
});

// Users collection

db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      properties: {
        _id: {bsonType: 'objectId'},
        username: {bsonType: 'string'},
        maybePasswordHash: {bsonType: ['string', 'null']},
        rights: {enum: ['Student', 'Corrector', 'Admin']}
      },
      required: ['_id', 'username', 'maybePasswordHash', 'rights'],
      additionalProperties: false
    }
  }
});

const usersCollection = db.getCollection('users');

usersCollection.createIndex({username: 1}, {unique: true});

usersCollection.insertOne({
  username: 'admin',
  maybePasswordHash: '$2a$10$v92Jgbo0hB.2fOmhcrjgzO8SO.xp6Q7i38lVF/ko0ag4.evDpJt4u',
  rights: 'Admin'
});

// Exercises collection

db.createCollection('exercises', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      properties: {
        _id: {bsonType: 'objectId'},
        id: {bsonType: 'int'},
        title: {bsonType: 'string'},
        text: {bsonType: 'string'},
        sampleSolution: {
          bsonType: 'array',
          items: {}
        }
      },
      required: ['_id', 'id', 'title', 'text', 'sampleSolution']
    }
  }
});

const exercisesCollection = db.getCollection('exercises');

exercisesCollection.createIndex({id: 1}, {unique: true});
exercisesCollection.createIndex({title: 1}, {unique: true});

// User solutions collection

db.createCollection('userSolutions');

const userSolutionsCollection = db.getCollection('userSolutions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      properties: {
        _id: {bsonType: 'objectId'},
        exerciseId: {bsonType: 'int'},
        username: {bsonType: 'username'},
        solution: {
          bsonType: 'array',
          items: {}
        }
      },
      required: ['_id', 'exerciseId', 'username', 'solution']
    }
  }
});

userSolutionsCollection.createIndex({exerciseId: 1, username: 1}, {unique: true});
