pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = credentials('docker') // Jenkins credentials ID
    IMAGE_PREFIX = 'aaron2905/sentiment-app'
  }

  stages {
    stage('Checkout') {
      steps {
       git checkout "https://github.com/Aaron-Joel-Fernandes/notesentiment.git"
      }
    }

    stage('Build Backend') {
      steps {
        dir('backend') {
          sh 'npm install'
          sh "docker build -t $IMAGE_PREFIX-backend:latest ."
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('frontend') {
          sh 'npm install'
          sh "docker build -t $IMAGE_PREFIX-frontend:latest ."
        }
      }
    }

    stage('Push Docker Images') {
      steps {
        script {
          sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin"
          sh "docker push $IMAGE_PREFIX-backend:latest"
          sh "docker push $IMAGE_PREFIX-frontend:latest"
        }
      }
    }

    stage('Deploy (Optional)') {
      when {
        expression { fileExists('docker-compose.yml') }
      }
      steps {
        sh 'docker compose down || true'
        sh 'docker compose up -d'
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
