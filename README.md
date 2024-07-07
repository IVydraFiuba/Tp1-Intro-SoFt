## Como correr el tp1

- Iniciar postgresSQL (Si no lo hace automaticamente)
```bash
#para iniciarlo
sudo systemctl start postgresql
#para ver el estado
sudo systemctl status postgresql
```
- Activar el entorno virtual
```bash
source entorno_tp/bin/activate
```
- Correr la app (backend)
```bash
python3 main.py
```
- Levantar server de python (Frontend)
```bash
python3 -m http.server 8000
```
## Dependencias del tp1

- #### Base de datos
    - postgresql (motor)
    - Dbeaver (gestor)
- #### Desarrollo
    - git

- ### dentro del entorno
    - flask
    - flask-corse
    #### Dependencias para trabajar con SQLAlchemy
    - libpq-dev
    - python3-dev
    - build-essential
    
    - psycopg2
    - Flask-SQLAlchemy
