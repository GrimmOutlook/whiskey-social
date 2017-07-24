if (!req.body) {
    return res.status(400).json({message: 'No request body'});
  }

  let {userName, password, name, dob, email} = req.body;

   //TODO: Create Individual Validation Function
  // userName validation ----------------------------------------------------------
  if (!('userName' in req.body)) {
    return res.status(422).json({message: 'Missing field: userName'});
  }

  if (typeof userName !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: userName'});
  }

  if (userName === '') {
    return res.status(422).json({message: 'Incorrect field length: userName'});
  }
  userName = userName.trim();

  // password validation ----------------------------------------------------------
  if (!(password)) {
    return res.status(422).json({message: 'Missing field: password'});
  }

  if (password.length < 8)  {
    console.log(password.length);
    return res.status(422).json({message: 'You need a longer password, make it at least 8 characters.'});
  }

  if (typeof password !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: password'});
  }

  if (password === '') {
    return res.status(422).json({message: 'Incorrect field length: password'});
  }

  if (password === 'password') {
    return res.status(422).json({message: 'Do not make password your password!'});
  }
  password = password.trim();

  // name.firstName validation ----------------------------------------------------
  if (!('name.firstName' in req.body)) {
    return res.status(422).json({message: 'Missing field: name.firstName'});
  }

  if (typeof name.firstName !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: name.firstName'});
  }

  if (name.firstName === '') {
    return res.status(422).json({message: 'Incorrect field length: name.firstName'});
  }
  name.firstName = name.firstName.trim();

  // name.lastName validation ------------------------------------------------------
  if (!('name.lastName' in req.body)) {
    return res.status(422).json({message: 'Missing field: name.lastName'});
  }

  if (typeof name.lastName !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: name.lastName'});
  }

  if (name.lastName === '') {
    return res.status(422).json({message: 'Incorrect field length: name.lastName'});
  }
  name.lastName = name.lastName.trim();

  // email validation ------------------------------------------------------------
  if (!('email' in req.body)) {
    return res.status(422).json({message: 'Missing field: email'});
  }

  if (typeof email !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: email'});
  }

  if (email === '') {
    return res.status(422).json({message: 'Incorrect field length: email'});
  }
  email = email.trim();
