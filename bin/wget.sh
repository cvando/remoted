#!/bin/bash
url=$1
ppid=${$}
size=0
name=$2
down=""
comp=0
dt=`date '+%d/%m/%Y_%H:%M:%S'`
midldir=/etc/remoted
logs=/etc/remoted/logs
destdir=/data


###########//start wget log to pidperl.log
id="$(cat $logs/id)"
num=$((id+1))
echo "$num" > $logs/id
wgetpid="$(wget --content-disposition --restrict-file-names=nocontrol -bc $url -P $destdir -a $logs/$num.log)"

###########//retrieve pid wget
wpid="$(echo $wgetpid | sed 's/.*pid //;s/.$//')"

############//Insert new donwload
echo $url
mysql -h mysql -uuser -ppass download << EOF
insert into ENCOURS (ID,PERC,NAME,pid,URL) values ($num,0,"Loading....",$wpid,"$url");
EOF

echo "$dt OK $num insert "

while  [ "$down" != ".........." ];
do
down="$(cat $logs/$num.log |  tail -n 2 | head -1 | grep '..........' | awk '{print $5}')"
sleep 1
let comp++
echo $comp
if [ $comp -eq 10 ];
then

mysql -h mysql -uuser -ppass download << EOF
update ENCOURS set NAME="Link error" where ID=$num;
EOF

rm $logs/$num.log
echo "$dt KO $num link "
exit
fi
done

length="$(cat $logs/$num.log | grep Length: |  sed 's/ (.*//' |  sed 's/.*Length: //' | head -1)"
length=$(bc -l<<<"scale=2; $length/1000000000")

nome="$(grep 'Saving to:'  $logs/$num.log | sed 's/’.*//' |  sed 's/.*data//' | cut -c 2- | sed 's/.$//')"
echo "$dt OK $num $nome "
mysql -h mysql -uuser -ppass download << EOF
update ENCOURS set PERC=$length,NAME='$nome' where ID=$num;
EOF
sleep 1

############//update size
while kill -0 $wpid;
do
sizerest="$(ls -al $destdir | grep "$nome" | awk '{print $5}')"
speed="$(cat $logs/$num.log |  tail -n 2 | head -1 | grep '..........' | awk '{print $8}' | sed 's/.$//')"
tim="$(cat  $logs/$num.log |  tail -n 2 | head -1  | awk '{print $9}')"
(( size0 = $sizerest*100 ))
size=$(bc -l<<<"scale=2; $size0/$length/1000000000")
testspeed=$(echo $speed'>'200 | bc -l)
if [ $testspeed -eq 1 ]; then
	speed=$(bc -l<<<"$speed/1000")
fi

mysql -h mysql -uuser -ppass download << EOF
update ENCOURS set SIZE=$size,SPEED='$speed',TIME="$tim" where ID=$num;
EOF
done


mysql -h mysql -uuser -ppass download << EOF
update ENCOURS set SIZE=100,SPEED="0",TIME="Done" where ID=$num;
EOF

rm $logs/$num.log
echo "done"

#exit
