use heroes


// create
db.heroes.create({ nome: 'Iron man', poder: 'Rico'})

// read
db.heroes.find({})

// update
db.heroes.update({_id: id}, {$set: {nome: 'papaleguas'}})

// delete
db.heroes.delete({_id: id})

