echo 'How many numbers in your array? '
read n
echo "Enter "$n" numbers below: "
for ((i=0;$i<$n;i++))
do
	read current_num
	ar[$i]=$current_num
done
echo "Array contains = "${ar[*]}
echo "Array length = "${#ar[*]}
