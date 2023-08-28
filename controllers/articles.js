const Article = require('../models/articles');
const { cloudinary } = require('../cloudinary');

module.exports.index = async(req, res, next) => {
    const art = await Article.find({});
    res.render('articles/index', {art}); 
}

module.exports.renderNewForm = (req, res) => {
    res.render('articles/new');
}

module.exports.createArticle = async(req, res, next) => {
    // req.file for single, req.files for array
    const art = new Article(req.body.article);
    // map over the array that's been added to req.files thanks to multer
    // take the path and the file name, make an object for each one
    art.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    art.owner = req.user._id;
    await art.save();
    console.log(art);
    req.flash('success', 'Article posted successfully!'); // we do this after saving coz we can be sure there were no errors
    res.redirect(`/articles/${art._id}`);
}

module.exports.showArticle = async(req, res, next) => {
    const art = await Article.findById(req.params.id).populate('owner');
    if(!art) {
        req.flash('error', 'Cannot find that article!');
        return res.redirect('/articles'); // we return to avoid rendering articles/show
    }
    res.render('articles/show', {art});
}

module.exports.renderEditForm = async(req, res, next) => {
    const {id} = req.params;
    const art = await Article.findById(id);
    if(!art) {
        req.flash('error', 'Cannot find that article!');
        return res.redirect('/articles'); // we return to avoid rendering articles/show
    }
    res.render('articles/edit', {art});
}

module.exports.updateArticle = async(req, res, next) => {
    const {id} = req.params;
    const art = await Article.findByIdAndUpdate(id, {...req.body.article});
    // req.files.map makes an array
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    art.images.push(...imgs);
    await art.save();
    // from our images array we want to pull the ones whose filenames appear in deleteImages array
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
            // to remove from cloudinary
        }
        await art.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}})
    }
    req.flash('success', 'Article updated successfully!');
    res.redirect(`/articles/${art._id}`);
}

module.exports.deleteArticle = async(req, res, next) => {
    const {id} = req.params;
    await Article.findByIdAndDelete(id);
    req.flash('success', 'Article deleted successfully!');
    res.redirect(`/articles`);
}