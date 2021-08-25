const handleProfile = (req, resp, postgres) => {
        
    const { id } = req.params;

    postgres.select('*').from('users').where({id})
        .then(user => {
            if(user.length){
                resp.json(user[0]);
            } else {
                resp.status(400).json('Error Getting User!');
            }   
        })        
    }

module.exports = {
    handleProfile: handleProfile
};