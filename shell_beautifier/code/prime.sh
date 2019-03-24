echo '2'
for ((i=3 ; $i<100; i++))
do
	is_it_prime=1
	for ((j=2; $j<$i; j++))
	do
		div_result=$(($i%$j)) 
		if [ $div_result -eq 0 ]
		then
			is_it_prime=0	
			break	
		fi
	done
	if [ $is_it_prime -eq 1 ]
	then
		echo $i		
	fi
done
