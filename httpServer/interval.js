var intervalID = setInterval(myCallback, 500, 'Parameter 1', 'Parameter 2');

function myCallback(aa, bd)
{
 // Your code here
 // Parameters are purely optional.
 console.log(aa);
 console.log(bd);
}

intervalID;