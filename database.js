
var mongojs = require("mongojs")

var db = mongojs('mongodb+srv://root:pass@cluster0.rl3px.mongodb.net/paintAct?retryWrites=true&w=majority', ['account', 'imgs', 'posts', 'comments'])

Database = {}

Database.correctPass = function(data,callback){
	db.account.findOne({username:data.username, pass:data.pass},function(err,res){
        if (err) throw err
        if(res)
			callback(true)
		else
			callback(false)
	});
}

Database.takenUser = function(data, callback){
    db.account.findOne({username:data.username},function(err,res){
        if (err) throw err
        if(res)
			callback(true)
		else
			callback(false)
	});
}

Database.addUser = function(data, callback) {
	db.account.insert({username:data.username, pass:data.pass},function(err){
        if (err) throw err
        callback()
	})
}

Database.deleteUser = function(data, callback) {
    db.account.remove({username:data.username, pass:data.pass}, function(err, res){
		if (err) throw err
		if (res)
			callback(true)
		else
			callback(false)
	})
}

Database.takenImgName = function(data, callback){
    db.imgs.findOne({username: data.username, imgName:data.imgName},function(err,res){
        if (err) throw err
        if(res)
			callback(true)
		else
			callback(false)
	});
}

Database.addImg = function(data, callback) {
	db.imgs.insert({username:data.username, imgName:data.imgName, img:data.img},function(err){
        if (err) throw err
        callback()
	})
}

Database.getImagesByName = function(username, callback) {
	db.imgs.find({username:username},function(err,res) {
        if (err) throw err
        callback(res)
	});
}

Database.getImgURI = function(data, callback) {
	db.imgs.findOne({username:data.username, imgName:data.imgName}, function(err, res) {
		if (err) throw err
		callback(res.img)
	})
}

Database.addPost = function(data, callback) {
	db.posts.insert({username:data.username, img:data.img, time:data.time, id: data.id}, function(err, res) {
		if (err) throw err
		callback(res)
	})
}

Database.getPosts = function(callback) {
	db.posts.find(function(err, res) {
		if (err) throw err
		callback(res)
	})
}

Database.sendComment = function(data) {
	db.comments.insert({parent:data.parent, username:data.username, text:data.text}) 
}

Database.getComments = function(callback) {
	db.comments.find(function (err, res) {
		if (err) throw err
		callback(res)
	})
}
// Database.likePost = function(id) {
// 	db.post.findAndModify({
// 		query: { _id: id },
//     	update: { $inc: { likes: 1 } },
//     	upsert: false
// 	})
// }

// Database.unlikePost = function(id, callback) {
// 	db.post.findAndModify({
// 		query: { _id: id },
//     	update: { $inc: { likes: -1 } },
//     	upsert: false
// 	})
// }