const handleRegister = (req, res, postgres, bcrypt) => {
    let { name, email, password } = req.body;
    // Validation
    if( !email || !name || !password){
        return res.status(400).json('Invalid Form Submission');
    }

    // Use bcrypt to generate salt + hash SYNCHRONOUS VERSION
    const hash = bcrypt.hashSync(password, 10);
    postgres.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then( loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then(user => {                
                res.json(user[0]);                      
            })               
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
 }

 module.exports = {
     handleRegister: handleRegister
 };