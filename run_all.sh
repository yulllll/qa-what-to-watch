#!/bin/sh

while read student; do
    REPO="https://github.com/htmlacademy-univer-javascript-3/${student}-what-to-watch-1"
    git clone $REPO $student
    PROJECT="./${student}/project"
    if [ -d "$PROJECT" ]; then
        # сборка
        cd $PROJECT
        npm install
        npm start &

        # тест
        cd ../..
        export STUDENT=$student
        npm test
        mkdir -p "results/${student}-what-to-watch-1/videos"
        mkdir -p "results/${student}-what-to-watch-1/screenshots"
        mv ./cypress/videos/* "./results/${student}-what-to-watch-1/videos"
        mv ./cypress/screenshots/* "./results/${student}-what-to-watch-1/screenshots"
        mv result.txt "./results/${student}-what-to-watch-1"

        # чистка
        kill -9 $(lsof -t -i:3000)
        rm -r "./${student}"
        echo "test ${student} end"
    else 
        exit 1
    fi
    echo 'the end'
done <students.csv