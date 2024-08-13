# How to First Start the App

1. Download 'Redis-x64-5.0.14.1.zip' and extract it into 'C:\Redis';
2. Run `git clone https://github.com/ezAldinWaez/RoadEyeApp.git` then `cd .\RoadEyeApp`;
4. Create new Conda enviroment and activate it;
5. Run `conda install pytorch torchvision torchaudio cpuonly -c pytorch` then `conda install `;
6. Run `conda install conda-forge::ultralytics anaconda::django conda-forge::celery conda-forge::djangorestframework conda-forge::django-cors-headers anaconda::redis`;
7. Run `pip install channels-redis`;
9. Run `python .\backendapp\manage.py makemigrations`;
10. Run `python .\backendapp\manage.py migrate`;
11. Run `cd .\frontend` then `npm install`.

# How to Run the App

1. Run `cd C:\Redis` then `.\redis-server.exe` on the 1st terminal;
2. Run `cd .\backendapp` then `celery -A backendapp worker --pool=solo -l info` on the 2nd terminal;
3. Run `cd .\backendapp` then `daphne backendapp.asgi:application` on the 3rd terminal;
4. Run `cd .\frontendapp` then `npm start` on the 4th terminal;
