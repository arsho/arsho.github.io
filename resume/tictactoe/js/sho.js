/*
*	This is a single tic-tac-toe game with game details.
*	You can copy the code at your wish. To modify it easily 
*	I tried to describe each step with necessary comments.
*
*	You can contact with me at https://facebook.com/ars.shovon
*
*/

$(document).ready(function(){
		/*initialize the total number of winning by the players 
		and start counting games*/ 
		$player1Won=0;
		$player2Won=0;
		$matchCount=1;
		//PlayStartAudio();
		/*
		First show only the form with Player one and Player two name
		and	hide the result sheet with the grid
		*/ 
		$('#playgame').hide();
		$('#res').hide();
		$('#showplaygame').click(function(){
			$player1=$('#player1name').val();
			$player1img="<img src=\"image\\smile.png\"\\>";
			$player2="Computer";
			$player2img="<img src=\"image\\star.png\"\\>";
			//form validation, two players should provide their names
			if(($player1==null || $player1=='') || ($player2==null || $player2==''))
			{
				$('#msg').show();
			}
			/*if both players provide their names then hide the form 
			and show the grid with result sheet*/
			if($player1!='' &&  $player2!='')
			{
				PauseStartAudio();
				$('#info').removeClass('winac');
				$('#info').removeClass('winpc');
				$('#info').addClass('normal');
				$('#formshow').hide();
				$('#playgame').show();
				$('#thplayer1').text($player1);
				$('#thplayer2').text($player2);			
				$('#info').text($player1+" starts.");
				$('#res').show('slow');
				$resWidth=$('#showres').width();
				$gridWidth=$('#main').width();
				$('#resetgame').css('width',$resWidth);
				$('#info').css('width',$gridWidth);	
				$player1uppercase=$player1.toUpperCase();
				$firstletter=$player1uppercase.charAt(0);
				$thplayer1wide=$('#thplayer1').width();
				$thplayer2wide=$('#thplayer2').width();	
				if($thplayer1wide>$thplayer2wide){
				    $('#player2').css('width', $thplayer1wide);
				}
				else {
				    $('#player1').css('width', $thplayer2wide);
				}
				if(($firstletter>='A')&&($firstletter<='Z'))
				{
					$imgurl="<img src=\"image\\icon\\"+"Letter-"+$firstletter+"-icon.png\"\\>";
					$player1img=$imgurl;
				}
				if(($firstletter>='0')&&($firstletter<='9'))
				{
					$imgurl="<img src=\"image\\icon\\"+"Number-"+$firstletter+"-icon.png\"\\>";
					$player1img=$imgurl;
				}
					
			}
		});
	$('#resetgame').click(function(){
		location.reload();
	});
	function shoreset(){
		$('#info').removeClass('winac');
		$('#info').removeClass('winpc');
		$('#info').addClass('normal');
		//alert($matchCount);
		//setting the notification about game starts	
		$emptybox = [];
		$playerArray = [];
		$shoArray = [];
		if($matchCount%2==0)
		{
			$('#info').text($player2+" starts.");
		}
		else if($matchCount%2!=0)
		{
			$('#info').text($player1+" starts.");
		}
		$count=0;
		$gameOver=0;
		$i=0;
		//initially setting all values to "sho"
		$('.box').each(function(){
			$(this).attr('val',"sho");
			$(this).html('');			
		});
		if($matchCount%2==0){
			$count++;
			shoturn();
		}
	}
	$('#reset').click(function(){
		//alert($matchCount);
		//setting the notification about game starts	
		$('#info').removeClass('winac');
		$('#info').removeClass('winpc');
		$('#info').addClass('normal');
		$emptybox = [];
		$playerArray = [];
		$shoArray = [];
		if($matchCount%2==0)
		{
			$('#info').text($player2+" starts.");
		}
		else if($matchCount%2!=0)
		{
			$('#info').text($player1+" starts.");
		}
		$count=0;
		$gameOver=0;
		$i=0;
		//initially setting all values to "sho"
		$('.box').each(function(){
			$(this).attr('val',"sho");
			$(this).html('');			
		});
		if($matchCount%2==0){
			$count++;
			shoturn();
		}
	});
	//making the grid
	$('#box3').css('border-right','0px solid teal');
	$('#box6').css('border-right','0px solid teal');
	$('#box9').css('border-right','0px solid teal');
	$('#box7').css('border-bottom','0px solid teal');
	$('#box8').css('border-bottom','0px solid teal');
	$('#box9').css('border-bottom','0px solid teal');
	
	$scrHeight=screen.availHeight;
	$scrWidth=screen.availWidth;
	$actualBoxSize=Math.floor(($scrHeight-($scrHeight%100))/3.0);
	$boxHeight=($actualBoxSize)-3*($actualBoxSize%100);
	$('.wrapper').css('width',3*$boxHeight+20);
	$('.box').css('height',$boxHeight).css('width',$boxHeight);
	$count=0;
	$gameOver=0;
	$i=0;
	//initially setting all values to "sho"
	$('.box').each(function(){
		$(this).attr('val',"sho");
	});
	function checkX()
	{
		//getting all values from boxes
		$boxVal1=$('#box1').attr('val');
		$boxVal2=$('#box2').attr('val');
		$boxVal3=$('#box3').attr('val');
		$boxVal4=$('#box4').attr('val');
		$boxVal5=$('#box5').attr('val');
		$boxVal6=$('#box6').attr('val');
		$boxVal7=$('#box7').attr('val');
		$boxVal8=$('#box8').attr('val');
		$boxVal9=$('#box9').attr('val');
		//chcking for first player winning
		if(($boxVal1=="1" && $boxVal2=="1" && $boxVal3=="1")||($boxVal1=="1" && $boxVal4=="1" && $boxVal7=="1")||($boxVal1=="1" && $boxVal5=="1" && $boxVal9=="1")||($boxVal9=="1" && $boxVal6=="1" && $boxVal3=="1")||($boxVal7=="1" && $boxVal5=="1" && $boxVal3=="1")||($boxVal4=="1" && $boxVal5=="1" && $boxVal6=="1")||($boxVal7=="1" && $boxVal8=="1" && $boxVal9=="1")||($boxVal2=="1" && $boxVal5=="1" && $boxVal8=="1"))
		{
			$gameOver=1;
			return 5;
		}
		//chcking for second player winning
		if(($boxVal1=="2" && $boxVal2=="2" && $boxVal3=="2")||($boxVal1=="2" && $boxVal4=="2" && $boxVal7=="2")||($boxVal1=="2" && $boxVal5=="2" && $boxVal9=="2")||($boxVal9=="2" && $boxVal6=="2" && $boxVal3=="2")||($boxVal7=="2" && $boxVal5=="2" && $boxVal3=="2")||($boxVal4=="2" && $boxVal5=="2" && $boxVal6=="2")||($boxVal7=="2" && $boxVal8=="2" && $boxVal9=="2")||($boxVal2=="2" && $boxVal5=="2" && $boxVal8=="2"))
		{
			$gameOver=1;
			return 5;
		}
	}
	function isInArray($array,toCheck)
	{
		//alert("isInArray");
		for($i=0;$i<$array.length;$i++)
		{
			if($array[$i]==toCheck )
			{
				return true;	
			}
		}		
		return false;
	}
	//this function determines where to put computer's move
	function shoturn()
	{	

		
		$emptybox = [];		
		for ($i=1;$i<=9;$i++)
		{
			$idofbox="#box"+$i;
			$valofbox=$($idofbox).attr('val');
			if ($valofbox=="sho") {
				$emptybox.push($i);
			}
		}	
		$randnum = Math.floor(Math.random()*$emptybox.length);	
		$shomove = $emptybox[$randnum];
		$playerArray = [];	
		for ($i=1;$i<=9;$i++)
		{
			$idofbox="#box"+$i;
			$valofbox=$($idofbox).attr('val');
			if ($valofbox=="1") {
				$playerArray.push($i);
			}
		}	
		for ($j=0;$j<$playerArray.length;$j++)
		{
			if (isInArray($playerArray, 1) && isInArray($playerArray, 2) && isInArray($emptybox, 3)) {
				$shomove = 3;
			} else if (isInArray($playerArray, 1) && isInArray($playerArray, 3) && isInArray($emptybox, 2)) {
				$shomove = 2;
			} else if (isInArray($playerArray, 2) && isInArray($playerArray, 3) && isInArray($emptybox, 1)) {
				$shomove = 1;
			} else if (isInArray($playerArray, 4) && isInArray($playerArray, 5) && isInArray($emptybox, 6)) {
				$shomove = 6;
			} else if (isInArray($playerArray, 4) && isInArray($playerArray, 6) && isInArray($emptybox, 5)) {
				$shomove = 5;
			} else if (isInArray($playerArray, 5) && isInArray($playerArray, 6) && isInArray($emptybox, 4)) {
				$shomove = 4;
			} else if (isInArray($playerArray, 7) && isInArray($playerArray, 8) && isInArray($emptybox, 9)) {
				$shomove = 9;
			} else if (isInArray($playerArray, 7) && isInArray($playerArray, 9) && isInArray($emptybox, 8)) {
				$shomove = 8;
			} else if (isInArray($playerArray, 8) && isInArray($playerArray, 9) && isInArray($emptybox, 7)) {
				$shomove = 7;
			} else if (isInArray($playerArray, 1) && isInArray($playerArray, 4) && isInArray($emptybox, 7)) {
				$shomove = 7;
			} else if (isInArray($playerArray, 1) && isInArray($playerArray, 7) && isInArray($emptybox, 4)) {
				$shomove = 4;
			} else if (isInArray($playerArray, 4) && isInArray($playerArray, 7) && isInArray($emptybox, 1)) {
				$shomove = 1;
			} else if (isInArray($playerArray, 1) && isInArray($playerArray, 7) && isInArray($emptybox, 4)) {
				$shomove = 4;
			} else if (isInArray($playerArray, 2) && isInArray($playerArray, 5) && isInArray($emptybox, 8)) {
				$shomove = 8;
			} else if (isInArray($playerArray, 2) && isInArray($playerArray, 8) && isInArray($emptybox, 5)) {
				$shomove = 5;
			} else if (isInArray($playerArray, 5) && isInArray($playerArray, 8) && isInArray($emptybox, 2)) {
				$shomove = 2;
			} else if (isInArray($playerArray, 1) && isInArray($playerArray, 7) && isInArray($emptybox, 4)) {
				$shomove = 4;
			} else if (isInArray($playerArray, 3) && isInArray($playerArray, 6) && isInArray($emptybox, 9)) {
				$shomove = 9;
			} else if (isInArray($playerArray, 3) && isInArray($playerArray, 9) && isInArray($emptybox, 6)) {
				$shomove = 6;
			} else if (isInArray($playerArray, 6) && isInArray($playerArray, 9) && isInArray($emptybox, 3)) {
				$shomove = 3;
			} else if (isInArray($playerArray, 1) && isInArray($playerArray, 5) && isInArray($emptybox, 9)) {
				$shomove = 9;
			} else if (isInArray($playerArray, 1) && isInArray($playerArray, 9) && isInArray($emptybox, 5)) {
				$shomove = 5;
			} else if (isInArray($playerArray, 5) && isInArray($playerArray, 9) && isInArray($emptybox, 1)) {
				$shomove = 1;
			} else if (isInArray($playerArray, 3) && isInArray($playerArray, 5) && isInArray($emptybox, 7)) {
				$shomove = 7;
			} else if (isInArray($playerArray, 3) && isInArray($playerArray, 7) && isInArray($emptybox, 5)) {
				$shomove = 5;
			} else if (isInArray($playerArray, 5) && isInArray($playerArray, 7) && isInArray($emptybox, 3)) {
				$shomove = 3;
			} 
		}	
		$shoArray = [];	
		for ($i=1;$i<=9;$i++)
		{
			$idofbox="#box"+$i;
			$valofbox=$($idofbox).attr('val');
			if ($valofbox=="2") {
				$shoArray.push($i);
			}
		}	
		for ($j=0;$j<$shoArray.length;$j++)
		{
			if (isInArray($shoArray, 1) && isInArray($shoArray, 2) && isInArray($emptybox, 3)) {
				$shomove = 3;
			} else if (isInArray($shoArray, 1) && isInArray($shoArray, 3) && isInArray($emptybox, 2)) {
				$shomove = 2;
			} else if (isInArray($shoArray, 2) && isInArray($shoArray, 3) && isInArray($emptybox, 1)) {
				$shomove = 1;
			} else if (isInArray($shoArray, 4) && isInArray($shoArray, 5) && isInArray($emptybox, 6)) {
				$shomove = 6;
			} else if (isInArray($shoArray, 4) && isInArray($shoArray, 6) && isInArray($emptybox, 5)) {
				$shomove = 5;
			} else if (isInArray($shoArray, 5) && isInArray($shoArray, 6) && isInArray($emptybox, 4)) {
				$shomove = 4;
			} else if (isInArray($shoArray, 7) && isInArray($shoArray, 8) && isInArray($emptybox, 9)) {
				$shomove = 9;
			} else if (isInArray($shoArray, 7) && isInArray($shoArray, 9) && isInArray($emptybox, 8)) {
				$shomove = 8;
			} else if (isInArray($shoArray, 8) && isInArray($shoArray, 9) && isInArray($emptybox, 7)) {
				$shomove = 7;
			} else if (isInArray($shoArray, 1) && isInArray($shoArray, 4) && isInArray($emptybox, 7)) {
				$shomove = 7;
			} else if (isInArray($shoArray, 1) && isInArray($shoArray, 7) && isInArray($emptybox, 4)) {
				$shomove = 4;
			} else if (isInArray($shoArray, 4) && isInArray($shoArray, 7) && isInArray($emptybox, 1)) {
				$shomove = 1;
			} else if (isInArray($shoArray, 2) && isInArray($shoArray, 5) && isInArray($emptybox, 8)) {
				$shomove = 8;
			} else if (isInArray($shoArray, 2) && isInArray($shoArray, 8) && isInArray($emptybox, 5)) {
				$shomove = 5;
			} else if (isInArray($shoArray, 5) && isInArray($shoArray, 8) && isInArray($emptybox, 2)) {
				$shomove = 2;
			} else if (isInArray($shoArray, 3) && isInArray($shoArray, 6) && isInArray($emptybox, 9)) {
				$shomove = 9;
			} else if (isInArray($shoArray, 3) && isInArray($shoArray, 9) && isInArray($emptybox, 6)) {
				$shomove = 6;
			} else if (isInArray($shoArray, 6) && isInArray($shoArray, 9) && isInArray($emptybox, 3)) {
				$shomove = 3;
			} else if (isInArray($shoArray, 1) && isInArray($shoArray, 5) && isInArray($emptybox, 9)) {
				$shomove = 9;
			} else if (isInArray($shoArray, 1) && isInArray($shoArray, 9) && isInArray($emptybox, 5)) {
				$shomove = 5;
			} else if (isInArray($shoArray, 5) && isInArray($shoArray, 9) && isInArray($emptybox, 1)) {
				$shomove = 1;
			} else if (isInArray($shoArray, 3) && isInArray($shoArray, 5) && isInArray($emptybox, 7)) {
				$shomove = 7;
			} else if (isInArray($shoArray, 3) && isInArray($shoArray, 7) && isInArray($emptybox, 5)) {
				$shomove = 5;
			} else if (isInArray($shoArray, 5) && isInArray($shoArray, 7) && isInArray($emptybox, 3)) {
				$shomove = 3;
			}
		}
		$('#info').text($player1+"\'s move now");
		$idofbox="#box"+$shomove;
		$($idofbox).html($player2img);
		$($idofbox).attr('val','2');
		$boxVal=$($idofbox).attr('val');
		$checkXwin=checkX();
		if($checkXwin==5)
			{
				$('#info').removeClass('normal');
				$('#info').addClass('winpc');
				$('#info').text($player2+" Win!!!");
				$player2Won++;
				$('#player2').html($player2Won);
				$("#showres > tbody").append("<tr><td>"+$matchCount+"</td><td><img src=\"image\\crying.png\"\\></td><td><img src=\"image\\bigsmile.png\"\\></td></tr>");
				$matchCount++;
				PlayLossAudio();
				//alert($player2+" Win!");
			}
	}
function PlayAudio(){
   var v = document.getElementsByTagName("audio")[0];  
   v.play(); 
}
function PlayWinAudio(){
   var v = document.getElementsByTagName("audio")[1];  
   v.play(); 
}
function PlayLossAudio(){
   var v = document.getElementsByTagName("audio")[2];  
   v.play(); 
}
function PlayDrawAudio(){
   var v = document.getElementsByTagName("audio")[3];  
   v.play(); 
}
function PlayStartAudio(){
   var v = document.getElementsByTagName("audio")[4];  
   v.play(); 
}
function PauseStartAudio(){
   var v = document.getElementsByTagName("audio")[4];  
   v.pause(); 
}
	$('.box').click(function(){

		if($gameOver==0)
		{
			$thisId=$(this).attr('id');
			$thisVal=$(this).attr('val');
			//alternating each time starting
			if(($matchCount%2==1)&&($thisVal=="sho"))
			{
				PlayAudio();
				$count=$count+1;
				if(($count%2==1)&&($gameOver==0))
				{
					$('#info').text($player2+"\'s move now");
					$(this).html($player1img);
					$val=$(this).text();
					$(this).attr('val','1');
					$boxVal=$(this).attr('val');
					$checkXwin=checkX();
					if($checkXwin==5)
					{
						$('#info').text($player1+" Win!!!");
						$player1Won++;
						$('#info').removeClass('normal');
						$('#info').addClass('winac');
						$('#player1').html($player1Won);
						$("#showres > tbody").append("<tr><td>"+$matchCount+"</td><td><img src=\"image\\bigsmile.png\"\\></td><td><img src=\"image\\crying.png\"\\></td></tr>");
						$matchCount++;
						PlayWinAudio();
					}
					$count++;
					if(($count%2==0)&&($gameOver==0))
					{
						shoturn();
					}
				}
			}
			//alternating each time starting
			else if(($matchCount%2==0)&&($thisVal=="sho"))
			{
				PlayAudio();

				$count=$count+1;
				if(($count%2==0)&&($gameOver==0))
				{
					$('#info').text($player2+"\'s move now");
					$(this).show('slow').html($player1img).show('slow');
					$(this).attr('val','1');
					$boxVal=$(this).attr('val');
					$checkXwin=checkX();
					if($checkXwin==5)
					{
						$('#info').text($player1+" Win!!!");
						$('#info').removeClass('normal');
						$('#info').addClass('winac');
						$player1Won++;
						$('#player1').html($player1Won);
						$("#showres > tbody").append("<tr><td>"+$matchCount+"</td><td><img src=\"image\\bigsmile.png\"\\></td><td><img src=\"image\\crying.png\"\\></td></tr>");
						$matchCount++;
						PlayWinAudio();
					}
					$count++;
					if(($count%2==1)&&($gameOver==0))
					{
						shoturn();
					}
				}
			}
		}
		//checking for clicks after match finished
		else if($gameOver==1)
		{
			shoreset();
		}
		//checking for a tie match
		if($count>=9 && $gameOver==0)
		{
			PlayDrawAudio();
			$gameOver=1;
			$('#info').text("It's a tie!!!");						
			//alert("It's a tie!!!");
			$("#showres > tbody").append("<tr><td>"+$matchCount+"</td><td>Tie</td><td>Tie</td></tr>");
			$matchCount++;
		}
		//showing the total number of winning by the players with special css class
		if($player1Won>$player2Won)
		{
			$('#player1').removeClass('wa');
			$('#player1').removeClass('no');
			$('#player2').removeClass('ac');
			$('#player2').removeClass('no');
			$('#player1').addClass('ac');
			$('#player2').addClass('wa');
		}
		else if($player1Won<$player2Won)
		{
			$('#player1').removeClass('ac');
			$('#player1').removeClass('no');
			$('#player2').removeClass('wa');
			$('#player2').removeClass('no');
			$('#player2').addClass('ac');
			$('#player1').addClass('wa');
		}
		else if(($player1Won==$player2Won) && $player1Won!=0)
		{
			$('#player1').removeClass('ac');
			$('#player1').removeClass('wa');
			$('#player2').removeClass('wa');
			$('#player2').removeClass('ac');
			$('#player1').addClass('no');
			$('#player2').addClass('no');
		}
		
	});
/*Click function for my facebook link*/
$('#rib').click(function(){
			window.location.assign("https://www.facebook.com/ars.shovon")
		});
  // Tooltip only Text
        $('#rib , #showplaygame, #player1name').hover(function(){
                // Hover over code
                var title = $(this).attr('title');
				if(title!=""){
                $(this).data('tipText', title).removeAttr('title');
                $('<p class="tooltip"></p>')
                .text(title)
                .appendTo('body')
                .fadeIn('slow');
        }}, function() {
                // Hover out code
                $(this).attr('title', $(this).data('tipText'));
                $('.tooltip').remove();
        }).mousemove(function(e) {
        	var s=$(this).attr('id');
        	if(s=="rib"){
                var mousex = e.pageX -140; //Get X coordinates
                var mousey = e.pageY+35; //Get Y coordinates
            }
            else
            {
                var mousex = e.pageX -65; //Get X coordinates
                var mousey = e.pageY+22; //Get Y coordinates            	
            }
                $('.tooltip')
                .css({ top: mousey, left: mousex })
				
        });
});