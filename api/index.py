import sys
import os

# Add the aurasport-backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "aurasport-backend"))

from app.main import app
