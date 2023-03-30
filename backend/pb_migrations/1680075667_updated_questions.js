migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u9k3nf6ddkxrskr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cfaq6cn9",
    "name": "answer_count",
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
  const collection = dao.findCollectionByNameOrId("u9k3nf6ddkxrskr")

  // remove
  collection.schema.removeField("cfaq6cn9")

  return dao.saveCollection(collection)
})
