FROM public.ecr.aws/lambda/python:3.10

WORKDIR /var/task
COPY requirements.txt ./
RUN python3.10 -m pip install -r requirements.txt
COPY . .

CMD ["main.handler"]