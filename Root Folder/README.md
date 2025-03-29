# Quiz_App_V2
---

## Step1: Create and Activate Virtual Environment

```bash
cd Quiz-App-V2-main
python3 -m venv .venv
source .venv/bin/active
```


## Step2: Install Dependencies

```bash
pip install -r requirement.txt
```

## Step3: Start Redis

```bash
sudo service redis-server start
```

To check Redis is running
```bash
redis-cli ping  # return 'PONG'
```

## Step4: Start MailHog
```bash
~/go/bin/MailHog
```

## Step5: Start Celery Worker
```bash
celery -A app:celery_app worker -l INFO
```

## Step6: Start Celery Beat
```bash
celery -A app:celery_app beat -l INFO
```

## Step7: Start Flask App
```bash
python3 app.py
```
