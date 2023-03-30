migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gw52doe9yp64zhe")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tar3ogp3",
    "name": "general_index",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gw52doe9yp64zhe")

  // remove
  collection.schema.removeField("tar3ogp3")

  return dao.saveCollection(collection)
})
