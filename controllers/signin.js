const handleSignIn = (req, resp, postgres, bcrypt) => {
    const { email, password } = req.body;
    if( !email || !password){
        return resp.status(400).json('Invalid Form Submission');
    }

    postgres.select('email', 'hash').from ('login')
    .where('email', '=', email)
     .then(data => {
         const isValid = bcrypt.compareSync(password, data[0].hash);
         if(isValid){
             return postgres.select('*')
                     .from('users')
                     .where('email', '=', email)
                     .returning('*')
                     .then(user => {
                         resp.json(user[0]);
                     })
                     .catch(err => resp.status(400).json('Unable to get user'));
         } else {
             resp.status(400).json('Wrong Credentials');
         }
     })
     .catch(err => resp.status(400).json('Wrong Credentials'));
 }

 module.exports = {
     handleSignIn: handleSignIn
 };