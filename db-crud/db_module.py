import mysql.connector
from mysql.connector import Error
from datetime import datetime
from typing import List, Dict, Optional, Any

class DatabaseConnection:
    def __init__(self, host="localhost", user="user", password="password", database="ia"):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.connection = None

    def connect(self):
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database
            )
            print("Successfully connected to the database")
        except Error as e:
            print(f"Error connecting to MySQL: {e}")
            raise

    def disconnect(self):
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("Database connection closed")

class TaskManager:
    def __init__(self, db_connection: DatabaseConnection):
        self.db = db_connection

    def create_task(self, title: str, description: str) -> int:
        try:
            cursor = self.db.connection.cursor()
            query = """
                INSERT INTO task (title, description)
                VALUES (%s, %s)
            """
            cursor.execute(query, (title, description))
            self.db.connection.commit()
            task_id = cursor.lastrowid
            cursor.close()
            return task_id
        except Error as e:
            print(f"Error creating task: {e}")
            raise

    def get_task(self, task_id: int) -> Optional[Dict[str, Any]]:
        try:
            cursor = self.db.connection.cursor(dictionary=True)
            query = "SELECT * FROM task WHERE id = %s"
            cursor.execute(query, (task_id,))
            task = cursor.fetchone()
            cursor.close()
            return task
        except Error as e:
            print(f"Error getting task: {e}")
            raise

    def get_all_tasks(self) -> List[Dict[str, Any]]:
        try:
            cursor = self.db.connection.cursor(dictionary=True)
            query = "SELECT * FROM task"
            cursor.execute(query)
            tasks = cursor.fetchall()
            cursor.close()
            return tasks
        except Error as e:
            print(f"Error getting all tasks: {e}")
            raise

    def update_task(self, task_id: int, title: Optional[str] = None, 
                    description: Optional[str] = None, completed: Optional[bool] = None) -> bool:
        try:
            cursor = self.db.connection.cursor()
            update_parts = []
            values = []

            if title is not None:
                update_parts.append("title = %s")
                values.append(title)
            if description is not None:
                update_parts.append("description = %s")
                values.append(description)
            if completed is not None:
                update_parts.append("completed = %s")
                values.append(completed)

            if not update_parts:
                return False

            query = f"UPDATE task SET {', '.join(update_parts)} WHERE id = %s"
            values.append(task_id)

            cursor.execute(query, tuple(values))
            self.db.connection.commit()
            affected_rows = cursor.rowcount
            cursor.close()
            return affected_rows > 0
        except Error as e:
            print(f"Error updating task: {e}")
            raise

    def delete_task(self, task_id: int) -> bool:
        try:
            cursor = self.db.connection.cursor()
            query = "DELETE FROM task WHERE id = %s"
            cursor.execute(query, (task_id,))
            self.db.connection.commit()
            affected_rows = cursor.rowcount
            cursor.close()
            return affected_rows > 0
        except Error as e:
            print(f"Error deleting task: {e}")
            raise 