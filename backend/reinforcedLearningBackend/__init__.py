from flask import Blueprint

rl_bp = Blueprint('reinforcedLearning', __name__)

from . import routes