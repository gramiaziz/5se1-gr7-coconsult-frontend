pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_IMAGE = 'ktarichaima-g7-coconsult-front'  
        IMAGE_TAG = 'latest'  
    }

    stages {
        stage('Checkout Frontend') {
            steps {
                script {
                    // Vérification de l'accessibilité du dépôt Git
                    def gitStatus = sh(script: 'git ls-remote https://github.com/gramiaziz/5se1-gr7-coconsult-frontend.git', returnStatus: true)
                    if (gitStatus != 0) {
                        error("Failed to access Git repository")
                    }
                }
                // Checkout du code depuis le dépôt Git
                git branch: 'feature-chaimaktari', url: 'https://github.com/gramiaziz/5se1-gr7-coconsult-frontend.git'
            }
        }

        stage('Build Frontend') {
            steps {
                // Installation des dépendances avec gestion des conflits
                sh 'npm install --legacy-peer-deps'
                // Installation des dépendances supplémentaires
                sh 'npm install moment --save'
                sh 'npm install @types/moment --save-dev'
                // Build du projet Angular
                sh 'ng build'
            }
        }

        stage('Docker Build Frontend') {
            steps {
                script {
                    // Construction de l'image Docker pour le frontend
                    sh "docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Push Frontend Docker Image to Docker Hub') {
            steps {
                script {
                    // Utilisation des credentials Docker Hub
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        retry(3) { // Tentatives de réessayer en cas d'échec jusqu'à 3 fois
                            // Connexion à Docker Hub
                            sh script: "echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USERNAME --password-stdin", returnStdout: true
                            
                            // Tag de l'image Docker
                            sh "docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} \$DOCKER_USERNAME/${DOCKER_IMAGE}:${IMAGE_TAG}"
                            
                            // Push de l'image Docker vers Docker Hub
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
                // Envoi d'un message de succès vers Slack avec le nom de l'image et du tag
                slackSend(channel: '#jenkins-messg', 
                          message: "Le build de pipeline Frontend a réussi : ${env.JOB_NAME} #${env.BUILD_NUMBER} ! Image pushed: ${DOCKER_IMAGE}:${IMAGE_TAG} successfully.")
            }
        }
        failure {
            script {
                // Envoi d'un message d'échec vers Slack
                slackSend(channel: '#jenkins-messg', 
                          message: "Le build de pipeline Frontend a échoué : ${env.JOB_NAME} #${env.BUILD_NUMBER}.")
            }
        }
    }
}
