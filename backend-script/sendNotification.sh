echo "Ran at $(date)" >> notification.log

source=$(curl -s 'https://newsapi.org/v2/top-headlines?country=in&apiKey=49a521f45a0343c9bac0eabfafdc5936&sortBy=publishedAt' | jq -c '.articles[0].source.name')

source=$(echo $source|tr -d '"')


tit=$(curl -s 'https://newsapi.org/v2/top-headlines?country=in&apiKey=49a521f45a0343c9bac0eabfafdc5936&sortBy=publishedAt' | jq -c '.articles[0].title')

curl --include \
     --request POST \
     --header "Content-Type: application/json; charset=utf-8" \
     --header "Authorization: Basic MzI1YzAxOGEtODQxZi00YzU1LWI0MGEtOTk0ZjkyMzFhM2Jh" \
     --data-binary "{\"app_id\": \"1a0ac00a-118c-4692-b5be-abdbad477aa5\",
\"contents\": {\"en\": $tit},
\"headings\": {\"en\": \"$source\"},
\"included_segments\": [\"All\"]}" \
     https://onesignal.com/api/v1/notifications

