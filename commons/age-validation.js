// Age of 21 or older validation -----------------------------------------------
  if (!('dob.month' in req.body)) {
    return res.status(422).json({message: 'Missing field: dob.month'});
  }

  if (typeof dob.month === 'string') {
    return res.status(422).json({message: 'Incorrect field type: dob.month'});
  }

  if (dob.month === '') {
    return res.status(422).json({message: 'Incorrect field length: dob.month'});
  }
  month = dob.month;

  if (!('dob.day' in req.body)) {
    return res.status(422).json({message: 'Missing field: dob.day'});
  }

  if (typeof dob.day === 'string') {
    return res.status(422).json({message: 'Incorrect field type: dob.day'});
  }

  if (dob.day === '') {
    return res.status(422).json({message: 'Incorrect field length: dob.day'});
  }
  day = dob.day;

  if (!('dob.year' in req.body)) {
    return res.status(422).json({message: 'Missing field: dob.year'});
  }

  if (typeof dob.year === 'string') {
    return res.status(422).json({message: 'Incorrect field type: dob.year'});
  }

  if (dob.year === '') {
    return res.status(422).json({message: 'Incorrect field length: dob.year'});
  }
  year = dob.year;

  function ageDetermine(month, day, year){
    let today = new Date();
    let monthDiff = (today.getMonth + 1) - month;
    let dayDiff = today.getDate - day;
    let yearDiff = today.getFullYear - year;
      if (yearDiff < 21){
        //age is less than 21 - no access to site
        let age = 20;
        return age;
      }
      else if (yearDiff > 21){
        //age is >21 - access to site
        let age = 21;
        return age;
      }
      else if (monthDiff < 0){
        // age is less than 21 - no access to site
        let age = 20;
        return age;
      }
      else if (monthDiff > 0){
        //age is > 21 - access to site
        let age = 21;
        return age;
      }
      else if (monthDiff = 0){
        if (dayDiff < 0){
          // age is less than 21 - no access to site
          let age = 20;
          return age;
        }
        else{
          //age is > 21 - access to site
          let age = 21;
          return age;
        }
      }
    }


  const age = ageDetermine(dob.month, dob.day, dob.year);
  if (age < 21){
    //no access to site
    //redirect to homepage
  }
  else{
    //redirect to settings page if userName is unique too.
  }
