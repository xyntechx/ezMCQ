migrate((db) => {
  const collection = new Collection({
    "id": "x2a0yft3rsg1km6",
    "created": "2023-03-27 12:48:53.527Z",
    "updated": "2023-03-27 12:48:53.527Z",
    "name": "papers",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "phynqr3y",
        "name": "title",
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
        "id": "xvxs6f2y",
        "name": "description",
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
        "id": "qya6tzd2",
        "name": "author",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      }
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "author = @request.auth.id",
    "deleteRule": "author = @request.auth.id",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("x2a0yft3rsg1km6");

  return dao.deleteCollection(collection);
})
