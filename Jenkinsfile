pipeline {
  agent any

  environment {
    DOCKER_CREDENTIALS = credentials('docker') // Jenkins credentials ID
    IMAGE_PREFIX = 'aaron2905/sentiment-app'
  }

  stages {
    stage('Checkout') {
      steps {
       checkout scm
      }
    }

    stage('Build Backend') {
      steps {
        dir('backend') {
          bat 'npm install'
          bat "docker build -t $IMAGE_PREFIX-backend:latest ."
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('frontend') {
          bat 'npm install'
          bat "docker build -t $IMAGE_PREFIX-frontend:latest ."
        }
      }
    }

    stage('Push Docker Images') {
      steps {
          bat '''
            echo "$DOCKER_CREDENTIALS_PSW" | docker login -u "$DOCKER_CREDENTIALS_USR" --password-stdin
            docker push $IMAGE_PREFIX-backend:latest
            docker push $IMAGE_PREFIX-frontend:latest
          '''  
    }
    }

    stage('Deploy (Optional)') {
      when {
        expression { fileExists('docker-compose.yml') }
      }
      steps {
        bat 'docker compose down || true'
        bat 'docker compose up -d'
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
