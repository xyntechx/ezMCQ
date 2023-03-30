migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gw52doe9yp64zhe")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = ""
  collection.updateRule = "paper.author.id = @request.auth.id"
  collection.deleteRule = "paper.author.id = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gw52doe9yp64zhe")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
