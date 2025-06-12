# Git инструкции за писане на код и добавяне на нов feature
! (Не е задължително да използвате команди ако сте свикнали с UI, важно е да се следва принципа на работа, за да се избегнат проблеми с git-a)

## 1. Създаване на feature бранч (с твое име):

git checkout development
git pull origin development
git checkout -b yourname/feature-name

Пример: ако си Джонката и работиш по login функционалността, бранчът ще е:

git checkout -b johnkata/login

## 2. Пишем код, когато сме готови - commit-ваме:

git add .
git commit -m "Добавя нов feature: описание"

## 3. Пушване на feature бранча:

git push origin yourname/feature-name

## 4. Създаване на Pull Request (PR) към development

- Правиш PR от yourname/feature-name към development.

## 5. Ако има конфликти:

- НЕ затваряй PR-а.
- В локалното копие:

git checkout yourname/feature-name
git fetch origin
git merge origin/development

## 6. Реши конфликтите, ако има

git add .
git commit -m "Development merge, resolved conflicts"
git push origin yourname/feature-name

##7. След одобрение и мърдж:

git checkout development
git pull origin development
git branch -d yourname/feature-name
git push origin --delete yourname/feature-name
