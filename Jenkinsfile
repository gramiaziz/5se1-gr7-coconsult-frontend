pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_IMAGE = 'zahraeloulabouafoura-g7-coconsult-front'  
        IMAGE_TAG = 'latest'  
    }

    stages {
        stage('Build angular') {
            steps {
                sh 'npm install --legacy-peer-deps'
                // sleep 60
                sh 'ng build'
            }
        }

        stage('Docker Build angular') {
            steps {
                script {
                    // Build Docker image for frontend
                    sh "docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Push angular Docker Image to Docker Hub') {
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
            mail to: 'zahrabou42@gmail.com',
                 subject: "Succès de Build : ${env.JOB_NAME} [#${env.BUILD_NUMBER}]",
                 body: "Le build a réussi ! Détails : ${env.BUILD_URL}"
        }
        
        failure {
            mail to: 'zahrabou42@gmail.com',
                 subject: "Échec de Build : ${env.JOB_NAME} [#${env.BUILD_NUMBER}]",
                 body: "Le build a échoué. Détails : ${env.BUILD_URL}"
        }
    }
}

