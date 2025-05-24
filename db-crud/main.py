from db_module import DatabaseConnection, TaskManager

def main():
    # Create database connection
    db = DatabaseConnection()
    try:
        # Connect to the database
        db.connect()
        
        # Create task manager
        task_manager = TaskManager(db)
        
        # Example operations
        print("\n=== Creating tasks ===")
        task1_id = task_manager.create_task("Complete project", "Finish the CRUD application")
        print(f"Created task with ID: {task1_id}")
        
        task2_id = task_manager.create_task("Write tests", "Create unit tests for the application")
        print(f"Created task with ID: {task2_id}")
        
        print("\n=== Reading all tasks ===")
        tasks = task_manager.get_all_tasks()
        for task in tasks:
            print(f"Task {task['id']}: {task['title']} - {task['description']} (Completed: {task['completed']})")
        
        print("\n=== Updating task ===")
        task_manager.update_task(task1_id, completed=True)
        updated_task = task_manager.get_task(task1_id)
        print(f"Updated task: {updated_task}")
        
        print("\n=== Deleting task ===")
        deleted = task_manager.delete_task(task2_id)
        print(f"Task deleted: {deleted}")
        
        print("\n=== Final task list ===")
        final_tasks = task_manager.get_all_tasks()
        for task in final_tasks:
            print(f"Task {task['id']}: {task['title']} - {task['description']} (Completed: {task['completed']})")
            
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        db.disconnect()

if __name__ == "__main__":
    main() 