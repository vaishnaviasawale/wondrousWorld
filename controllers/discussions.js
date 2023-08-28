const Discussion = require('../models/discussions');
const Page = require('../models/pages');

module.exports.showDiscussion = async(req, res) => {
    const {sec, num} = req.params;
    const page = await Page.findOne({$and: [{section: sec}, {title: num}]}).populate({path: 'discussions', populate: {path: 'owner'}});
    console.log(page);
    res.render('discussion', { page });
}

module.exports.createDiscussion = async(req, res) => {
    const {sec, num} = req.params;
    const page = await Page.findOne({$and: [{section: sec}, {title: num}]});
    const discussion = new Discussion(req.body.discussion); // in discussion.ejs each input is given a name with prefix discussion; so it's all under the key of discussion once its been parsed
    discussion.owner = req.user._id;
    page.discussions.push(discussion); //push our new review 
    await discussion.save(); //awaiting them in series instead of parallel but it doesn't matter coz these are very
    await page.save(); // quick operations
    req.flash('success', 'Comment posted successfully!');
    res.redirect(`/${page.section}/${page.title}/discussion`);
}

module.exports.deleteDiscussion = async(req, res) => {
    const {sec, num, discusid} = req.params;
    await Page.findOneAndUpdate({$and: [{section: sec}, {title: num}]}, { $pull: {discussions: discusid} });
    await Discussion.findByIdAndDelete(discusid);
    req.flash('success', 'Comment deleted successfully!');
    res.redirect(`/${sec}/${num}/discussion`);
}