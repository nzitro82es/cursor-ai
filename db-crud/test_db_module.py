import pytest
from db_module import DatabaseConnection, TaskManager

@pytest.fixture
def db_connection():
    db = DatabaseConnection()
    db.connect()
    yield db
    db.disconnect()

@pytest.fixture
def task_manager(db_connection):
    return TaskManager(db_connection)

def test_create_task(task_manager):
    task_id = task_manager.create_task("Test Task", "Test Description")
    assert task_id is not None
    assert isinstance(task_id, int)

def test_get_task(task_manager):
    # Create a task first
    task_id = task_manager.create_task("Test Task", "Test Description")
    
    # Get the task
    task = task_manager.get_task(task_id)
    assert task is not None
    assert task['title'] == "Test Task"
    assert task['description'] == "Test Description"
    assert task['completed'] == 0

def test_update_task(task_manager):
    # Create a task first
    task_id = task_manager.create_task("Test Task", "Test Description")
    
    # Update the task
    updated = task_manager.update_task(task_id, title="Updated Task", completed=True)
    assert updated is True
    
    # Verify the update
    task = task_manager.get_task(task_id)
    assert task['title'] == "Updated Task"
    assert task['completed'] == 1

def test_delete_task(task_manager):
    # Create a task first
    task_id = task_manager.create_task("Test Task", "Test Description")
    
    # Delete the task
    deleted = task_manager.delete_task(task_id)
    assert deleted is True
    
    # Verify the deletion
    task = task_manager.get_task(task_id)
    assert task is None

def test_get_all_tasks(task_manager):
    # Create multiple tasks
    task_manager.create_task("Task 1", "Description 1")
    task_manager.create_task("Task 2", "Description 2")
    
    # Get all tasks
    tasks = task_manager.get_all_tasks()
    assert len(tasks) >= 2  # There might be more tasks from previous tests 