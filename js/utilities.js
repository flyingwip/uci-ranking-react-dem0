function compareColumnByValue(p,order){

  return function(a, b)  {
    if (a[p] === b[p]) {
        return 0;
    }
    else {
        return (order=='up') ? a[p] - b[p]  : b[p] - a[p];
    }
  }
}


function compareColumnByNr(p,order){
  return function(a, b)  {
      if (a[p] === b[p]) {
          return 0;
      }
      else {
          return (order=='up') ? (a[p] < b[p]) ? -1 : 1  : (a[p] > b[p]) ? -1 : 1;
      }
  }
}

