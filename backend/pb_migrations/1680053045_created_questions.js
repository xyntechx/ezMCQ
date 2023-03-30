migrate((db) => {
  const collection = new Collection({
    "id": "u9k3nf6ddkxrskr",
    "created": "2023-03-29 01:24:05.279Z",
    "updated": "2023-03-29 01:24:05.279Z",
    "name": "questions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "kvefqvov",
        "name": "paper",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "x2a0yft3rsg1km6",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "tnoqnbvj",
        "name": "content",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "paper.author.id = @request.auth.id",
    "deleteRule": "paper.author.id = @request.auth.id",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("u9k3nf6ddkxrskr");

  return dao.deleteCollection(collection);
})
