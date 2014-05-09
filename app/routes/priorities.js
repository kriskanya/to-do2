'use strict';

var priorities = global.nss.db.collection('priorities');
var Mongo = require('mongodb');

exports.index = (req, res)=>{

  priorities.find().toArray((err, records)=>
    res.render('priorities/index', {priorities: records, title: 'Priorities List'}));

 //find is your collection, find is a database method; you can query the database like this; priorities.find({name: 'medium'}); otherwise, it will give you everything
                //we give this a function on the inside so it calls us back


};

exports.destroy = (req, res)=>{
  var _id = Mongo.ObjectID(req.params.id);  //this is a string and you're converting it into an object id
  priorities.findAndRemove({_id:_id}, ()=>res.redirect('/priorities'));

  console.log(req.params);
  console.log(req.params);
  // res.redirect('/priorities');
};

exports.create = (req, res)=>{
  priorities.save(req.body, ()=>res.redirect('/priorities'));  //creates a new priority
};
