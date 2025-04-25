# Select base image
FROM python:3.10-slim

# Create working directory
WORKDIR /app

# Copy required files
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run Flask
CMD ["python", "app.py"]
