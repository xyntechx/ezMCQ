migrate((db) => {
  const collection = new Collection({
    "id": "gw52doe9yp64zhe",
    "created": "2023-03-29 01:26:42.775Z",
    "updated": "2023-03-29 01:26:42.775Z",
    "name": "answers",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "bjvrzcpy",
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
        "id": "g1kafrts",
        "name": "content",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "s3ja74gd",
        "name": "is_correct",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("gw52doe9yp64zhe");

  return dao.deleteCollection(collection);
})
