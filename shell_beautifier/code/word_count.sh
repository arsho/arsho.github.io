echo 'Enter filename: '
read user_file
shell_command=`wc $user_file`
#shell_command=`ls -l`
output_ar=($shell_command)
echo ${output_ar[*]}
