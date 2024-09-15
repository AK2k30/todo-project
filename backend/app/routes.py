from flask import Blueprint, request, jsonify
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from .models import Task
from . import db
import logging

main = Blueprint('main', __name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def handle_error(e):
    logger.error(f"An error occurred: {str(e)}")
    return jsonify(error=str(e)), 500

@main.route('/')
def ping_server():
    return 'Server is up and running'

@main.route('/tasks', methods=['POST'])
def create_task():
    try:
        data = request.json
        if not data or 'name' not in data:
            return jsonify(error="Missing task name"), 400
        new_task = Task(name=data['name'])
        db.session.add(new_task)
        db.session.commit()
        return jsonify(new_task.to_dict()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify(error="Task with this name already exists"), 409
    except SQLAlchemyError as e:
        db.session.rollback()
        return handle_error(e)

@main.route('/tasks', methods=['GET'])
def get_tasks():
    try:
        tasks = Task.query.filter_by(is_deleted=False).all()
        return jsonify([task.to_dict() for task in tasks])
    except SQLAlchemyError as e:
        return handle_error(e)

@main.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        task = Task.query.get_or_404(task_id)
        data = request.json
        if not data:
            return jsonify(error="No update data provided"), 400
        task.name = data.get('name', task.name)
        task.updated_at = db.func.now()
        db.session.commit()
        return jsonify(task.to_dict())
    except IntegrityError:
        db.session.rollback()
        return jsonify(error="Task with this name already exists"), 409
    except SQLAlchemyError as e:
        db.session.rollback()
        return handle_error(e)

@main.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        task = Task.query.get_or_404(task_id)
        task.is_deleted = True
        task.updated_at = db.func.now()
        db.session.commit()
        return '', 204
    except SQLAlchemyError as e:
        db.session.rollback()
        return handle_error(e)

@main.route('/tasks', methods=['DELETE'])
def delete_all_tasks():
    try:
        Task.query.update({Task.is_deleted: True, Task.updated_at: db.func.now()})
        db.session.commit()
        return '', 204
    except SQLAlchemyError as e:
        db.session.rollback()
        return handle_error(e)

@main.errorhandler(404)
def not_found(error):
    return jsonify(error="Resource not found"), 404

@main.errorhandler(405)
def method_not_allowed(error):
    return jsonify(error="Method not allowed"), 405

@main.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify(error="Internal server error"), 500