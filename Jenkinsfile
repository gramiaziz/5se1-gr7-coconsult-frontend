pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_IMAGE = 'ktarichaima-g7-coconsult-front'  
        IMAGE_TAG = 'latest'  
    }

    stages {
        stage('Build Frontend') {
            steps {
                sh 'npm install'
                // Add --legacy-peer-deps to bypass dependency conflict
                sh 'npm install --legacy-peer-deps'
                sh 'ng build'
            }
        }

        stage('Docker Build Frontend') {
            steps {
                script {
                    // Build Docker image for frontend
                    sh "docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Push Frontend Docker Image to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        retry(3) { // Retry up to 3 times
                            // Login to Docker Hub
                            sh script: "echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USERNAME --password-stdin", returnStdout: true

                            // Tag the Docker image
                            sh "docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} \$DOCKER_USERNAME/${DOCKER_IMAGE}:${IMAGE_TAG}"

                            // Push the Docker image
                            sh "docker push \$DOCKER_USERNAME/${DOCKER_IMAGE}:${IMAGE_TAG}"
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                // Send a success message to Slack with image name and tag
                slackSend(channel: '#jenkins-messg', 
                          message: "Le build de pipeline Frontend a réussi : ${env.JOB_NAME} #${env.BUILD_NUMBER} ! Image pushed: ${DOCKER_IMAGE}:${IMAGE_TAG} successfully.")
            }
        }
        failure {
            script {
                // Send a failure message to Slack
                slackSend(channel: '#jenkins-messg', 
                          message: "Le build de pipeline Frontend a échoué : ${env.JOB_NAME} #${env.BUILD_NUMBER}.")
            }
        }
    }
}
