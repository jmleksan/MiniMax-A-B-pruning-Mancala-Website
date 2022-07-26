<!DOCTYPE html>
<html lang="en">
    <head>
        <title>
            Mancala AI
        </title>
        <script src="mancala.js"></script>
        <link rel="stylesheet" type="text/css" href="mancala.css">
    </head>
    <body>
        <h1 style="text-align:center;">
            Mancala AI
        </h1>
        <div class="row">
            <div class="column left"> <p>
                Mancala is a game about stones playing leapfrog or something. This website can be played by two players
                or against the AI, which uses a MiniMax algorithim with alpha-beta pruning, by clicking the button below. 
            </p>
            <button onclick="return AIButton()"><span id="AIButton"></span></button>
            <p>
                <div><span id="moves"></span></div>
            </p>
        </div>
            <div class="column right">
                <div class="imageContainer">
                <img src="Mancala Board.jpg" usemap="#board">
                <div class="caption current"><span id="currentPlayer"></span></div>
                <div class="caption p10"><span id="00" onclick="return Validate(board,0,0,score)"></span></div>
                <div class="caption p11"><span id="01" onclick="return Validate(board,0,1,score)"></span></div>
                <div class="caption p12"><span id="02" onclick="return Validate(board,0,2,score)"></span></div>
                <div class="caption p13"><span id="03" onclick="return Validate(board,0,3,score)"></span></div>
                <div class="caption p14"><span id="04" onclick="return Validate(board,0,4,score)"></span></div>
                <div class="caption p15"><span id="05" onclick="return Validate(board,0,5,score)"></span></div>
                <div class="caption p1s"><span id="1s"></span></div>
                <div class="caption p20"><span id="10" onclick="return Validate(board,1,0,score)"></span></div>
                <div class="caption p21"><span id="11" onclick="return Validate(board,1,1,score)"></span></div>
                <div class="caption p22"><span id="12" onclick="return Validate(board,1,2,score)"></span></div>
                <div class="caption p23"><span id="13" onclick="return Validate(board,1,3,score)"></span></div>
                <div class="caption p24"><span id="14" onclick="return Validate(board,1,4,score)"></span></div>
                <div class="caption p25"><span id="15" onclick="return Validate(board,1,5,score)"></span></div>
                <div class="caption p2s"><span id="2s"></span></div>
                </div>
            <map name="board">
                <area target="" alt="0,0" title="0,0" href="" coords="190,99,46" shape="circle" onclick="return Validate(board,0,0,score)">
                <area target="" alt="0,1" title="0,1" href="" coords="293,101,47" shape="circle" onclick="return Validate(board,0,1,score)">
                <area target="" alt="0,2" title="0,2" href="" coords="397,100,46" shape="circle" onclick="return Validate(board,0,2,score)">
                <area target="" alt="0,3" title="0,3" href="" coords="502,101,46" shape="circle" onclick="return Validate(board,0,3,score)">
                <area target="" alt="0,4" title="0,4" href="" coords="605,100,47" shape="circle" onclick="return Validate(board,0,4,score)">
                <area target="" alt="0,5" title="0,5" href="" coords="709,100,47" shape="circle" onclick="return Validate(board,0,5,score)">
                <area target="" alt="1,0" title="1,0" href="" coords="190,430,47" shape="circle" onclick="return Validate(board,1,0,score)">
                <area target="" alt="1,1" title="1,1" href="" coords="295,429,46" shape="circle" onclick="return Validate(board,1,1,score)">
                <area target="" alt="1,2" title="1,2" href="" coords="398,429,47" shape="circle" onclick="return Validate(board,1,2,score)">
                <area target="" alt="1,3" title="1,3" href="" coords="501,431,48" shape="circle" onclick="return Validate(board,1,3,score)">
                <area target="" alt="1,4" title="1,4" href="" coords="605,430,47" shape="circle" onclick="return Validate(board,1,4,score)">
                <area target="" alt="1,5" title="1,5" href="" coords="708,429,48" shape="circle" onclick="return Validate(board,1,5,score)">
            </map>
        </div>
          </div> 
        <script>
            document.getElementById("00").innerHTML = board[0][0];
            document.getElementById("01").innerHTML = board[0][1];
            document.getElementById("02").innerHTML = board[0][2];
            document.getElementById("03").innerHTML = board[0][3];
            document.getElementById("04").innerHTML = board[0][4];
            document.getElementById("05").innerHTML = board[0][5];
            document.getElementById("1s").innerHTML = score[0];
            document.getElementById("10").innerHTML = board[1][0];
            document.getElementById("11").innerHTML = board[1][1];
            document.getElementById("12").innerHTML = board[1][2];
            document.getElementById("13").innerHTML = board[1][3];
            document.getElementById("14").innerHTML = board[1][4];
            document.getElementById("15").innerHTML = board[1][5];
            document.getElementById("2s").innerHTML = score[1];
            document.getElementById("currentPlayer").innerHTML = "Current Player: Player 1"
            document.getElementById("AIButton").innerHTML = "Turn AI On"
        </script>
    </body>
</html>
