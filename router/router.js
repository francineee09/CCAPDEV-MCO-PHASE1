const { Router }= require('express');
const User = require('../server/schema/User');
const Comments = require('../server/schema/Comments');
const Messages = require('../server/schema/Messages');
const Post = require('../server/schema/Post');
const profile = require('../server/schema/profile');
const router = Router();

router.get('/', async function(req, res) {
   res.render('index');
});

module.exports = router;


