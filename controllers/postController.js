class postController {
    check = async (req, res) => {
        res.send('post service');
    }
}

module.exports = new postController();