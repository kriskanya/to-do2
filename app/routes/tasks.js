'use strict';

var tasks = global.nss.db.collection('tasks');
var priorities = global.nss.db.collection('priorities');
var Mongo = require('mongodb');
var _ = require('lodash');

exports.index = (req, res)=>{
  tasks.find().toArray((e,t)=>{    //find all the tasks, wait
    priorities.find().toArray((e,p)=>{  //find all the priorities, wait

      console.log('BEFORE');
      console.log(t);

      t = t.map(task => {   //looping over the tasks array, and for each item finding the priority is matches up with
        var priority = _(p).find(pri => pri._id.toString() === task.priorityId.toString());  //need to convert both of these object ids to strings so that you can compare them
        task.priority = priority;  //trying to find each priority in the priority object which matches each task
        return task;

      });

      console.log('AFTER');
      console.log(t);

      res.render('tasks/index', {priorities: p, tasks: t, title: 'Task List'});  //finally, render out the page
    });
  });
};


exports.create = (req, res)=>{
  req.body.isComplete = false;
  req.body.due = new Date(req.body.due);  //changes from string to date
  req.body.priorityId = Mongo.ObjectID(req.body.priorityId);  //changes from string to object id

  console.log('hello');
  tasks.save(req.body, ()=>res.redirect('/tasks'));

};

exports.destroy = (req, res)=>{
  var _id = Mongo.ObjectID(req.params.id);  //this is a string and you're converting it into an object id
  tasks.findAndRemove({_id:_id}, ()=>res.redirect('/tasks'));

};

exports.update = (req, res)=>{
  var _id = Mongo.ObjectID(req.params.id);  //this is a string and you're converting it into an object id

  tasks.findOne({_id:_id}, (e, t)=>{    //t is the task it's going to find; you're passing in an id and looking for the full task object
    t.isComplete = !t.isComplete;  //toggling the action

    tasks.save(t, ()=>res.redirect('/tasks'));
    //need to save the information to the database; if you give it something that has an id already, it will update it

    //create a strikethrough if isComplete is false
  });

};

exports.filter = (req, res)=>{
  var _pid = Mongo.ObjectID(req.params.pid);  //this is a string and you're converting it into an object id

  tasks.find({priorityId:_pid}).toArray((e,t)=>{    //find all the tasks, wait
    priorities.find().toArray((e,p)=>{  //find all the priorities, wait

      t = t.map(task => {   //looping over the tasks array, and for each item finding the priority is matches up with
        var priority = _(p).find(pri => pri._id.toString() === task.priorityId.toString());  //need to convert both of these object ids to strings so that you can compare them
        task.priority = priority;  //trying to find each priority in the priority object which matches each task
        return task;

      });

      res.render('tasks/index', {priorities: p, tasks: t, title: 'Task List'});  //finally, render out the page  //finally, render out the page
    });
  });
};

exports.datesort = (req, res)=>{
  tasks.find({}, {sort:[['due', 1]]}).toArray((e,t)=>{    //find all the tasks, wait
    priorities.find().toArray((e,p)=>{  //find all the priorities, wait

      t = t.map(task => {   //looping over the tasks array, and for each item finding the priority is matches up with
        var priority = _(p).find(pri => pri._id.toString() === task.priorityId.toString());  //need to convert both of these object ids to strings so that you can compare them
        task.priority = priority;  //trying to find each priority in the priority object which matches each task
        return task;

      });

      res.render('tasks/index', {priorities: p, tasks: t, title: 'Task List'});  //finally, render out the page  //finally, render out the page
    });
  });
};

// exports.datesort = (req, res)=>{
//   tasks.find({}, {sort:[['due', 1]]}).toArray((e,t))
// }
