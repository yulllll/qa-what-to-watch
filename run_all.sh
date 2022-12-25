#!/bin/sh

while read student; do
    REPO="https://github.com/htmlacademy-univer-javascript-3/${student}-what-to-watch-1"
    git clone $REPO $student
    PROJECT="./${student}/project"
    if [ -d "$PROJECT" ]; then
        cd $PROJECT
        npm install
        npm start &
        STUDENT_PROJECT_PID=$! # сохраняем pid для дальнейшей остановки
        kill -9 $STUDENT_PROJECT_PID
    else 
        exit 1
    fi
    rm -r "./${student}"
    echo 'the end'
done <students.csv