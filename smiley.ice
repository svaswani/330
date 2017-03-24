<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Smiley ICE</title>

    <link rel="shortcut icon" href="favicon.ico">

    <script>
    // #0 - In this course we will always use ECMAScript 5's "strict" mode
    // See what 'use strict' does here:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
    'use strict';
    
    // #1 call the init function after the pages loads
    // this is called an "event handler"
    window.onload = init;
  
    function init(){            
      // #2 Now that the page has loaded, start drawing!
      console.log('init called');
      
      // A - canvas variable points at <canvas> tag
        var canvas = document.querySelector('canvas');
      
      // B - the ctx variable points at a "2D drawing context"
      var ctx = canvas.getContext('2d');
            
            
            // sky
            // B38CB4
            ctx.fillStyle = "#B38CB4";
            ctx.fillRect(0, 0, 800, 400);

            // ground
            // #C5A48A
            ctx.fillStyle = "#C5A48A";
            ctx.fillRect(0, 400, 800, 100);

            // horizon
            ctx.lineWidth = 5;
            ctx.strokeStyle = "#DDC67B";
            ctx.beginPath();
            ctx.moveTo(0, 400);
            ctx.lineTo(800, 400);
            ctx.closePath();
            ctx.stroke();

            // 4 arcs
            //      face
            ctx.fillStyle = "#F8F272";
            ctx.beginPath();
            ctx.arc(375, 250, 200, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();

            // eyes
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(300, 200, 50, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(450, 200, 50, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();

            // pupils
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(300, 175, 20, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(450, 175, 20, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();

            // mouth
            ctx.lineWidth = 6;
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.moveTo(300, 350);
            ctx.lineTo(450, 350);
            ctx.closePath();
            ctx.stroke();

            //tree
            ctx.fillStyle="#64504D";
            ctx.fillRect(250,50,50,50);
            
            ctx.fillStyle="green";
            ctx.beginPath();
            ctx.moveTo(300,25);
            ctx.lineTo(300,125);
            ctx.lineTo(500,75);
            ctx.closePath();
            ctx.fill();

           

            // ctx.fillStyle = "#E1F4CB";
            // ctx.fillRect(0, 0, 1000, 1000);

        }
  </script>
  </head>

  <body>
    <canvas width="800" height="500">
    Get a real browser!
    <!-- The user will only see the above text if their browser is older and doesn't support <canvas> -->
    </canvas>
  
  </body>
</html>