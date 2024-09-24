#!/bin/bash

modified=$(find -type f -mtime -1)

if [[ -n $modified ]]; then
for file in $modified; do
	git add $file
	git commit -m "Files have been changed in the last 24 hours"
	git push

done

else 
	echo "No changes have been found"

fi
