#!/bin/bash

# Activate virtual environment if using one
# source .venv/bin/activate

# Install required dependencies
pip install -r requirements.txt

# Run tests with pytest
python -m pytest tests/ -v 