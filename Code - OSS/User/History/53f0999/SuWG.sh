#!/bin/bash

# Get current volume level (0-100)
volume="$(pactl list sinks | grep 'Volume: front-left' | head -n 1 | sed -e 's,.* \([0-9][0-9]*\)%.*,\1,')"

# Send notification using mako
makoctl dismiss_all
makoctl print "Volume: ${volume}%"
