migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u9k3nf6ddkxrskr")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tnoqnbvj",
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
  const collection = dao.findCollectionByNameOrId("u9k3nf6ddkxrskr")

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
