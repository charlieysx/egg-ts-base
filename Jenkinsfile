pipeline {
    agent {
        label 'docker'
    }

    environment {
        NODE_PORT = 3200
    }

    stages {
        stage('Build') {
            steps {
                sh 'printenv'
                // sh 'npm config set registry http://registry.npm.taobao.org/ && npm install && npm run ci'
            }
        }

        stage('Deploy') {
            when { branch 'master' }
            steps {
                script {
                    def name = 'custom_egg_test'
                    def registry = 'https://registry.cn-shenzhen.aliyuncs.com'
                    def namespace = 'custom'
                    echo "Deploying to ${name} in ${registry}"
                    echo "打包api docker"
                    docker.withRegistry(registry) {
                        def image = docker.build("${namespace}/${name}:${env.BUILD_ID}","-f docker/Dockerfile.api.prod .")
                        image.push()
                        image.push('latest')
                    }
                }
            }
        }

        stage('Test') {
            when { branch 'develop' }
            steps {
                script {
                    def name = 'custom_egg_test_test'
                    def registry = 'https://registry.cn-shenzhen.aliyuncs.com'
                    def namespace = 'custom'
                    echo "Deploying to ${name} in ${registry}"
                    echo "打包api docker"
                    docker.withRegistry(registry) {
                        def image = docker.build("${namespace}/${name}:${env.BUILD_ID}","-f docker/Dockerfile.api.prod .")
                        image.push()
                        image.push('latest')
                    }
                }
            }
        }
    }

    post {
      always {
        echo 'clean up!'
        cleanWs()
      }
    }
}
