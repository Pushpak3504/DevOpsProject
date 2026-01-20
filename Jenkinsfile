pipeline {
    agent any

    environment {
        FRONTEND_HOST = "192.168.80.10"
        BACKEND_HOST  = "192.168.80.20"
        FRONTEND_DIR  = "/home/elliot/frontend"
        BACKEND_DIR   = "/home/elliot/backend"
    }

    stages {

        /* ===================== CHECKOUT ===================== */

        stage("Checkout Code") {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Pushpak3504/DevOpsProject.git'
            }
        }

        /* ===================== NPM AUDIT ===================== */

        stage("npm audit (Frontend)") {
            steps {
                sh '''
                cd frontend
                npm install --package-lock-only
                npm audit --json > ../npm-audit-frontend.json || true
                '''
            }
        }

        stage("npm audit (Backend)") {
            steps {
                sh '''
                cd backend
                npm install --package-lock-only
                npm audit --json > ../npm-audit-backend.json || true
                '''
            }
        }

        /* ===================== SONARQUBE ===================== */

        stage("SonarQube Analysis") {
            steps {
                withSonarQubeEnv('sonarqube') {
                    script {
                        def scannerHome = tool 'sonar-scanner'
                        sh """
                        ${scannerHome}/bin/sonar-scanner \
                          -Dsonar.projectKey=auth-platform \
                          -Dsonar.sources=frontend/src,backend/src
                        """
                    }
                }
            }
        }

        stage("Quality Gate") {
            steps {
                echo "Quality Gate checked asynchronously in SonarQube UI"
            }
        }

        /* ===================== TRIVY CODE SCAN ===================== */

        stage("Trivy Code Scan (Filesystem)") {
            steps {
                sh '''
                trivy fs . \
                  --security-checks vuln,secret,config \
                  --severity HIGH,CRITICAL \
                  --format json \
                  --output trivy-code-report.json || true
                '''
            }
        }

        /* ===================== DEPLOY FRONTEND ===================== */

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

        /* ===================== DEPLOY BACKEND ===================== */

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

        /* ===================== TRIVY IMAGE SCANS ===================== */

        stage("Trivy Frontend Image Scan") {
            steps {
                sh """
                ssh elliot@${FRONTEND_HOST} '
                  trivy image glass-frontend \
                    --severity HIGH,CRITICAL \
                    --format json \
                    --output /home/elliot/trivy-frontend-report.json || true
                '
                """
            }
        }

        stage("Trivy Backend Image Scan") {
            steps {
                sh """
                ssh elliot@${BACKEND_HOST} '
                  trivy image auth-backend \
                    --severity HIGH,CRITICAL \
                    --format json \
                    --output /home/elliot/trivy-backend-report.json || true
                '
                """
            }
        }

        /* ===================== COLLECT REPORTS ===================== */

        stage("Collect Security Reports") {
            steps {
                sh """
                scp elliot@${FRONTEND_HOST}:/home/elliot/trivy-frontend-report.json .
                scp elliot@${BACKEND_HOST}:/home/elliot/trivy-backend-report.json .
                """
                archiveArtifacts artifacts: '*.json', fingerprint: true
            }
        }
    }

    /* ===================== EMAIL NOTIFICATIONS ===================== */

    post {
        success {
            emailext(
                to: 'pushpaksumit001@gmail.com',
                subject: "✅ SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                mimeType: 'text/html',
                body: """
                <h2>Pipeline Successful ✅</h2>
                <p><b>Job:</b> ${env.JOB_NAME}</p>
                <p><b>Build:</b> #${env.BUILD_NUMBER}</p>
                <p><b>Status:</b> SUCCESS</p>
                <p><b>URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                <p>Regards,<br><b>Jenkins CI</b></p>
                """
            )
        }

        failure {
            emailext(
                to: 'pushpaksumit001@gmail.com',
                subject: "❌ FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                mimeType: 'text/html',
                attachLog: true,
                body: """
                <h2>Pipeline Failed ❌</h2>
                <p><b>Job:</b> ${env.JOB_NAME}</p>
                <p><b>Build:</b> #${env.BUILD_NUMBER}</p>
                <p><b>Status:</b> FAILED</p>
                <p><b>URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                <p>Please check attached console logs.</p>
                """
            )
        }
    }
}
