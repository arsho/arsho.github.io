echo "================================================================";
echo "                     SHELL BEAUTIFIER";
echo "================================================================";
cd=`cd`;

echo -n "Enter ouput filename in a word(without extension): ";
read outputfilename;

headertext=`cat assets/header.txt`;
footertext=`cat assets/footer.txt`;
output="$outputfilename.html";

echo "";
echo "Instructions:";
echo "=============";
echo "#Enter one or multiple filenames. Keep space between filenames.";
echo " Example: Enter filename to beautify: power.sh eee.sh sho.sh";
echo "";
echo "#Or enter \"all\" (without quote) to beautify all files.";
echo " Example: Enter filename to beautify: all";
echo "";
echo "";

echo -n "Enter filename to beautify: ";
read inputfilename;

if [ "$inputfilename" == "all" ];
then
    ls1="ls code -1";	#creating a string
    ls=`$ls1`;		#command line argument
else
    ls1=$inputfilename;
    ls=$ls1;
fi

lsarray=( $ls );	#creating array from the output string
len=${#lsarray[@]};	#getting array length

total_added_file=0;
if [ $len -ne 0 ];	#show the files if length is not 0
then
    echo "$headertext" >> $output;
	for((i=0;i<len;i++))
	do
		accname="$outputfilename$i";
		singlefile="code/"${lsarray[$i]};
		singlefilename=${lsarray[$i]};
		if [ -f "$singlefile" ];
		then
			shelltext=`cat "$singlefile"`;
			#<!--panel panel-default starts-->
			modval=$(($i%2));
			if [ $modval == 0 ];
			then
				echo "<div data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to toggle $singlefilename\" class=\"panel panel-default\">" >> $output;
			else
				echo "<div data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to toggle $singlefilename\" class=\"panel panel-info\">" >> $output;
			fi
				#<!--panel-heading-->
				echo "<div data-toggle=\"collapse\" href=\"#$accname\" class=\"panel-heading\">" >> $output;
					echo "<h4 class=\"panel-title\">" >> $output;
						echo "$singlefilename" >> $output;
					echo "</h4>" >> $output;
				#<!--/panel-heading-->
				echo "</div>" >> $output;

				#<!--panel-collapse collapse-->
				echo "<div id=\"$accname\" class=\"panel-collapse collapse\">" >> $output;
					#<!--panel-body-->
					echo "<div class=\"panel-body\">" >> $output;
						echo "<pre class=\"brush: shell;\">" >> $output;
							echo "$shelltext">> $output;
						echo "</pre>" >> $output;
					#<!--/panel-body-->
					echo "</div>" >> $output;
				#<!--/panel-collapse collapse-->
				echo " </div>" >> $output;

			#<!--/panel panel-default starts-->
			echo " </div>" >> $output;

			total_added_file=$(($total_added_file+1));
		fi
	done

	echo "$footertext" >> $output;
    echo "";
    echo "Shell Beautifier has created \"$output\"";
    echo "================================================================";
	echo "$total_added_file beautified shell scripts are added in \"$output\".";
	echo "Open \"$output\" to see beatutified shell scripts.";
	echo "";
	echo "";
	echo "================================================================";
	echo "             * Thanks for using Shell Beautifier *";
	echo "================================================================";
fi
echo ""								#printing blank line
