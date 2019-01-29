var Seq = new Array();
var Startnum=10;
var Endnum=250;

creatArray(Startnum,Endnum,Seq);
FizzBuzzer(Seq);


function creatArray(startnum,endnum,Ar)
{
    var count=0;
    for (var i=startnum; i<=endnum; i++)  //creat a array from start number to end number
    {
        Ar[count]=i;    
        count++;
    }
    return Ar; 

}


function FizzBuzzer(Arr)
{
    for(var i=0; i<Seq.length; i++)
    {
        if((Arr[i] % 3 == 0) && (Arr[i] % 5 == 0))   //divisible by 3 and 5
            console.log("BuzzFizz");
        else if(Seq[i] % 3 == 0)    //divisible by 3
            console.log("Buzz");
        else if(Seq[i] % 5 == 0)    //divisble by 5
            console.log("Fizz");
        else
            console.log(Arr[i]);
    }
    return 0;
}