migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gw52doe9yp64zhe")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "g1kafrts",
    "name": "content",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gw52doe9yp64zhe")

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
