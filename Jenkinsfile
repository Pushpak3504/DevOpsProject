pipeline {
  agent any

  environment {
    FRONTEND_HOST = "192.168.80.10"
    BACKEND_HOST  = "192.168.80.20"
    FRONTEND_DIR  = "/home/elliot/frontend"
    BACKEND_DIR   = "/home/elliot/backend"
  }

  stages {

    stage("Checkout Code") {
      steps {
        git branch: 'main',
            url: 'https://github.com/<your-username>/auth-platform.git'
      }
    }

    stage("SonarQube Analysis") {
      steps {
        withSonarQubeEnv('sonarqube') {
          sh '''
            sonar-scanner \
              -Dsonar.projectKey=auth-platform \
              -Dsonar.sources=frontend/src,backend/src
          '''
        }
      }
    }

    stage("Quality Gate") {
      steps {
        timeout(time: 2, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

    stage("Deploy Frontend") {
      steps {
        sh """
        ssh elliot@${FRONTEND_HOST} '
          rm -rf ${FRONTEND_DIR}
          mkdir -p ${FRONTEND_DIR}
        '

        rsync -av --delete frontend/ elliot@${FRONTEND_HOST}:${FRONTEND_DIR}/

        ssh elliot@${FRONTEND_HOST} '
          docker stop frontend || true
          docker rm frontend || true
          docker build -t glass-frontend ${FRONTEND_DIR}
          docker run -d \
            --name frontend \
            --network app_net \
            -p 3000:3000 \
            glass-frontend
        '
        """
      }
    }

    stage("Deploy Backend") {
      steps {
        sh """
        ssh elliot@${BACKEND_HOST} '
          rm -rf ${BACKEND_DIR}
          mkdir -p ${BACKEND_DIR}
        '

        rsync -av --delete backend/ elliot@${BACKEND_HOST}:${BACKEND_DIR}/

        ssh elliot@${BACKEND_HOST} '
          docker stop backend || true
          docker rm backend || true

          docker start mariadb || \
          docker run -d \
            --name mariadb \
            --network backend_net \
            -e MARIADB_ROOT_PASSWORD=rootpass \
            -e MARIADB_DATABASE=authdb \
            -e MARIADB_USER=appuser \
            -e MARIADB_PASSWORD=apppass \
            mariadb:11

          docker build -t auth-backend ${BACKEND_DIR}

          docker run -d \
            --name backend \
            --network backend_net \
            -p 5000:5000 \
            auth-backend
        '
        """
      }
    }
  }

  post {
    success {
      echo "✅ SonarQube passed, deployment successful"
    }
    failure {
      echo "❌ Pipeline failed (SonarQube or deploy)"
    }
  }
}
