# How to First Start the App

1. Run `git clone https://github.com/ezAldinWaez/RoadEyeApp.git` then `cd .\RoadEyeApp`;
2. Create new Conda enviroment and activate it;
3. Run `conda install anaconda::django conda-forge::celery conda-forge::djangorestframework conda-forge::django-cors-headers`;
4. Download 'Redis-x64-5.0.14.1.zip' and extract it into 'C:\Redis';
5. Run `conda install anaconda::redis` then `pip install channels-redis`;
6. Run `conda install pytorch torchvision torchaudio cpuonly -c pytorch` then `conda install -c conda-forge ultralytics celery`;
7. Run `python .\backendapp\manage.py makemigrations`;
8. Run `python .\backendapp\manage.py migrate`;
9. Run `cd .\frontend` then `npm install`.

# How to Run the App

1. Run `cd C:\Redis` then `.\redis-server.exe` on the 1st terminal;
2. Run `cd .\backenapp` then `celery -A backendapp worker --pool=solo -l info` on the 2nd terminal;
3. Run `cd .\backenapp` then `daphne backendapp.asgi:application` on the 3rd terminal;
4. Run `cd .\frontendapp` then `npm start` on the 4th terminal;
