#!/bin/bash

modified=$(find -type f -mtime -1)

if [[ -n $modified ]]; then

	git add .
	git commit -m "Files have been changed in the last 24 hours"
	git push

else 
	echo "No changes have been found"

fi
