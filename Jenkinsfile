pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'npm test'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
    stage('Start Service') {
      steps {
        echo 'Do stuff here'
      }
    }
  }
}