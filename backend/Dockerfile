# Use Python 3.9.10 slim version as a starting point
FROM python:3.9.10-slim-buster

# Set our working directory inside the container to /app
WORKDIR /app

# Copy the list of required Python packages from our project to the container
COPY requirements.txt ./

# Install all the Python packages listed in requirements.txt
# Additionally, install the python-dotenv package to manage environment variables
RUN pip install -r requirements.txt && pip install python-dotenv gunicorn

# Copy all of our project's files into the /app directory in the container
COPY . .

# Expose port 3000 to allow external connections
EXPOSE 3000

# Set Flask environment variables
ENV FLASK_APP=app
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=3000

# Define the default command to run when the container starts
# Use Gunicorn to run the Flask application
CMD ["gunicorn", "--bind", "0.0.0.0:3000", "app:create_app()"]