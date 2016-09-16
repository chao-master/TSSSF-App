#!/bin/bash
err=$(compare -metric MAE expected/$1.png results/$1.png results/$1-diff.png 2>&1 | cut -f 1 -d " ")
echo "Error: $err"
if (( $(echo "$err < 500" | bc -l) )); then
  echo "Test pass"
  exit 0
else
  echo "Test fail"
  exit 1
fi
