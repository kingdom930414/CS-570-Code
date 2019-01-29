//generate an array

var a = [];

for(var i=0;i<20;i++){
    a[i] = Math.floor((Math.random() * 10) + 1);
}

//sort

console.log(a);
console.log(lab5(a));

function lab5(a){
    
    var temp1 = 0;
    var temp2 = 0;
    var start = 0;
    var end = 0;

    for(var i=0;i<a.length-1;i++){
        
        if(i%2==0){
            for(var j=start;j<a.length-1-end;j++){
                if(a[j]>a[j+1]){
                    temp1 = a[j];
                    a[j] = a[j+1];
                    a[j+1] = temp1;
                    temp2++;
                }
            }
            end++;
        }else{
            for(var j=a.length-1-end;j>start;j--){
                if(a[j]<a[j-1]){
                    temp1 = a[j];
                    a[j] = a[j-1];
                    a[j-1] = temp1;
                    temp2++;
                }
            }
            start++;
        }

        if(temp2==0){
            break;
        }else{
            temp2 = 0;
        }
    }

    return a; 
}
