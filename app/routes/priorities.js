'use strict';

exports.index = (req, res)=>{
  res.render('priorities/index', {title: 'Priorities List'});
};
