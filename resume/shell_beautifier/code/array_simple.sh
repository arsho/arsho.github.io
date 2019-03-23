echo 'Array example'
my_ar[0]=238
my_ar[1]=29
my_ar[2]=5

echo ''
echo "My array first element = "${my_ar[0]}
echo "My array second element = "${my_ar[1]}
echo "My array third element = "${my_ar[2]}
echo "My array all elements = "${my_ar[*]}
echo ''


my_ar_length=${#my_ar[*]}

echo "My array length = "$my_ar_length
echo ''

echo "Accessing array element using loop"
sum=0
for ((i=0;$i<$my_ar_length;i++))
do
	echo "My array value at index "$i" = "${my_ar[$i]}
	sum=$(($sum+${my_ar[$i]}))
done
echo ''
echo "Array sum = "$sum
echo ''


echo 'Bubble sort'
for ((i=0;$i<$my_ar_length;i++))
do
	for((j=$i;$j<$my_ar_length;j++))
	do
		if [ ${my_ar[$j]} -le ${my_ar[$i]} ]
		then
			temp=${my_ar[$i]}
			my_ar[$i]=${my_ar[$j]}
			my_ar[$j]=$temp
		fi
	done
done
echo 'Sorted My Array = '${my_ar[*]}
