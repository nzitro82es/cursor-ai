# Task Manager CRUD Application

This is a simple CRUD (Create, Read, Update, Delete) application for managing tasks using Python and MySQL.

## Prerequisites

- Docker and Docker Compose
- Python 3.8 or higher
- pip (Python package installer)

## Project Structure

```
.
├── README.md
├── requirements.txt
├── docker-compose.yml
├── init.sql
├── db_module.py
├── main.py
└── test_db_module.py
```

## Setup and Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install the required packages:
```bash
pip install -r requirements.txt
```

4. Start the MySQL container:
```bash
docker-compose up -d
```

## Running the Application

1. Run the main program:
```bash
python main.py
```

This will demonstrate the CRUD operations by:
- Creating new tasks
- Reading tasks
- Updating a task
- Deleting a task

## Running the Tests

To run the tests:
```bash
pytest test_db_module.py -v
```

## Database Configuration

The MySQL database is configured with the following default settings:
- Host: localhost
- Port: 3306
- Database: ia
- User: user
- Password: password

These settings can be modified in the `docker-compose.yml` file and `db_module.py`.

## Stopping the Application

To stop the MySQL container:
```bash
docker-compose down
```

To remove all data volumes:
```bash
docker-compose down -v
``` 