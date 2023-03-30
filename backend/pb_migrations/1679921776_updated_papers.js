migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x2a0yft3rsg1km6")

  collection.updateRule = "author.id = @request.auth.id"
  collection.deleteRule = "author.id = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x2a0yft3rsg1km6")

  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
