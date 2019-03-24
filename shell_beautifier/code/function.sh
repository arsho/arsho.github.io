custom_add()
{
	num1=$1
	num2=$2
	result=$(($num1+$num2))
	return $result
} 
custom_add 4 3
res=$?
echo $res
