migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gw52doe9yp64zhe")

  collection.updateRule = "question.paper.author.id = @request.auth.id"
  collection.deleteRule = "question.paper.author.id = @request.auth.id"

  // remove
  collection.schema.removeField("bjvrzcpy")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fjnybuca",
    "name": "question",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "u9k3nf6ddkxrskr",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gw52doe9yp64zhe")

  collection.updateRule = null
  collection.deleteRule = null

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  // remove
  collection.schema.removeField("fjnybuca")

  return dao.saveCollection(collection)
})
