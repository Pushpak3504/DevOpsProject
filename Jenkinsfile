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

        stage("Trivy Code Scan") {
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

        /* ===================== COLLECT REPORTS ===================== */

        stage("Archive Reports") {
            steps {
                archiveArtifacts artifacts: '*.json', fingerprint: true
            }
        }
    }

    /* ===================== EMAIL NOTIFICATION (SIMPLE) ===================== */

    post {
        success {
            mail(
                to: 'pushpaksumit001@gmail.com',
                subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
Pipeline SUCCESS ✅

Job Name : ${env.JOB_NAME}
Build No : ${env.BUILD_NUMBER}
Status   : SUCCESS

Build URL:
${env.BUILD_URL}

-- Jenkins
"""
            )
        }

        failure {
            mail(
                to: 'pushpaksumit001@gmail.com',
                subject: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
Pipeline FAILED ❌

Job Name : ${env.JOB_NAME}
Build No : ${env.BUILD_NUMBER}
Status   : FAILED

Build URL:
${env.BUILD_URL}

Please check Jenkins console logs.

-- Jenkins
"""
            )
        }
    }
}
