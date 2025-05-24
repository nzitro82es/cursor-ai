#!/usr/bin/env python3
import argparse
from db_module import DatabaseConnection, TaskManager

def setup_connection():
    db = DatabaseConnection()
    db.connect()
    return db, TaskManager(db)

def list_tasks():
    db, task_manager = setup_connection()
    try:
        tasks = task_manager.get_all_tasks()
        if not tasks:
            print("No tasks found.")
            return
        
        print("\nAll Tasks:")
        print("-" * 80)
        print(f"{'ID':<5} {'Title':<30} {'Description':<30} {'Completed':<10}")
        print("-" * 80)
        for task in tasks:
            print(f"{task['id']:<5} {task['title'][:28]:<30} {task['description'][:28]:<30} {'Yes' if task['completed'] else 'No':<10}")
    finally:
        db.disconnect()

def get_task(task_id):
    db, task_manager = setup_connection()
    try:
        task = task_manager.get_task(task_id)
        if task:
            print("\nTask Details:")
            print("-" * 40)
            print(f"ID: {task['id']}")
            print(f"Title: {task['title']}")
            print(f"Description: {task['description']}")
            print(f"Completed: {'Yes' if task['completed'] else 'No'}")
            print(f"Created at: {task['created_at']}")
            print(f"Updated at: {task['updated_at']}")
        else:
            print(f"Task with ID {task_id} not found.")
    finally:
        db.disconnect()

def create_task(title, description):
    db, task_manager = setup_connection()
    try:
        task_id = task_manager.create_task(title, description)
        print(f"Task created successfully with ID: {task_id}")
    finally:
        db.disconnect()

def update_task(task_id, title=None, description=None, completed=None):
    db, task_manager = setup_connection()
    try:
        if completed is not None:
            completed = completed.lower() in ('yes', 'true', '1', 'y')
        success = task_manager.update_task(task_id, title, description, completed)
        if success:
            print(f"Task {task_id} updated successfully.")
        else:
            print(f"Failed to update task {task_id}.")
    finally:
        db.disconnect()

def delete_task(task_id):
    db, task_manager = setup_connection()
    try:
        success = task_manager.delete_task(task_id)
        if success:
            print(f"Task {task_id} deleted successfully.")
        else:
            print(f"Failed to delete task {task_id}.")
    finally:
        db.disconnect()

def main():
    parser = argparse.ArgumentParser(description='Task Manager CLI')
    subparsers = parser.add_subparsers(dest='command', help='Commands')

    # List command
    subparsers.add_parser('list', help='List all tasks')

    # Get command
    get_parser = subparsers.add_parser('get', help='Get a specific task')
    get_parser.add_argument('task_id', type=int, help='Task ID')

    # Create command
    create_parser = subparsers.add_parser('create', help='Create a new task')
    create_parser.add_argument('title', help='Task title')
    create_parser.add_argument('description', help='Task description')

    # Update command
    update_parser = subparsers.add_parser('update', help='Update a task')
    update_parser.add_argument('task_id', type=int, help='Task ID')
    update_parser.add_argument('--title', help='New task title')
    update_parser.add_argument('--description', help='New task description')
    update_parser.add_argument('--completed', help='Task completion status (yes/no)')

    # Delete command
    delete_parser = subparsers.add_parser('delete', help='Delete a task')
    delete_parser.add_argument('task_id', type=int, help='Task ID')

    args = parser.parse_args()

    if args.command == 'list':
        list_tasks()
    elif args.command == 'get':
        get_task(args.task_id)
    elif args.command == 'create':
        create_task(args.title, args.description)
    elif args.command == 'update':
        update_task(args.task_id, args.title, args.description, args.completed)
    elif args.command == 'delete':
        delete_task(args.task_id)
    else:
        parser.print_help()

if __name__ == '__main__':
    main() 