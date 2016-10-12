    //Form
    var form = document.getElementById("form");

    form.addEventListener('submit', function(){
        var dataURL = canvas.toDataURL();
        if (signed === true){
            document.getElementsByName('signature')[0].value = dataURL;
        }
        else {
            document.getElementsByName('signature')[0].value = "not signed";
        }
    });

    // Draw & Listen to Canvas
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var xMD;
    var yMD;
    var yMM;
    var xMM;
    var flag = true;
    var signed = false;

    canvas.addEventListener('mousedown',function(e){
        xMD = e.layerX;
        yMD = e.layerY;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#df4b26";
        ctx.beginPath();
        ctx.moveTo(xMD,yMD);
        flag = false;
        signed = true;
    });

    canvas.addEventListener('mouseup', function(){
        flag = true;

    });

    canvas.addEventListener('mousemove', function(e){
        if(flag === false){
            xMM = e.layerX;
            yMM = e.layerY;
            ctx.lineTo(xMM,yMM);
            ctx.stroke();
        }
    });
